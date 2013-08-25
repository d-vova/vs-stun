var dgram = require('dgram');

var util = require('./lib/util');
var client = require('./lib/client');
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


var check = exports.check = function check ( data ) {
  return Packet.parse.check(data);
}


var connect = exports.connect = function connect ( server, callback, retransmission ) {
  var server = server || { }
  var socket = dgram.createSocket('udp4');

  var done = function done ( error, value ) {
    if ( error ) {
      socket.close();

      callback(error);
    }
    else {
      socket.stun = value;

      callback(null, socket);
    }
  }

  socket.on('listening', function ( ) {
    client.resolve(socket, server, done, retransmission);
  });

  socket.bind();
}


var resolve = exports.resolve = function resolve ( socket, server, callback, retransmission ) {
  client.resolve(socket, server, callback, retransmission);
}

var respond = exports.respond = function respond ( socket, data, callback ) {
}


if ( require.main === module && process.argv[2] == 'test' ) {
  var exec = require('child_process').exec;

  var log = function log ( error, value ) {
    console.log(error || value);
  }

  exec('node lib/Packet.js', log);

  var socket, server = { host: 'stun.l.google.com', port: 19302 }
  
  var callback = function callback ( error, value ) {
    if ( !error ) {
      socket = value;
      
      console.log(socket.stun);
      
      socket.close();
    }
    else console.log('Something went wrong: ' + error);
  }
  
  connect(server, callback);
}
