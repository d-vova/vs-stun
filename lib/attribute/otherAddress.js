var util = require('../util');
var address = require('./address');

exports.encode = function encode ( packet, value ) {
  return address.encode(packet, value, 'other address');
}

exports.decode = function decode ( packet, value ) {
  return address.decode(packet, value, 'other address');
}

exports.TYPE = 0x802C;
exports.NAME = 'otherAddress';
