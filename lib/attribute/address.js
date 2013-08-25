var util = require('../util');

exports.encode = function encode ( packet, value, name ) {
  var result, value = util.normalize.address(value);

  if ( !value ) return new Error('invalid ' + name);

  switch ( value.family ) {
    case util.IPv4: {
      result = new Buffer(8);
      result.writeUInt8(0x01, 1);

      if ( value.host.length != 4 ) {
        return new Error('invalid host of ' + name);
      }

      for ( var i = 0; i < 4; i += 1 ) {
        result.writeUInt8(value.host[i], 4 + i);
      }
    } break;
    case util.IPv6: {
      result = new Buffer(20);
      result.writeUInt8(0x02, 1);

      if ( value.host.length != 8 ) {
        return new Error('invalid host of ' + name);
      }

      for ( var i = 0; i < 8; i += 1 ) {
        result.writeUInt16BE(value.host[i], 4 + i * 2);
      }
    } break;
  }

  result.writeUInt8(0, 0);
  result.writeUInt16BE(value.port, 2);

  return result;
}

exports.decode = function decode ( packet, value, name ) {
  var result = { host: [ ], port: value.readUInt16BE(2) }

  switch ( value.readUInt8(1) ) {
    case 0x01: {
      if ( value.length != 8 ) return new Error('invalid ' + name);

      result.family = util.IPv4;

      for ( var i = 0; i < 4; i += 1 ) {
        result.host.push(value.readUInt8(4 + i));
      }

      result.host = result.host.join('.');
    } break;
    case 0x02: {
      if ( value.length != 20 ) return new Error('invalid ' + name);

      result.family = util.IPv6;

      for ( var i = 0; i < 8; i += 1 ) {
        result.host.push(value.toString('hex', 4 + i * 2, 6 + i * 2));
      }

      result.host = result.host.join(':');
    } break;
    default: return new Error('invalid ' + name);
  }

  return result;
}
