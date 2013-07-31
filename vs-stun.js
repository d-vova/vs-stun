var udp = require('dgram');

var util = require('./lib/util');
var Packet = require('./lib/Packet');

var parse = exports.parse = function parse ( data ) {
  return Packet.parse(data);
}

var create = exports.create = function create ( auth ) {
  return new Packet(auth);
}

create.bindingRequest = function createBindingRequest ( auth ) {
  var packet = new Packet(auth);

  packet.type = Packet.BINDING_REQUEST;

  return packet;
}

create.bindingSuccess = function createBindingSuccess ( auth ) {
  var packet = new Packet(auth);

  packet.type = Packet.BINDING_SUCCESS;

  return packet;
}

create.bindingFailure = function createBindingFailure ( auth ) {
  var packet = new Packet(auth);

  packet.type = Packet.BINDING_FAILURE;

  return packet;
}

create.sharedSecretRequest = function createShareSecretRequest ( auth ) {
  var packet = new Packet(auth);

  packet.type = Packet.SSECRET_REQUEST;

  return packet;
}

create.sharedSecretSuccess = function createSharedSecretSuccess ( auth ) {
  var packet = new Packet(auth);

  packet.type = Packet.SSECRET_SUCCESS;

  return packet;
}

create.sharedSecretFailure = function createSharedSecretFailure ( auth ) {
  var packet = new Packet(auth);

  packet.type = Packet.SSECRET_FAILURE;

  return packet;
}


var resolve = exports.resolve = function resolve ( socket, server, callback ) {
  var port = server.port, host = server.host;
  var auth = server.auth || { username: 'vs-stun' }

  var onError = function onError ( error ) { done(error); }
  var onValue = function onValue ( value ) {
    var packet = new Packet.parse(value, auth);

    if ( packet instanceof Error ) done(packet);
    else done(null, packet.attribute.mappedAddress);
  }

  var done = function done ( error, value ) {
    socket.removeListener('error', onError);
    socket.removeListener('message', onValue);

    if ( callback ) callback(error, value);
  }

  var packet = create.bindingRequest(auth);

  packet.append.software(packet.auth.username);
  packet.append.username(packet.auth.username);
  packet.append.messageIntegrity();
  packet.append.fingerprint();

  socket.on('error', onError);
  socket.on('message', onValue);

  socket.send(packet.raw, 0, packet.raw.length, port, host);
}

var respond = exports.respond = function respond ( ) {
}


if ( require.main === module && process.argv[2] == 'test' ) {
  var exec = require('child_process').exec;

  var log = function log ( error, value ) {
    console.log(error || value);
  }

  exec('node lib/Packet.js', log);

  var socket = udp.createSocket('udp4'); socket.bind();
  var server = { port: 19302, host: '173.194.79.127' }

  var callback = function callback ( error, value ) {
    console.log(error || value); socket.close();
  }

  socket.on('listening', function ( ) {
    resolve(socket, server, callback);
  });
}
