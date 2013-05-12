var BAD_PACKET_SIZE      = 'packet size must be at least 20 bytes and divisible by 4';
var BAD_MESSAGE_LENGTH   = 'message length field must contain the size, in bytes, of the message not including the 20-byte header';
var BAD_ATTRIBUTE_LENGTH = 'attribute length field must contain the size, in bytes, of the attribute value field prior to padding';
var BAD_ATTRIBUTE_BOUNDS = 'attribute length field indicates the attribute value extends beyond the bounds of the packet';
var BAD_ATTRIBUTE_PARSE  = 'attribute value field cannot be parsed';

var bad = exports.bad = { packet: { }, message: { }, attribute: { } }

bad.packet.size = function badPacketSize ( size ) {
  return new Error(BAD_PACKET_SIZE + ': ' + size);
}

bad.message.length = function badMessageLength ( value, expected ) {
  return new Error(BAD_MESSAGE_LENGTH + ': ' + value + ' expected to be ' + expected);
}

bad.attribute.length = function badAttributeLength ( value, expected ) {
  return new Error(BAD_ATTRIBUTE_LENGTH + ': ' + value + ' expected to be ' + expected);
}

bad.attribute.bounds = function badAttributeBounds ( value, actual ) {
  return new Error(BAD_ATTRIBUTE_BOUNDS + ': ' + value + ' expected to be ' + expected);
}

bad.attribute.parse = function badAttributeParse ( value ) {
  return new Error(BAD_ATTRIBUTE_PARSE + ': ' + value);
}
