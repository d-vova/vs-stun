var util = require('../util');
var address = require('./address');

exports.encode = function encode ( packet, value ) {
  return address.encode(packet, value, 'response address');
}

exports.decode = function decode ( packet, value ) {
  return address.decode(packet, value, 'response address');
}

exports.TYPE = 0x0002;
exports.NAME = 'responseAddress';
