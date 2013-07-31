var util = require('../util');

exports.encode = function encode ( packet, value ) {
  var result = new Buffer(4);

  result.writeUInt32BE(value || 0, 0);

  return result;
}

exports.decode = function decode ( packet, value ) {
  if ( value.length != 4 ) {
    return new Error('invalid priority');
  }

  return value.readUInt32BE(0);
}

exports.TYPE = 0x0024;
exports.NAME = 'priority';
