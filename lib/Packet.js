var util = require('./util');
var Attribute = require('./Attribute');

var Packet = module.exports = function Packet ( auth ) {
  this.raw = new Buffer(20);

  this.doc = {
    type:          { obj: 0,  raw: this.raw.slice(0, 2) },
    length:        { obj: 0,  raw: this.raw.slice(2, 4) },
    cookie:        { obj: '', raw: this.raw.slice(4, 8) },
    transactionID: { obj: '', raw: this.raw.slice(8, 20) },

    attribute:     { },
    attributes:    [ ]
  }

  this.auth = auth || { username: '', password: '' }

  if ( this.auth.username == null ) this.auth.username = '';
  if ( this.auth.password == null ) this.auth.password = '';

  Attribute.expand(this);

  this.type = this.length = 0;
  this.cookie = Packet.MAGIC_COOKIE;
  this.transactionID = util.generate(12);
}

Packet.prototype = {
  get type ( ) { return Packet.getType(this); },
  set type ( value ) { Packet.setType(this, value); },

  get length ( ) { return Packet.getLength(this); },
  set length ( value ) { Packet.setLength(this, value); },

  get cookie ( ) { return Packet.getCookie(this); },
  set cookie ( value ) { Packet.setCookie(this, value); },

  get transactionID ( ) { return Packet.getTransactionID(this); },
  set transactionID ( value ) { Packet.setTransactionID(this, value); },

  get attribute ( ) { return Packet.getAttribute(this); },
  get attributes ( ) { return Packet.getAttributes(this); }
}

Packet.prototype.append = function append ( attribute ) {
  if ( attribute.raw.length % 4 != 0 ) {
    return new Error('invalid attribute');
  }

  this.raw = Buffer.concat([ this.raw, attribute.raw ]);

  this.doc.type.raw = this.raw.slice(0, 2);
  this.doc.length.raw = this.raw.slice(2, 4);
  this.doc.cookie.raw = this.raw.slice(4, 8);
  this.doc.transactionID.raw = this.raw.slice(8, 20);

  this.length = this.raw.length - 20;
  this.doc.attributes.push(attribute);

  if ( !this.doc.attribute[attribute.name] ) {
    this.doc.attribute[attribute.name] = attribute;
  }
}

Packet.prototype.valueOf = function valueOf ( ) {
  return {
    type          : this.type,
    length        : this.length,
    cookie        : this.cookie,
    transactionID : this.transactionID,
    attribute     : this.attribute,
    attributes    : this.attributes
  }
}

Packet.prototype.toString = function toString ( ) {
  var raw = '\033[37m' + this.raw.toString('hex') + '\033[0m';
  var header = [
    Packet.typeToString(this),
    '=>',
    Packet.lengthToString(this),
    '-',
    Packet.cookieToString(this),
    '-',
    Packet.transactionIDToString(this)
  ].join('    ');

  var string = [ raw, header ];

  for ( var i = 0; i < this.doc.attributes.length; i += 1 ) {
    string.push('    ' + this.doc.attributes[i].toString());
  }

  return string.join('\n');
}


Packet.getType = function getType ( packet ) {
  return packet.doc.type.obj;
}

Packet.setType = function setType ( packet, value ) {
  var value = value || 0;

  packet.doc.type.obj = value;
  packet.doc.type.raw.writeUInt16BE(value, 0);
}

Packet.getLength = function getLength ( packet ) {
  return packet.doc.length.obj;
}

Packet.setLength = function setLength ( packet, value ) {
  var value = value || 0;

  packet.doc.length.obj = value;
  packet.doc.length.raw.writeUInt16BE(value, 0);
}

Packet.getCookie = function getCookie ( packet ) {
  return packet.doc.cookie.obj;
}

Packet.setCookie = function setCookie ( packet, value ) {
  var value = value || Packet.MAGIC_COOKIE;

  packet.doc.cookie.obj = value;
  packet.doc.cookie.raw.write(value, 0, 4, 'hex');
}

Packet.getTransactionID = function getTransactionID ( packet ) {
  return packet.doc.transactionID.obj;
}

Packet.setTransactionID = function setTransactionID ( packet, value ) {
  var value = value || util.generate(12);

  packet.doc.transactionID.obj = value;
  packet.doc.transactionID.raw.write(value, 0, 12, 'hex');
}


Packet.getAttribute = function getAttribute ( packet ) {
  var attribute = { }

  for ( var name in packet.doc.attribute ) {
    attribute[name] = packet.doc.attribute[name].value.obj;
  }

  return attribute;
}

Packet.getAttributes = function getAttributes ( packet ) {
  var attributes = [ ];

  for ( var i = 0; i < packet.doc.attributes.length; i += 1 ) {
    attributes[i] = packet.doc.attributes[i].value.obj;
  }

  return attributes;
}


Packet.parse = function parse ( data, auth ) {
  if ( !Packet.parse.check(data) ) {
    return new Error('not a stun packet');
  }

  var packet = new Packet(auth);

  packet.type = data.readUInt16BE(0);
  packet.length = data.readUInt16BE(2);
  packet.cookie = data.toString('hex', 4, 8);
  packet.transactionID = data.toString('hex', 8, 20);

  while ( packet.raw.length != data.length ) {
    var error, attribute = Attribute.parse(packet, data);

    if ( attribute instanceof Error ) {
      return attribute;
    }

    if ( error = packet.append(attribute) ) return error;
  }

  return packet;
}

Packet.parse.check = function parseCheck ( data ) {
  if ( data.length < 20 ) return false;
  if ( data.length % 4 != 0 ) return false;
  if ( data.readUInt8(0) >= 64 ) return false;
  if ( data.readUInt16BE(2) + 20 != data.length ) return false;

  return true;
}


Packet.typeToString = function typeToString ( packet ) {
  var type = '(0x' + packet.doc.type.raw.toString('hex') + ') ';

  switch ( packet.doc.type.obj ) {
    case Packet.BINDING_REQUEST: return type + 'BINDING REQUEST' + '    ';
    case Packet.BINDING_SUCCESS: return type + 'BINDING SUCCESS' + '    ';
    case Packet.BINDING_FAILURE: return type + 'BINDING FAILURE' + '    ';
    case Packet.SSECRET_REQUEST: return type + 'SSECRET REQUEST' + '    ';
    case Packet.SSECRET_SUCCESS: return type + 'SSECRET SUCCESS' + '    ';
    case Packet.SSECRET_FAILURE: return type + 'SSECRET FAILURE' + '    ';
    default: return type + 'UNKNOWN MESSAGE' + '    ';
  }
}

Packet.lengthToString = function lengthToString ( packet ) {
  var info = 'PAYLOAD LENGTH:';

  if ( packet.doc.length.obj < 10 ) return info + '    ' + packet.doc.length.obj;
  if ( packet.doc.length.obj < 100 ) return info + '   ' + packet.doc.length.obj;
  if ( packet.doc.length.obj < 1000 ) return info + '  ' + packet.doc.length.obj;
  if ( packet.doc.length.obj < 10000 ) return info + ' ' + packet.doc.length.obj;

  return new Error('INVALID PAYLOAD LENGTH'); 
}

Packet.cookieToString = function cookieToString ( packet ) {
  //return '(0x' + packet.doc.cookie.raw.toString('hex') + ') COOKIE: ' + packet.doc.cookie.obj;
  return 'COOKIE: ' + '"' + packet.doc.cookie.obj + '"';
}

Packet.transactionIDToString = function transactionIDToString ( packet ) {
  //return '(0x' + packet.doc.transactionID.raw.toString('hex') + ') TRANSACTION ID: ' + packet.doc.transactionID.obj;
  return 'TRANSACTION ID: ' + '"' + packet.doc.transactionID.obj + '"';
}

Packet.MAGIC_COOKIE = '2112a442';

Packet.BINDING_REQUEST = 0x0001;
Packet.BINDING_SUCCESS = 0x0101;
Packet.BINDING_FAILURE = 0x0111;

Packet.SSECRET_REQUEST = 0x0002;
Packet.SSECRET_SUCCESS = 0x0102;
Packet.SSECRET_FAILURE = 0x0112;


if ( require.main === module ) {
  console.log('Testing Packet at "' + __filename + '"...');

  var auth = {
    username: 'evtj:h6vY',
    password: 'VOkJxbRl1RmTxUk/WvJxBt'
  }

  var raw = {
    request: [
      '00010058', '2112a442', 'b7e7a701', 'bc34d686',
      'fa87dfae', '80220010', '5354554e', '20746573',
      '7420636c', '69656e74', '00240004', '6e0001ff',
      '80290008', '932ff9b1', '51263b36', '00060009',
      '6576746a', '3a683676', '59202020', '00080014',
      '9aeaa70c', 'bfd8cb56', '781ef2b5', 'b2d3f249',
      'c1b571a2', '80280004', 'e57a3bcf'
    ].join(''),
    response: [
      '0101003c', '2112a442', 'b7e7a701', 'bc34d686',
      'fa87dfae', '8022000b', '74657374', '20766563',
      '746f7220', '00200008', '0001a147', 'e112a643',
      '00080014', '2b91f599', 'fd9e90c3', '8c7489f9',
      '2af9ba53', 'f06be7d7', '80280004', 'c07d4c96'
    ].join('')
  }

  var request = new Packet(auth);

  request.type = Packet.BINDING_REQUEST;
  request.transactionID = 'b7e7a701bc34d686fa87dfae';
  request.append.software('STUN test client');
  request.append.priority(0x6e0001ff);
  request.append.iceControlled('932ff9b151263b36');
  request.append.username(auth.username, '20');
  request.append.messageIntegrity();
  request.append.fingerprint();

  var response = new Packet(auth);

  response.type = Packet.BINDING_SUCCESS;
  response.transactionID = 'b7e7a701bc34d686fa87dfae';
  response.append.software('test vector', '20');
  response.append.xorMappedAddress({ host: '192.0.2.1', port: '32853' });
  request.append.messageIntegrity();
  response.append.fingerprint();

  var prequest = Packet.parse(new Buffer(raw.request, 'hex'), auth);
  var presponse = Packet.parse(new Buffer(raw.response, 'hex'), auth);

  var hex = {
    request: request.raw.toString('hex'),
    response: response.raw.toString('hex'),
    prequest: prequest.raw.toString('hex'),
    presponse: presponse.raw.toString('hex')
  }

  var result = { request: '', response: '', prequest: '', presponse: '' }

  for ( var i = 0; i < hex.request.length; i += 2 ) {
    var hbyte = hex.request[i] + hex.request[i + 1];
    var rbyte = raw.request[i] + raw.request[i + 1];
    var color = hbyte == rbyte ? '\033[32m' : '\033[31m';

    result.request += color + hbyte + '\033[0m';
  }

  for ( var i = 0; i < hex.response.length; i += 2 ) {
    var hbyte = hex.response[i] + hex.response[i + 1];
    var rbyte = raw.response[i] + raw.response[i + 1];
    var color = hbyte == rbyte ? '\033[32m' : '\033[31m';

    result.response += color + hbyte + '\033[0m';
  }

  for ( var i = 0; i < hex.prequest.length; i += 2 ) {
    var hbyte = hex.prequest[i] + hex.prequest[i + 1];
    var rbyte = raw.request[i] + raw.request[i + 1];
    var color = hbyte == rbyte ? '\033[32m' : '\033[31m';

    result.prequest += color + hbyte + '\033[0m';
  }

  for ( var i = 0; i < hex.presponse.length; i += 2 ) {
    var hbyte = hex.presponse[i] + hex.presponse[i + 1];
    var rbyte = raw.response[i] + raw.response[i + 1];
    var color = hbyte == rbyte ? '\033[32m' : '\033[31m';

    result.presponse += color + hbyte + '\033[0m';
  }

  console.log(result.request);
  console.log(raw.request);
  console.log(request.toString());

  console.log(result.response);
  console.log(raw.response);
  console.log(response.toString());

  console.log(result.prequest);
  console.log(raw.request);
  console.log(prequest.toString());

  console.log(result.presponse);
  console.log(raw.response);
  console.log(presponse.toString());

  
  var packet = new Packet();

  var tieBreaker = '08192a3b4c5e6d7f';
  var attributes = [ 0x02, 0x04, 0x05 ];
  var flags = { host: true, port: true }
  var realm = 'realm', nonce = 'nonce';
  var username = 'name', password = 'pswd';
  var software = "soft", priority = 12345;
  var port = 1234, padding = 'some string for padding....';
  var errorCode = { code: 300, reason: 'Try Alternate' }
  var address = { host: '192.168.0.1', port: 8080, family: 'IPv4' }

  packet.append.responseAddress(address);
  packet.append.changedAddress(address);
  packet.append.sourceAddress(address);
  packet.append.password(password);
  packet.append.reflectedFrom(address);

  packet.append.priority(priority);
  packet.append.useCandidate();
  packet.append.iceControlled(tieBreaker);
  packet.append.iceControlling(tieBreaker);

  packet.append.mappedAddress(address);
  packet.append.xorMappedAddress(address);
  packet.append.username(username);
  packet.append.messageIntegrity();
  packet.append.fingerprint();
  packet.append.errorCode(errorCode);
  packet.append.realm(realm);
  packet.append.nonce(nonce);
  packet.append.unknownAttributes(attributes);
  packet.append.software(software);
  packet.append.alternateServer(address);

  packet.append.changeRequest(flags);
  packet.append.responseOrigin(address);
  packet.append.otherAddress(address);
  packet.append.responsePort(port);
  packet.append.padding(padding);

  console.log(String(packet));
}
