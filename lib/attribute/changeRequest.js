var util = require('../util');

exports.encode = function encode ( packet, value ) {
  var result = new Buffer(4);

  var host = value && value.host ? 4 : 0;
  var port = value && value.port ? 2 : 0;

  result.writeUInt32BE(host + port, 0);

  return result;
}

exports.decode = function decode ( packet, value ) {
  if ( value.length != 4 ) {
    return new Error('invalid change request');
  }

  var flags = value.readUInt32BE(0);

  return { host: !!(flags & 0x4), port: !!(flags & 0x2) }
}

exports.TYPE = 0x0003;
exports.NAME = 'changeRequest';
