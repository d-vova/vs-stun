var util = require('../util');
var Attribute = require('./Attribute');

var Software = module.exports = function Software ( message, object, padding ) {
  var type = Software.TYPE;
  this.name = Software.NAME;

  var value = new Buffer(object || '');

  Attribute.call(this, type, value, padding, object);
}

Software.prototype = new Attribute();

Software.TYPE = 0x8022;
Software.NAME = 'software';

Software.parse = function parse ( message, value, padding ) {
  return new Software(message, value.toString(), padding);
}
