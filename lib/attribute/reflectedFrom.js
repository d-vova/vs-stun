var util = require('../util');
var address = require('./address');

exports.encode = function encode ( packet, value ) {
  return address.encode(packet, value, 'reflected from');
}

exports.decode = function decode ( packet, value ) {
  return address.decode(packet, value, 'reflected from');
}

exports.TYPE = 0x000B;
exports.NAME = 'reflectedFrom';
