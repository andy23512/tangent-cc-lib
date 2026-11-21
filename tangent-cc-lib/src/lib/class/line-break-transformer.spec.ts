import { LineBreakTransformer } from './line-break-transformer.js';

function fakeController() {
  const lines: string[] = [];
  const controller = { enqueue: (line: string) => lines.push(line) } as unknown as TransformStreamDefaultController<string>;
  return { lines, controller };
}

async function run(chunks: string[], separator = '\n') {
  const stream = new ReadableStream<string>({
    start(c) {
      chunks.forEach((chunk) => c.enqueue(chunk));
      c.close();
    },
  }).pipeThrough(new TransformStream(new LineBreakTransformer(separator)));
  const out: string[] = [];
  const reader = stream.getReader();
  for (;;) {
    const { value, done } = await reader.read();
    if (done) return out;
    out.push(value);
  }
}

describe('LineBreakTransformer.transform', () => {
  it('sends out each finished line and holds back the unfinished rest', () => {
    const t = new LineBreakTransformer('\n');
    const { lines, controller } = fakeController();
    t.transform('one\ntwo\nthr', controller);
    expect(lines).toEqual(['one', 'two']);
  });

  it('sends nothing while there is no line break', () => {
    const t = new LineBreakTransformer('\n');
    const { lines, controller } = fakeController();
    t.transform('abc', controller);
    t.transform('def', controller);
    expect(lines).toEqual([]);
  });

  it('joins a line that arrives in pieces', () => {
    const t = new LineBreakTransformer('\n');
    const { lines, controller } = fakeController();
    t.transform('he', controller);
    t.transform('llo\nwor', controller);
    t.transform('ld\n', controller);
    expect(lines).toEqual(['hello', 'world']);
  });

  it('sends an empty line for two line breaks in a row', () => {
    const t = new LineBreakTransformer('\n');
    const { lines, controller } = fakeController();
    t.transform('a\n\nb\n', controller);
    expect(lines).toEqual(['a', '', 'b']);
  });

  it('leaves a carriage return in the line (the caller trims it)', () => {
    const t = new LineBreakTransformer('\n');
    const { lines, controller } = fakeController();
    t.transform('ID ONE\r\n', controller);
    expect(lines).toEqual(['ID ONE\r']);
  });

  it('splits on the character it was given', () => {
    const t = new LineBreakTransformer(';');
    const { lines, controller } = fakeController();
    t.transform('a;b\nc;d', controller);
    expect(lines).toEqual(['a', 'b\nc']);
  });
});

describe('LineBreakTransformer.flush', () => {
  it('sends out what is left over', () => {
    const t = new LineBreakTransformer('\n');
    const { lines, controller } = fakeController();
    t.transform('a\nrest', controller);
    t.flush(controller);
    expect(lines).toEqual(['a', 'rest']);
  });

  it('sends an empty string when nothing is left (consumers must ignore empty lines)', () => {
    const t = new LineBreakTransformer('\n');
    const { lines, controller } = fakeController();
    t.transform('a\n', controller);
    t.flush(controller);
    expect(lines).toEqual(['a', '']);
  });
});

describe('LineBreakTransformer in a stream', () => {
  it('turns chunks into lines, whatever way the text was cut', async () => {
    expect(await run(['he', 'llo\nwor', 'ld\nbye'])).toEqual(['hello', 'world', 'bye']);
  });

  it('ends with an empty string after a final line break', async () => {
    expect(await run(['a\nb\n'])).toEqual(['a', 'b', '']);
  });

  it('gives one empty string for no input', async () => {
    expect(await run([])).toEqual(['']);
  });

  it('gives the same lines for any cut of the same text', async () => {
    const text = 'VERSION 2.2.0\r\nID CHARACHORDER ONE M0\r\nCML C0 3\r\n';
    const whole = await run([text]);
    for (let cut = 1; cut < text.length; cut += 3) {
      expect(await run([text.slice(0, cut), text.slice(cut)])).toEqual(whole);
    }
  });
});
