var util = require('../util');
var error = require('../error');
var Attribute = require('./Attribute');

var UnknownAttributes = module.exports = function UnknownAttributes ( message, object, padding ) {
  var type = UnknownAttributes.TYPE;
  this.name = UnknownAttributes.NAME;

  var object = object || [ ];
  var value = new Buffer(object.length * 2);

  for ( var i = 0; i < object.length; i += 1 ) {
    value.writeUInt16BE(object[i], i * 2);
  }

  Attribute.call(this, type, value, padding, object);
}

UnknownAttributes.prototype = new Attribute();

UnknownAttributes.TYPE = 0x000a;
UnknownAttributes.NAME = 'unknownAttributes';

UnknownAttributes.parse = function parse ( message, value, padding ) {
  var types = [ ];

  if ( value.length % 2 != 0 ) {
    return error.bad.attribute.parse(value.toString('hex'));
  }

  for ( var i = 0; i < value.length; i += 2 ) {
    types.push(value.readUInt16BE(i));
  }

  return new UnknownAttributes(message, types, padding);
}
