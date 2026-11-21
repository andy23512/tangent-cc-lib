import { DeviceLayout } from '../model/device-layout.models.js';
import { downloadDeviceLayout } from './device-layout.utils.js';

const LAYOUT = [[1, 2, 3], [4, 5, 6], [7, 8, 9]] as unknown as DeviceLayout['layout'];

function layout(name: string): DeviceLayout {
  return { id: 'x', name, layout: LAYOUT };
}

/** Stands in for the page: records the link that was made, what it pointed at and in what order things happened. */
function setup() {
  const events: string[] = [];
  const blobs: Blob[] = [];
  const anchor = {
    href: '',
    download: '',
    click: vi.fn(() => events.push('click')),
  };
  vi.stubGlobal('document', { createElement: vi.fn((tag: string) => (events.push(`create:${tag}`), anchor)) });
  const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockImplementation((blob) => {
    blobs.push(blob as Blob);
    events.push('createObjectURL');
    return 'blob:fake-url';
  });
  const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {
    events.push('revoke');
  });
  return { events, blobs, anchor, createObjectURL, revokeObjectURL };
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('downloadDeviceLayout', () => {
  it('saves a JSON file with the layout, for a CharaChorder Two unless told otherwise', async () => {
    const { blobs } = setup();
    downloadDeviceLayout(layout('mine'));
    expect(blobs).toHaveLength(1);
    expect(blobs[0].type).toBe('application/json');
    expect(JSON.parse(await blobs[0].text())).toEqual({ charaVersion: 1, type: 'layout', device: 'TWO', layout: LAYOUT });
  });

  it('writes the device it was given', async () => {
    const { blobs } = setup();
    downloadDeviceLayout(layout('mine'), 'LITE');
    expect(JSON.parse(await blobs[0].text()).device).toBe('LITE');
  });

  it('writes only the layout, not the id or name', async () => {
    const { blobs } = setup();
    downloadDeviceLayout(layout('mine'));
    expect(Object.keys(JSON.parse(await blobs[0].text())).sort()).toEqual(['charaVersion', 'device', 'layout', 'type']);
  });

  it('points a link at the file, names it, and clicks it', () => {
    const { anchor } = setup();
    downloadDeviceLayout(layout('mine'));
    expect(anchor.href).toBe('blob:fake-url');
    expect(anchor.download).toBe('mine.json');
    expect(anchor.click).toHaveBeenCalledTimes(1);
  });

  it('gives back the temporary address only after the click', () => {
    const { events, revokeObjectURL } = setup();
    downloadDeviceLayout(layout('mine'));
    expect(events).toEqual(['createObjectURL', 'create:a', 'click', 'revoke']);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:fake-url');
  });

  describe('file name', () => {
    const nameFor = (name: string) => {
      const { anchor } = setup();
      downloadDeviceLayout(layout(name));
      return anchor.download;
    };

    it('adds .json', () => {
      expect(nameFor('layout')).toBe('layout.json');
    });

    it('does not double a .json that is already there', () => {
      expect(nameFor('layout.json')).toBe('layout.json');
    });

    it('removes only one trailing .json', () => {
      expect(nameFor('a.json.json')).toBe('a.json.json');
    });

    it('keeps a .json in the middle of the name', () => {
      expect(nameFor('a.json-copy')).toBe('a.json-copy.json');
    });

    it('is case sensitive about the extension', () => {
      expect(nameFor('LAYOUT.JSON')).toBe('LAYOUT.JSON.json');
    });

    it('keeps spaces and non-Latin characters', () => {
      expect(nameFor('我的 配列')).toBe('我的 配列.json');
    });

    it('gives just .json for an empty name', () => {
      expect(nameFor('')).toBe('.json');
    });
  });
});
