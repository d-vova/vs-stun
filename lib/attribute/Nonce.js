var util = require('../util');
var Attribute = require('./Attribute');

var Nonce = module.exports = function Nonce ( message, object, padding ) {
  var type = Nonce.TYPE;
  this.name = Nonce.NAME;

  var value = new Buffer(object || '');

  Attribute.call(this, type, value, padding, object);
}

Nonce.prototype = new Attribute();

Nonce.TYPE = 0x0015;
Nonce.NAME = 'nonce';

Nonce.parse = function parse ( message, value, padding ) {
  return new Nonce(message, value.toString(), padding);
}
