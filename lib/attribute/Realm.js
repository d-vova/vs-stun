var util = require('../util');
var Attribute = require('./Attribute');

var Realm = module.exports = function Realm ( message, object, padding ) {
  var type = Realm.TYPE;
  this.name = Realm.NAME;

  var value = new Buffer(object || '');

  Attribute.call(this, type, value, padding, object);
}

Realm.prototype = new Attribute();

Realm.TYPE = 0x0014;
Realm.NAME = 'realm';

Realm.parse = function parse ( message, value, padding ) {
  return new Realm(message, value.toString(), padding);
}
