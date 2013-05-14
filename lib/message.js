var util = require('./util');
var error = require('./error');

var attribute = require('./attribute');


var TYPE = exports.TYPE = {
  REQUEST: 0x0001,
  SUCCESS: 0x0101,
  FAILURE: 0x0111
}

var MAGIC_COOKIE = exports.MAGIC_COOKIE = 0x2112a442;


var Message = exports.Message = function Message ( auth, type, cookie, id ) {
  this.auth = auth || { username: '', password: '' }

  if ( this.auth.username == null ) this.auth.username = '';
  if ( this.auth.password == null ) this.auth.password = '';

  this.buffer = new Buffer(20); this.buffer.fill(0);

  this.attribute = { }
  this.attributes = [ ];

  this.setType(type == null ? TYPE.REQUEST : type);
  this.setCookie(cookie == null ?  MAGIC_COOKIE : cookie);
  this.setTransactionID(id == null ? util.generate(12) : id);

  this.__defineGetter__('header', this.getHeader.bind(this));
  this.__defineGetter__('type', this.getType.bind(this));
  this.__defineSetter__('type', this.setType.bind(this));
  this.__defineGetter__('length', this.getLength.bind(this));
  this.__defineGetter__('cookie', this.getCookie.bind(this));
  this.__defineSetter__('cookie', this.setCookie.bind(this));
  this.__defineGetter__('transactionID', this.getTransactionID.bind(this));
  this.__defineSetter__('transactionID', this.setTransactionID.bind(this));
}

Message.prototype.getHeader = function getHeader ( ) {
  return this.buffer.slice(0, 20);
}

Message.prototype.getType = function getType ( ) {
  return this.buffer.readUInt16BE(0);
}

Message.prototype.setType = function setType ( value ) {
  this.buffer.writeUInt16BE(value, 0);
}

Message.prototype.getLength = function getLength ( ) {
  return this.buffer.readUInt16BE(2);
}

Message.prototype.getCookie = function getCookie ( ) {
  return this.buffer.slice(4, 8);
}

Message.prototype.setCookie = function setCookie ( value ) {
  switch ( value.constructor ) {
    case Buffer: value.copy(this.buffer, 4, 0, 4); break;
    case Number: this.buffer.writeUInt32BE(value, 4); break;
    case String: this.buffer.write(value, 4, 4, 'hex'); break;
  }
}

Message.prototype.getTransactionID = function getTransactionID ( ) {
  return this.buffer.slice(8, 20);
}

Message.prototype.setTransactionID = function setTransactionID ( value ) {
  switch ( value.constructor ) {
    case Buffer: value.copy(this.buffer, 8, 0, 12); break;
    case String: this.buffer.write(value, 8, 12, 'hex'); break;
  }
}

Message.prototype.getData = function getData ( ) {
  return this.buffer.slice(20);
}


Message.prototype.append = function append ( item ) {
  if ( this.attribute[attribute.Fingerprint.NAME] ) return null;
  if ( this.attribute[attribute.MessageIntegrity.NAME] ) {
    if ( !(item instanceof attribute.Fingerprint) ) return null;
  }

  var length = this.length + item.buffer.length;

  this.buffer.writeUInt16BE(length, 2);

  this.buffer = Buffer.concat([this.buffer, item.buffer], 20 + length);

  this.attributes.push(item);

  if ( item.name && !this.attribute[item.name] ) {
    this.attribute[item.name] = item.object;
  }

  return this;
}


Message.prototype.username = function username ( name ) {
  var item = new attribute.Username(this, name);

  if ( item instanceof Error ) console.log(item);
  else this.append(item);

  return this;
}

Message.prototype.iceControlled = function iceControlled ( ) {
  var item = new attribute.IceControlled(this);

  if ( item instanceof Error ) console.log(item);
  else this.append(item);

  return this;
}

Message.prototype.iceControlling = function iceControlling ( ) {
  var item = new attribute.IceControlling(this);

  if ( item instanceof Error ) console.log(item);
  else this.append(item);

  return this;
}

Message.prototype.useCandidate = function useCandidate ( ) {
  var item = new attribute.UseCandidate(this, true);

  if ( item instanceof Error ) console.log(item);
  else this.append(item);

  return this;
}

Message.prototype.priority = function priority ( value ) {
  var item = new attribute.Priority(this, value);

  if ( item instanceof Error ) console.log(item);
  else this.append(item);

  return this;
}

Message.prototype.xorMappedAddress = function xorMappedAddress ( value ) {
  var item = new attribute.XORMappedAddress(this, value);

  if ( item instanceof Error ) console.log(item);
  else this.append(item);

  return this;
}

Message.prototype.messageIntegrity = function messageIntegrity ( ) {
  var item = new attribute.MessageIntegrity(this);

  if ( item instanceof Error ) console.log(item);
  else this.append(item);

  return this;
}

Message.prototype.fingerprint = function fingerprint ( ) {
  var item = new attribute.Fingerprint(this);

  if ( item instanceof Error ) console.log(item);
  else this.append(item);

  return this;
}


Message.prototype.toString = function toString ( ) {
  var type, length, cookie, id, result = [ ];

  switch ( this.type ) {
    case TYPE.REQUEST: type = 'REQUEST (0x0001)'; break;
    case TYPE.SUCCESS: type = 'SUCCESS (0x0101)'; break;
    case TYPE.FAILURE: type = 'FAILURE (0x0111)'; break;
    default: type = 'UNKNOWN (0x' + this.buffer.toString('hex', 0, 2) + ')';
  }

  length = this.length + ' BYTES:';
  cookie = this.cookie.toString('hex');
  id = this.transactionID.toString('hex');

  result.push([type, cookie, id, length].join(' '));

  for ( var i = 0; i < this.attributes.length; i += 1 ) {
    result.push('  ' + this.attributes[i].toString());
  }

  return result.join('\r\n');
}


var create = exports.create = function create ( auth, type, cookie, id ) {
  return new Message(auth, type, cookie, id);
}


var check = exports.check = function check ( packet ) {
  return packet[0] < 0x40;
}


var parse = exports.parse = function parse ( packet, auth ) {
  if ( packet.length < 20 || packet.length % 4 ) {
    return error.bad.packet.size(packet.length);
  }

  var type = packet.readUInt16BE(0);
  var length = packet.readUInt16BE(2);
  var cookie = packet.readUInt32BE(4);
  var id = packet.slice(8, 20);

  if ( 20 + length != packet.length ) {
    return error.bad.message.length(length, packet.length);
  }

  var message = create(auth, type, cookie, id);

  while ( message.length != length ) {
    var item = attribute.parse(message, packet);

    if ( item instanceof Error ) return item;
    if ( !message.append(item) ) return message;
  }

  return message;
}
