var util = require('../util');
var error = require('../error');
var Attribute = require('./Attribute');

var AlternateServer = module.exports = function AlternateServer ( message, object, padding ) {
  var type = AlternateServer.TYPE;
  this.name = AlternateServer.NAME;

  var value, family = object.family || util.address.FAMILY.IPv4;
  var port = object.port || 0, address = object.address || '';
  
  switch ( object.family ) {
    case util.address.family.IPv4: {
      value = new Buffer(8); value.fill(0);

      value.writeUInt8(object.padding || 0, 0);
      value.writeUInt8(0x01, 1);
      value.writeUInt16BE(object.port || 0, 2);

      var parts = (object.address || '').split('.');

      for ( var i = 0; i < 4; i += 1 ) {
        value.writeUInt8(parseInt(parts[i], 10) || 0, 4 + i);
      }
    } break;
    case util.address.family.IPv6: {
      value = new Buffer(20); value.fill(0);

      value.writeUInt8(object.padding || 0, 0);
      value.writeUInt8(0x02, 1);
      value.writeUInt16BE(object.port || 0, 2);
      
      var parts = (object.address || '').split(':');

      for ( var i = 0; i < 8; i += 1 ) {
        value.writeUInt16BE(parseInt(parts[i], 16) || 0, 4 + i * 2);
      }
    } break;
  }
  
  Attribute.call(this, type, value, padding, object);
}

AlternateServer.prototype = new Attribute();

AlternateServer.TYPE = 0x8023;
AlternateServer.NAME = 'alternateServer';

AlternateServer.parse = function parse ( message, value, padding ) {
  if ( value.length < 4 ) {
    return error.attribute.length(value.length, 4);
  }
  
  var parts = [ ], object = {
    port: value.readUInt16BE(2),
    padding: value.readUInt8(0)
  }

  switch ( value.readUInt8BE(1) ) {
    case 0x01: {
      object.family = util.address.family.IPv4;

      if ( value.length != 8 ) {
        return error.attribute.length(value.length, 8);
      }

      for ( var i = 0; i < 4; i += 1 ) {
        parts.push(value.readUInt8(4 + i));
      }

      object.address = parts.join('.');
    } break;
    case 0x02: {
      object.family = util.address.family.IPv6;

      if ( value.length != 20 ) {
        return error.attribute.length(value.length, 16);
      }

      for ( var i = 0; i < 8; i += 1 ) {
        parts.push(value.toString('hex', 4 + i * 2, 6 + i * 2));
      }

      object.address = parts.join(':');
    } break;
    default: {
      return error.bad.attribute.parse(value.toString('hex'));
    }
  }

  return new AlternateServer(message, object, padding);
}
