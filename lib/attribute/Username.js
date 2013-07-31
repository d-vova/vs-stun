var util = require('../util');

exports.encode = function encode ( packet, value ) {
  var result = new Buffer(value || '');

  if ( result.length > 512 ) {
    return new Error('invalid username');
  }

  return result;
}

exports.decode = function decode ( packet, value ) {
  if ( value.length > 512 ) {
    return new Error('invalid username');
  }

  return value.toString();
}

exports.TYPE = 0x0006;
exports.NAME = 'username';
