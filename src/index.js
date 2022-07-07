const pb = require('protobufjs');
const ByteBuffer = require('bytebuffer');
const Long = require('long');

const normalizeProto = (proto) => {
  if (!proto || proto['/']) {
    return proto;
  }
  if (proto.length > 0) {
    return { '/': proto };
  }
};

const isBuffer = (buf) => {
  if (typeof ArrayBuffer === 'function' && buf instanceof ArrayBuffer) {
    return true;
  }
  if (typeof Buffer === 'function' && typeof Buffer.isBuffer === 'function') {
    return Buffer.isBuffer(buf);
  }
  return false;
}

const bufferAsStrings = (...buffer) => ByteBuffer.concat(buffer).toUTF8();

const decodeBuffer = (obj, clone) => {
  if (isBuffer(obj)) {
    return bufferAsStrings(obj);
  }
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  let result = obj;
  if (clone) {
    result = Array.isArray(obj) ? [] : {};
  }
  Object.keys(obj).forEach((key) => {
    result[key] = decodeBuffer(obj[key], clone);
  });
  return result;
};

class Proto {
  constructor(proto) {
    const protos = normalizeProto(proto);
    if (!protos) {
      throw new Error('proto is empty.');
    }
    const { fetch } = pb.Util;
    pb.Util.fetch = (filename) => {
      let ctn = protos[filename];
      if (ctn) {
        return ctn;
      }
      const fragments = filename.trim().split(/[/\\]/);
      for (let i = 0, len = fragments.length; i < len; i++) {
        const relPath = fragments.slice(i).join('/');
        ctn = protos[relPath] || protos[`./${relPath}`];
        if (ctn) {
          return ctn;
        }
      }
    };
    const builder = pb.loadProtoFile('/');
    builder.build('js');
    this._builder = builder;
    pb.Util.fetch = fetch;
  }

  lookup(path) {
    const fragments = path.split('.');
    let { result } = this._builder;
    for (let i = 0, len = fragments.length; i < len; i++) {
      result = result[fragments[i]];
      if (!result) {
        return;
      }
    }
    const { encode, decode } = result;
    if (!result.__encode__) {
      result.__encode__ = encode;
      result.__decode__ = decode;
      result.encode = function(data, options) {
        return result.__encode__(data, options?.buffer, options?.noVerify);
      };
      result.decode = function(data, options) {
        let length;
        let encoding;
        let longs = true;
        let base64;
        if (typeof options === 'string') {
          encoding = options;
        } else if (typeof options === 'number') {
          length = options;
        } else if (options) {
          length = options.length;
          encoding = options.encoding;
          base64 = options.binaryAsBase64;
          longs = options.longsAsStrings || options.longsAsStrings == null;
        }
        data = result.__decode__(data, length, encoding).toRaw(base64, longs); // eslint-disable-line
        if (options?.bufferAsStrings) {
          decodeBuffer(data);
        }
        return data;
      };
    }
    return result;
  }

  encode(path, data, options) {
    return this.lookup(path).encode(data, options);
  }

  decode(path, data, options) {
    return this.lookup(path).decode(data, options);
  }
}

Proto.ByteBuffer = ByteBuffer;
Proto.Long = Long;
Proto.protobufjs = pb;
Proto.isBuffer = isBuffer;
Proto.decodeBuffer = (obj, clone) => decodeBuffer(obj, clone || clone == null);

module.exports = Proto;
