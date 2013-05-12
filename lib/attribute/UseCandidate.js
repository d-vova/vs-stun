var util = require('../util');
var Attribute = require('./Attribute');

var UseCandidate = module.exports = function UseCandidate ( message, object, padding ) {
  var type = UseCandidate.TYPE;
  this.name = UseCandidate.NAME;

  var value = new Buffer(0);

  Attribute.call(this, type, value, padding, object);
}

UseCandidate.prototype = new Attribute();

UseCandidate.TYPE = 0x0025;
UseCandidate.NAME = 'useCanditate';

UseCandidate.parse = function parse ( message, value, padding ) {
  return new UseCandidate(message, true, padding);
}
