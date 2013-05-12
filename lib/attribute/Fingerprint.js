var util = require('../util');
var Attribute = require('./Attribute');

var Fingerprint = module.exports = function Fingerprint ( message, object, padding ) {
  var type = Fingerprint.TYPE;
  this.name = Fingerprint.NAME;

  var data = message.buffer;
  
  data.writeUInt16BE(message.length + 8, 2);
  var value = util.xor(util.crc32(data), MAGIC);
  data.writeUInt16BE(message.length - 8, 2);

  Attribute.call(this, type, value, padding, object);
}

Fingerprint.prototype = new Attribute();

Fingerprint.TYPE = 0x8028;
Fingerprint.NAME = 'fingerprint';

Fingerprint.parse = function parse ( message, value, padding ) {
  return new Fingerprint(message, value.toString('hex'), padding);
}

var MAGIC = new Buffer([ 0x53, 0x54, 0x55, 0x4e ]);
