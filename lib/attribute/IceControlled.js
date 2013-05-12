var util = require('../util');
var Attribute = require('./Attribute');

var IceControlled = module.exports = function IceControlled ( message, object, padding ) {
  var type = IceControlled.TYPE;
  this.name = IceControlled.NAME;

  var value = object ? new Buffer(object, 'hex') : util.generate(8);

  Attribute.call(this, type, value, padding, object);
}

IceControlled.prototype = new Attribute();

IceControlled.TYPE = 0x8029;
IceControlled.NAME = 'iceControlled';

IceControlled.parse = function parse ( message, value, padding ) {
  return new IceControlled(message, value.toString('hex'), padding);
}
