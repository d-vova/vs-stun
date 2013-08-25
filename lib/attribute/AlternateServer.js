var util = require('../util');
var address = require('./address');

exports.encode = function encode ( packet, value ) {
  return address.encode(packet, value, 'alternate server');
}

exports.decode = function decode ( packet, value ) {
  return address.decode(packet, value, 'alternate server');
}

exports.TYPE = 0x8023;
exports.NAME = 'alternateServer';
