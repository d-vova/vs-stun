var util = require('../util');

exports.encode = function encode ( packet, value ) {
  var result = new Buffer(2);

  result.writeUInt16BE(value || 0, 0);

  return result;
}

exports.decode = function decode ( packet, value ) {
  if ( value.length != 2 ) {
    return new Error('invalid response port');
  }

  return value.readUInt16BE(0);
}

exports.TYPE = 0x0027;
exports.NAME = 'responsePort';
