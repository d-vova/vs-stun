var util = require('../util');

exports.encode = function encode ( packet, value ) {
  var result = new Buffer(value || '');

  return result;
}

exports.decode = function decode ( packet, value ) {
  return value.toString();
}

exports.TYPE = 0x0007;
exports.NAME = 'password';
