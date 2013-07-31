var util = require('../util');

exports.encode = function encode ( packet, value ) {
  var value = value || { }

  if ( !value.reason ) {
    switch ( value.code ) {
      case 300: value.reason = 'Try Alternate'; break;
      case 400: value.reason = 'Bad Request'; break;
      case 401: value.reason = 'Unauthorized'; break;
      case 420: value.reason = 'Unknown Attribute'; break;
      case 438: value.reason = 'Stale Nonce'; break;
      case 500: value.reason = 'Server Error'; break;
      default: value.reason = '';
    }
  }

  if ( !value.code ) {
    return new Error('invalid error code');
  }

  if ( value.reason.length >= 128 ) {
    return new Error('invalid error code');
  }

  if ( value.code < 300 || value.code >= 700 ) {
    return new Error('invalid error code');
  }

  var result = new Buffer(4 + value.reason.length);

  result.writeUInt16BE(0, 0);
  result.writeUInt8(value.code / 100 | 0, 2);
  result.writeUInt8(value.code % 100, 3);
  result.write(value.reason, 4);

  return result;
}

exports.decode = function decode ( packet, value ) {
  var result = {
    code: value.readUInt8(2) * 100 + value.readUInt8(3) % 100,
    reason: value.toString('utf8', 4)
  }

  if ( result.reason.length >= 128 ) {
    return new Error('invalid error code');
  }

  if ( result.code < 300 || result.code >= 700 ) {
    return new Error('invalid error code');
  }

  return result;
}

exports.TYPE = 0x0009;
exports.NAME = 'errorCode';
