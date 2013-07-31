var util = require('../util');

exports.encode = function encode ( packet, value ) {
  var data = new Buffer(packet.raw);

  data.writeUInt16BE(data.length + 8 - 20, 2);

  return util.xor(util.crc32(data), MAGIC);
}

exports.decode = function decode ( packet, value ) {
  if ( value.length != 4 ) {
    return new Error('invalid fingerprint');
  }

  return value.toString('hex');
}

exports.TYPE = 0x8028;
exports.NAME = 'fingerprint';

var MAGIC = new Buffer([ 0x53, 0x54, 0x55, 0x4e ]);
