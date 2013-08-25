var util = require('../util');
var address = require('./address');

exports.encode = function encode ( packet, value ) {
  var result = address.encode(packet, value, 'xor mapped address');

  var key = packet.raw.slice(4, 20);
  util.xor(result.slice(2, 4), key).copy(result, 2);
  util.xor(result.slice(4), key).copy(result, 4);

  return result;
}

exports.decode = function decode ( packet, value ) {
  var value = new Buffer(value);

  var key = packet.raw.slice(4, 20);
  util.xor(value.slice(2, 4), key).copy(value, 2);
  util.xor(value.slice(4), key).copy(value, 4);

  return address.decode(packet, value, 'xor mapped address');
}

exports.TYPE = 0x0020;
exports.NAME = 'xorMappedAddress';
