var error = require('./error');


var Attribute         = exports.Attribute         = require('./attribute/Attribute');
var AlternateServer   = exports.AlternateServer   = require('./attribute/AlternateServer');
var ErrorCode         = exports.ErrorCode         = require('./attribute/ErrorCode');
var Fingerprint       = exports.Fingerprint       = require('./attribute/Fingerprint');
var IceControlled     = exports.IceControlled     = require('./attribute/IceControlled');
var IceControlling    = exports.IceControlling    = require('./attribute/IceControlling');
var MappedAddress     = exports.MappedAddress     = require('./attribute/MappedAddress');
var MessageIntegrity  = exports.MessageIntegrity  = require('./attribute/MessageIntegrity');
var Nonce             = exports.Nonce             = require('./attribute/Nonce');
var Priority          = exports.Priority          = require('./attribute/Priority');
var Realm             = exports.Realm             = require('./attribute/Realm');
var Software          = exports.Software          = require('./attribute/Software');
var UnknownAttributes = exports.UnknownAttributes = require('./attribute/UnknownAttributes');
var UseCandidate      = exports.UseCandidate      = require('./attribute/UseCandidate');
var Username          = exports.Username          = require('./attribute/Username');
var XORMappedAddress  = exports.XORMappedAddress  = require('./attribute/XORMappedAddress');


var TYPE = exports.TYPE = {
  ALTERNATE_SERVER   : AlternateServer.TYPE,
  ERROR_CODE         : ErrorCode.TYPE,
  FINGERPRINT        : Fingerprint.TYPE,
  ICE_CONTROLLED     : IceControlled.TYPE,
  ICE_CONTROLLING    : IceControlling.TYPE,
  MAPPED_ADDRESS     : MappedAddress.TYPE,
  MESSAGE_INTEGRITY  : MessageIntegrity.TYPE,
  NONCE              : Nonce.TYPE,
  PRIORITY           : Priority.TYPE,
  REALM              : Realm.TYPE,
  SOFTWARE           : Software.TYPE,
  UNKNOWN_ATTRIBUTES : UnknownAttributes.TYPE,
  USE_CANDIDATE      : UseCandidate.TYPE,
  USERNAME           : Username.TYPE,
  XOR_MAPPED_ADDRESS : XORMappedAddress.TYPE,
}


var ATTRIBUTE = { }

ATTRIBUTE[AlternateServer.TYPE]   = AlternateServer;
ATTRIBUTE[ErrorCode.TYPE]         = ErrorCode;
ATTRIBUTE[Fingerprint.TYPE]       = Fingerprint;
ATTRIBUTE[IceControlled.TYPE]     = IceControlled;
ATTRIBUTE[IceControlling.TYPE]    = IceControlling;
ATTRIBUTE[MappedAddress.TYPE]     = MappedAddress;
ATTRIBUTE[MessageIntegrity.TYPE]  = MessageIntegrity;
ATTRIBUTE[Nonce.TYPE]             = Nonce;
ATTRIBUTE[Priority.TYPE]          = Priority;
ATTRIBUTE[Realm.TYPE]             = Realm;
ATTRIBUTE[Software.TYPE]          = Software;
ATTRIBUTE[UnknownAttributes.TYPE] = UnknownAttributes;
ATTRIBUTE[UseCandidate.TYPE]      = UseCandidate;
ATTRIBUTE[Username.TYPE]          = Username;
ATTRIBUTE[XORMappedAddress.TYPE]  = XORMappedAddress;


exports.parse = function parse ( message, packet ) {
  var attribute, offset = message ? message.buffer.length + 4 : 4;

  var type = packet.readUInt16BE(offset - 4);
  var length = packet.readUInt16BE(offset - 2);

  if ( message.buffer.length + length > packet.length ) {
    return error.bad.attribute.bounds(length, packet.length - offset);
  }

  var value = packet.slice(offset, offset + length);
  var padding = packet.slice(offset + length, offset + (Math.ceil(length / 4) * 4));

  var attribute, AttributeType = ATTRIBUTE[type] || Attribute;

  if ( AttributeType == Attribute ) {
    attribute = new AttributeType(type, value, padding);
  }
  else {
    attribute = AttributeType.parse(message, value, padding);
  }

  if ( attribute.length != length ) {
    return error.bad.attribute.length(attribute.length, length);
  }

  return attribute;
}
