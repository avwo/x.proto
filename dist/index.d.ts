
export interface EncodeOptions {
  buffer?: ArrayBuffer;
  noVerify?: boolean;
}

export interface DecodeOptions {
  binaryAsBase64?: boolean;
  longsAsStrings?: boolean;
  bufferAsStrings?: boolean;
  length?: number;
  encoding?: string;
}

export interface ProtoCodec {
  encode(data: string | object, options?: EncodeOptions): ArrayBuffer;
  decode(data: string | ArrayBuffer, options?: DecodeOptions): any;
}

export function isBuffer(buffer: object): boolean;


export function decodeBuffer(buffer: object, clone?: boolean): boolean;

export default class Proto {
  constructor(proto: string | object);
  lookup(path: string): ProtoCodec;
  encode(path: string, data: string | object, options?: EncodeOptions): ArrayBuffer;
  decode(path: string, data: string | ArrayBuffer, options?: DecodeOptions): any;
}
