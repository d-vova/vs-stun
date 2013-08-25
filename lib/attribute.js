var ATTRIBUTE = {
  alternateServer   : require('./Attribute/alternateServer'),
  changeRequest     : require('./Attribute/changeRequest'),
  changedAddress    : require('./Attribute/changedAddress'),
  errorCode         : require('./Attribute/errorCode'),
  fingerprint       : require('./Attribute/fingerprint'),
  iceControlled     : require('./Attribute/iceControlled'),
  iceControlling    : require('./Attribute/iceControlling'),
  mappedAddress     : require('./Attribute/mappedAddress'),
  messageIntegrity  : require('./Attribute/messageIntegrity'),
  nonce             : require('./Attribute/nonce'),
  otherAddress      : require('./Attribute/otherAddress'),
  padding           : require('./Attribute/padding'),
  password          : require('./Attribute/password'),
  priority          : require('./Attribute/priority'),
  realm             : require('./Attribute/realm'),
  reflectedFrom     : require('./Attribute/reflectedFrom'),
  responseAddress   : require('./Attribute/responseAddress'),
  responseOrigin    : require('./Attribute/responseOrigin'),
  responsePort      : require('./Attribute/responsePort'),
  software          : require('./Attribute/software'),
  sourceAddress     : require('./Attribute/sourceAddress'),
  unknownAttributes : require('./Attribute/unknownAttributes'),
  useCandidate      : require('./Attribute/useCandidate'),
  username          : require('./Attribute/username'),
  xorMappedAddress  : require('./Attribute/xorMappedAddress')
}

var TYPE = { }

for ( var name in ATTRIBUTE ) TYPE[ATTRIBUTE[name].TYPE] = ATTRIBUTE[name];


var Attribute = module.exports = function Attribute ( name, obj, raw, pattern ) {
  var attribute = ATTRIBUTE[name] || new Attribute.Unknown(name);
  var value = raw || new Buffer(0);
  var type = new Buffer(2), length = new Buffer(2);
  var pattern = new Buffer(pattern || '00', 'hex');
  var padding = new Buffer((4 - value.length % 4) % 4);

  type.writeUInt16BE(attribute.TYPE, 0);
  length.writeUInt16BE(value.length, 0);

  for ( var i = 0; i < padding.length; i += 1 ) {
    padding[i] = pattern[i % pattern.length];
  }

  this.name = name;
  this.raw = Buffer.concat([ type, length, value, padding ]);

  this.type    = { obj: attribute.TYPE,          raw: type }
  this.length  = { obj: value.length,            raw: length }
  this.value   = { obj: obj,                     raw: value }
  this.padding = { obj: padding.toString('hex'), raw: padding }
}

Attribute.prototype.toString = function toString ( ) {
  var string = [
    Attribute.typeToString(this),
    '=>',
    Attribute.paddingToString(this),
    '-',
    Attribute.lengthToString(this),
    '-',
    Attribute.valueToString(this)
  ];

  return string.join('     ');
}


Attribute.Unknown = function UnknownAttribute ( type ) {
  this.TYPE = parseInt(type);
  this.NAME = 'unknownAttribute';
}

Attribute.Unknown.prototype.encode = function encode ( packet, value ) {
  return new Buffer(value || '', 'hex');
}

Attribute.Unknown.prototype.decode = function decode ( packet, value ) {
  return value.toString('hex');
}


Attribute.expand = function expand ( packet ) {
  for ( var name in ATTRIBUTE ) {
    Attribute.expand.attribute(packet, name);
  }
}

Attribute.expand.attribute = function expandAttribute ( packet, name ) {
  packet.append[name] = function append ( obj, pattern ) {
    var raw = ATTRIBUTE[name].encode(packet, obj);
    if ( raw instanceof Error ) return raw;

    var obj = ATTRIBUTE[name].decode(packet, raw);
    if ( obj instanceof Error ) return obj;

    var pattern = new Buffer(pattern || '00', 'hex');
    var attribute = new Attribute(name, obj, raw, pattern);

    return packet.append(attribute);
  }
}

//Attribute.expand.check = function expandCheck ( packet, name ) {
//  if ( packet.doc.attribute.fingerprint ) {
//    return new Error('fingerprint was the last attribute');
//  }
//
//  if ( packet.doc.attribute.messageIntegrity ) {
//    if ( name != ATTRIBUTE.fingerprint.NAME ) {
//      return new Error('only fingerprint can follow message integrity');
//    }
//  }
//
//  switch ( name ) {
//    case ATTRIBUTE.changeRequest.NAME: {
//      if ( !(packet.doc.type.obj & 0x0001) ) {
//        return new Error('change request requires a binding request packet type');
//      }
//    } break;
//    case ATTRIBUTE.errorCode.NAME: {
//      if ( !(packet.doc.type.obj & 0x0010) ) {
//        return new Error('error code requires an error response packet type');
//      }
//    } break;
//    case ATTRIBUTE.iceControlled.NAME: {
//      if ( packet.doc.attribute.iceControlling ) {
//        return new Error('ice controlling is already present');
//      }
//    } break;
//    case ATTRIBUTE.iceControlling.NAME: {
//      if ( packet.doc.attribute.iceControlled ) {
//        return new Error('ice controlled is already present');
//      }
//    } break;
//    case ATTRIBUTE.unknownAttributes.NAME: {
//      if ( !packet.doc.attribute.errorCode ) {
//        return new Error('error code must be present');
//      }
//      else if ( packet.doc.attribute.errorCode.obj != 420 ) {
//        return new Error('unknown attributes require 420 error code');
//      }
//    } break;
//  }
//}

Attribute.parse = function parse ( packet, data ) {
  if ( !Attribute.parse.check(packet, data) ) {
    return new Error('invalid attribute');
  }

  var error, offset = packet.raw.length;

  var type = data.readUInt16BE(offset);
  var length = data.readUInt16BE(offset + 2);

  var begin = offset + 4 + length;
  var end = begin + (4 - length % 4) % 4;

  var name = TYPE[type] ? TYPE[type].NAME : type;
  var raw = data.slice(offset + 4, offset + 4 + length);
  var obj = ATTRIBUTE[name].decode(packet, raw);
  var pattern = data.toString('hex', begin, end);

  if ( obj instanceof Error ) return obj;

  return new Attribute(name, obj, raw, pattern);
}

Attribute.parse.check = function parseCheck ( packet, data ) {
  var offset = packet.raw.length;

  if ( data.length - offset < 4 ) return false;
  if ( (data.length - offset) % 4 != 0 ) return false;

  var length = data.readUInt16BE(offset + 2);

  return offset + 4 + length + (4 - length % 4) % 4 <= data.length;
}


Attribute.typeToString = function typeToString ( attribute ) {
  var type = '(0x' + attribute.type.raw.toString('hex') + ') ';

  switch ( attribute.type.obj ) {
    case ATTRIBUTE.alternateServer.TYPE   : return type + 'ALTERNATE SERVER    ';
    case ATTRIBUTE.changeRequest.TYPE     : return type + 'CHANGE REQUEST      ';
    case ATTRIBUTE.changedAddress.TYPE    : return type + 'CHANGED ADDRESS     ';
    case ATTRIBUTE.errorCode.TYPE         : return type + 'ERROR CODE          ';
    case ATTRIBUTE.fingerprint.TYPE       : return type + 'FINGERPRINT         ';
    case ATTRIBUTE.iceControlled.TYPE     : return type + 'ICE CONTROLLED      ';
    case ATTRIBUTE.iceControlling.TYPE    : return type + 'ICE CONTROLLING     ';
    case ATTRIBUTE.mappedAddress.TYPE     : return type + 'MAPPED ADDRESS      ';
    case ATTRIBUTE.messageIntegrity.TYPE  : return type + 'MESSAGE INTEGRITY   ';
    case ATTRIBUTE.nonce.TYPE             : return type + 'NONCE               ';
    case ATTRIBUTE.otherAddress.TYPE      : return type + 'OTHER ADDRESS       ';
    case ATTRIBUTE.padding.TYPE           : return type + 'PADDING             ';
    case ATTRIBUTE.password.TYPE          : return type + 'PASSWORD            ';
    case ATTRIBUTE.priority.TYPE          : return type + 'PRIORITY            ';
    case ATTRIBUTE.realm.TYPE             : return type + 'REALM               ';
    case ATTRIBUTE.reflectedFrom.TYPE     : return type + 'REFLECTED FROM      ';
    case ATTRIBUTE.responseAddress.TYPE   : return type + 'RESPONSE ADDRESS    ';
    case ATTRIBUTE.responseOrigin.TYPE    : return type + 'RESPONSE ORIGIN     ';
    case ATTRIBUTE.responsePort.TYPE      : return type + 'RESPONSE PORT       ';
    case ATTRIBUTE.software.TYPE          : return type + 'SOFTWARE            ';
    case ATTRIBUTE.sourceAddress.TYPE     : return type + 'SOURCE ADDRESS      ';
    case ATTRIBUTE.unknownAttributes.TYPE : return type + 'UNKNOWN ATTRIBUTES  ';
    case ATTRIBUTE.useCandidate.TYPE      : return type + 'USE CANDIDATE       ';
    case ATTRIBUTE.username.TYPE          : return type + 'USERNAME            ';
    case ATTRIBUTE.xorMappedAddress.TYPE  : return type + 'XOR MAPPED ADDRESS  ';
    default: return type + 'UNKNOWN ATTRIBUTE   ';
  }
}

Attribute.lengthToString = function lengthToString ( attribute ) {
  var info = 'VALUE LENGTH:';

  if ( attribute.length.obj < 10 ) return info + '   ' + attribute.length.obj;
  if ( attribute.length.obj < 100 ) return info + '  ' + attribute.length.obj;
  if ( attribute.length.obj < 1000 ) return info + ' ' + attribute.length.obj;

  return new Error('INVALID VALUE LENGTH'); 
}

Attribute.valueToString = function valueToString ( attribute ) {
  return 'VALUE: ' + JSON.stringify(attribute.value.obj);
}

Attribute.paddingToString = function paddingToString ( attribute ) {
  var info = 'PADDING:';

  if ( attribute.padding.raw.length == 0 ) return info + '       ';
  if ( attribute.padding.raw.length == 1 ) return info + '     ' + attribute.padding.obj;
  if ( attribute.padding.raw.length == 2 ) return info + '   ' + attribute.padding.obj;
  if ( attribute.padding.raw.length == 3 ) return info + ' ' + attribute.padding.obj;

  return new Error('INVALID PADDING LENGTH');
}
