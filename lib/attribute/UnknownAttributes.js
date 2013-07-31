var util = require('../util');

exports.encode = function encode ( packet, value ) {
  var attributes = value || [ ];
  var result = new Buffer(value.length * 2);

  for ( var i = 0; i < attributes.length; i += 1 ) {
    result.writeUInt16BE(attributes[i], i * 2);
  }

  return result;
}

exports.decode = function decode ( packet, value ) {
  if ( value.length % 2 != 0 ) {
    return new Error('invalid unknown attributes');
  }

  var result = [ ];

  for ( var i = 0; i < value.length; i += 2 ) {
    result.push(value.readUInt16BE(i));
  }

  return result;
}

exports.TYPE = 0x000a;
exports.NAME = 'unknownAttributes';
