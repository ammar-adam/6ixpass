// Only the Code 128 encoder from jsbarcode is used (it turns text into bars); we draw the SVG ourselves.
declare module "jsbarcode/bin/barcodes/CODE128/CODE128B.js" {
  export default class CODE128B {
    constructor(data: string, options: Record<string, unknown>);
    valid(): boolean;
    encode(): { data: string; text: string };
  }
}
