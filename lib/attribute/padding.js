var util = require('../util');

exports.encode = function encode ( packet, value ) {
  var result = new Buffer(value || '');

  return result;
}

exports.decode = function decode ( packet, value ) {
  var result = value.toString();

  return result;
}

exports.TYPE = 0x0026;
exports.NAME = 'padding';
