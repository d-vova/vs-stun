var util = require('../util');
var address = require('./address');

exports.encode = function encode ( packet, value ) {
  return address.encode(packet, value, 'source address');
}

exports.decode = function decode ( packet, value ) {
  return address.decode(packet, value, 'source address');
}

exports.TYPE = 0x0004;
exports.NAME = 'sourceAddress';
