var crypto = require('crypto');

var util = require('../util');

exports.encode = function encode ( packet, value ) {
  var username = packet.auth.username;
  var password = packet.auth.password;
  var realm = packet.doc.attribute.realm;

  realm = realm && realm.obj || '';

  var key, data = new Buffer(packet.raw);

  data.writeUInt16BE(data.length + 24 - 20, 2);

  if ( realm ) {
    var md5 = crypto.createHash('md5');

    md5.update([ username, realm, password ].join(':'));

    key = md5.digest();
  }
  else key = password;

  var hmac = crypto.createHmac('sha1', key);

  hmac.update(data);

  return new Buffer(hmac.digest());
}

exports.decode = function decode ( packet, value ) {
  if ( value.length != 20 ) {
    return new Error('invalid message integrity');
  }

  return value.toString('hex');
}

exports.TYPE = 0x0008;
exports.NAME = 'messageIntegrity';
