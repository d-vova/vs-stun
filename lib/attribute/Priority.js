var util = require('../util');
var Attribute = require('./Attribute');

var Priority = module.exports = function Priority ( message, object, padding ) {
  var type = Priority.TYPE;
  this.name = Priority.NAME;

  var value = new Buffer(4); value.fill(0);

  value.writeUInt32BE(object || 0, 0);
  
  Attribute.call(this, type, value, padding, object);
}

Priority.prototype = new Attribute();

Priority.TYPE = 0x0024;
Priority.NAME = 'priority';

Priority.parse = function parse ( message, value, padding ) {
  var object = value.length >= 4 ? value.readUInt32BE(0) : 0;

  return new Priority(message, object, padding);
}
