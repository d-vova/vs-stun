var util = require('../util');
var address = require('./address');

exports.encode = function encode ( packet, value ) {
  return address.encode(packet, value, 'changed address');
}

exports.decode = function decode ( packet, value ) {
  return address.decode(packet, value, 'changed address');
}

exports.TYPE = 0x0005;
exports.NAME = 'changedAddress';
