var util = require('../util');
var address = require('./address');

exports.encode = function encode ( packet, value ) {
  return address.encode(packet, value, 'mapped address');
}

exports.decode = function decode ( packet, value ) {
  return address.decode(packet, value, 'mapped address');
}

exports.TYPE = 0x0001;
exports.NAME = 'mappedAddress';
