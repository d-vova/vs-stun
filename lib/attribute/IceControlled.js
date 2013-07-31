var util = require('../util');

exports.encode = function encode ( packet, value ) {
  var result = new Buffer(value || util.generate(8), 'hex');

  if ( result.length != 8 ) {
    return new Error('invalid ice controlled');
  }

  return result;
}

exports.decode = function decode ( packet, value ) {
  if ( value.length != 8 ) {
    return new Error('invalid ice controlled');
  }

  return value.toString('hex');
}

exports.TYPE = 0x8029;
exports.NAME = 'iceControlled';
