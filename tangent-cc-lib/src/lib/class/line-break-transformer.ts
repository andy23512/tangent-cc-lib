// Reference: https://github.com/archocron/ngx-serial/blob/fd1cf846cc5dba2bb2a935f44845d072964b566c/projects/ngx-serial/src/lib/ngx-serial.ts

export class LineBreakTransformer {
  private container = '';
  private readonly controlCharacter: string;

  constructor(controlCharacter: string) {
    this.controlCharacter = controlCharacter;
  }

  transform(
    chunk: string,
    controller: TransformStreamDefaultController<string>,
  ) {
    this.container += chunk;
    const lines = this.container.split(this.controlCharacter);
    this.container = lines.pop() as string;
    lines.forEach((line) => controller.enqueue(line));
  }

  flush(controller: TransformStreamDefaultController<string>) {
    controller.enqueue(this.container);
  }
}
