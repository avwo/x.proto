const fs = require('fs');
const path = require('path');
const pb = require('./dist').protobufjs;

const removeComments = (str) => str && `${str}`.replace(/\/\/[^\r\n]*/g, '');

module.exports = function protoLoader(source) {
  const { fetch } = pb.Util;
  const result = { '/': removeComments(source) };
  pb.Util.fetch = (filename) => {
    let curSrc = result[filename];
    if (curSrc != null) {
      return curSrc;
    }
    if (filename.indexOf('\\') !== -1) {
      filename = filename.split(/[/\\]/).slice(1).join('/'); // eslint-disable-line
    }
    if (filename[0] === '/') {
      filename = filename.substring(1); // eslint-disable-line
    }
    const absPath = path.join(this.context || '', filename);
    curSrc = fs.readFileSync(absPath, { encoding: 'utf-8' });
    curSrc = removeComments(curSrc);
    result[filename] = curSrc;
    return curSrc;
  };
  const builder = pb.loadProtoFile('/');
  builder.build('js');
  pb.Util.fetch = fetch;
  return `module.exports = ${JSON.stringify(result)};`;
};
