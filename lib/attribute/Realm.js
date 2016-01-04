var util = require('../util');

exports.encode = function encode ( packet, value ) {
  var result = new Buffer(value || '');

  if ( value.length >= 128 || result.length >= 764 ) {
    throw new Error('invalid realm');
  }

  return result;
}

exports.decode = function decode ( packet, value ) {
  var result = value.toString();

  if ( value.length >= 764 || result.length >= 128 ) {
    throw new Error('invalid realm');
  }

  return result;
}

exports.TYPE = 0x0014;
exports.NAME = 'realm';
