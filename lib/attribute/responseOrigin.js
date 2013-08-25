var util = require('../util');
var address = require('./address');

exports.encode = function encode ( packet, value ) {
  return address.encode(packet, value, 'response origin');
}

exports.decode = function decode ( packet, value ) {
  return address.decode(packet, value, 'response origin');
}

exports.TYPE = 0x802B;
exports.NAME = 'responseOrigin';
