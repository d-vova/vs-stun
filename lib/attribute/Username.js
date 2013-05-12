var util = require('../util');
var Attribute = require('./Attribute');

var Username = module.exports = function Username ( message, object, padding ) {
  var type = Username.TYPE;
  this.name = Username.NAME;

  var value = new Buffer(object || '');

  Attribute.call(this, type, value, padding, object);
}

Username.prototype = new Attribute();

Username.TYPE = 0x0006;
Username.NAME = 'username';

Username.parse = function parse ( message, value, padding ) {
  return new Username(message, value.toString(), padding);
}
