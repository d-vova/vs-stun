var util = require('../util');
var Attribute = require('./Attribute');

var IceControlling = module.exports = function IceControlling ( message, object, padding ) {
  var type = IceControlling.TYPE;
  this.name = IceControlling.NAME;

  var value = object ? new Buffer(object, 'hex') : util.generate(8);

  Attribute.call(this, type, value, padding, object);
}

IceControlling.prototype = new Attribute();

IceControlling.TYPE = 0x802a;
IceControlling.NAME = 'iceControlling';

IceControlling.parse = function parse ( message, value, padding ) {
  return new IceControlling(message, value.toString('hex'), padding);
}
