var crypto = require('crypto');

var util = require('../util');
var Attribute = require('./Attribute');

var MessageIntegrity = module.exports = function MessageIntegrity ( message, object, padding ) {
  var type = MessageIntegrity.TYPE;
  this.name = MessageIntegrity.NAME;

  var password = message.auth.password || '';
  var username = message.attribute.username || '';
  var key, realm = message.attribute.realm || '';

  if ( realm ) {
    var md5 = crypto.createHash('md5');

    md5.update([ username, realm, password ].join(':'));

    key = md5.digest();
  }
  else key = password;

  var data = message.buffer;
  var hmac = crypto.createHmac('sha1', key);

  data.writeUInt16BE(message.length + 24, 2);
  hmac.update(data);
  data.writeUInt16BE(message.length - 24, 2);

  var value = hmac.digest();
  
  Attribute.call(this, type, value, padding, object);
}

MessageIntegrity.prototype = new Attribute();

MessageIntegrity.TYPE = 0x0008;
MessageIntegrity.NAME = 'messageIntegrity';

MessageIntegrity.parse = function parse ( message, value, padding ) {
  return new MessageIntegrity(message, value.toString('hex'), padding);
}
