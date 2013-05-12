var util = require('../util');
var error = require('../error');
var Attribute = require('./Attribute');

var ErrorCode = module.exports = function ErrorCode ( message, object, padding ) {
  var type = ErrorCode.TYPE;
  this.name = ErrorCode.NAME;

  var object = object || { code: 0, reason: '' }
  object.code = object.code || 0;
  object.reason = object.reason || '';

  var value = new Buffer(4 + object.reason.length); value.fill(0);

  value.writeUInt8(object.code / 100 | 0, 2);
  value.writeUInt8(object.code % 100, 3);
  value.write(object.reason, 4);

  Attribute.call(this, type, value, padding, object);
}

ErrorCode.prototype = new Attribute();

ErrorCode.TYPE = 0x0009;
ErrorCode.NAME = 'errorCode';

ErrorCode.parse = function parse ( message, value, padding ) {
  if ( value.length < 4 ) {
    return error.bad.attribute.length(value.length, 4);
  }

  var object = {
    code: value.readUInt8(2) * 100 + value.readUInt8(3) % 100,
    reason: value.toString('utf8', 4)
  }

  return new ErrorCode(message, object, padding);
}
