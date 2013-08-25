var Packet = require('./Packet');
var config = require('../config');

var resolve = exports.resolve = function resolve ( socket, server, callback, retransmission ) {
  var address = socket.address();
  var retransmission = retransmission || { }

  var local = { host: address.address, port: address.port };
  var count = retransmission.count;
  var timeout = retransmission.timeout;

  test.udp(socket, server, count, timeout, function ( error, value ) {
    if ( error ) return callback(null, label({ local: local }));
     
    var other = value.other;
    var result = { local: local, public: value.mapped }

    if ( !other ) return callback(null, label(result));

    if ( !test.compare(result.public, result.local) ) {
      var otser = { host: other.host, port: server.port }

      test.mapping(socket, otser, count, timeout, function ( error, value ) {
        if ( error ) return callback(error);

        if ( !test.compare(value.mapped, result.public) ) {
          test.portMapping(socket, other, count, timeout, function ( error, value ) {
            if ( error ) return callback(error);

            result.mapping = { host: true, port: !test.compare(value.mapped, result.public) }

            if ( result.filtering != null ) callback(null, label(result));
          });
        }
        else {
          result.mapping = { host: false, port: false }

          if ( result.filtering != null ) callback(null, label(result));
        }
      });
    }
    else result.mapping = { host: false, port: false }

    test.filtering(socket, server, count, timeout, function ( error, value ) {
      if ( error ) return callback(error);

      if ( value ) {
        test.portFiltering(socket, server, count, timeout, function ( error, value ) {
          if ( error ) return callback(error);

          result.filtering = { host: true, port: !!value }

          if ( result.mapping != null ) callback(null, label(result));
        });
      }
      else {
        result.filtering = { host: false, port: false }

        if ( result.mapping != null ) callback(null, label(result));
      }
    });
  });
}


var label = function label ( result ) {
  if ( !result.public ) result.type = config.BLOCKED_UDP;
  else {
    var mapping = result.mapping || { }
    var filtering = result.filtering || { }

    if ( test.compare(result.public, result.local) ) {
      if ( filtering.host || filtering.port ) {
        result.label = config.SYMMETRIC_FIREWALL;
      }
      else result.type = config.OPEN_INTERNET;
    }
    else {
      if ( mapping.host || mapping.port ) {
        result.type = config.SYMMETRIC_NAT;
      }
      else {
        if ( !filtering.host ) {
          result.type = config.FULL_CONE_NAT;
        }
        else if ( !filtering.port ) {
          result.type = config.RESTRICTED_CONE_NAT;
        }
        else result.type = config.PORT_RESTRICTED_CONE_NAT;
      }
    }
  }

  return result;
}


var test = function test ( ) { }

test.compare = function compare ( serverA, serverB ) {
  var serverA = serverA || { }
  var serverB = serverB || { }

  return serverA.host == serverB.host && serverA.port == serverB.port;
}

test.udp = function testUDP ( socket, server, count, timeout, callback ) {
  var done = function done ( error, value ) {
    if ( error ) return callback(error);

    var attribute = value.packet.doc.attribute;

    var other = attribute.otherAddress || attribute.changedAddress;
    var mapped = attribute.xorMappedAddress || attribute.mappedAddress;

    callback(null, { other: other, mapped: mapped ? mapped.value.obj : { } });
  }

  var packet = new Packet();

  packet.type = Packet.BINDING_REQUEST;

  transmit(socket, server, packet, count, timeout, done);
}


test.mapping = function testMapping ( socket, server, count, timeout, callback ) {
  var done = function done ( error, value ) {
    if ( error ) return callback(error);

    var attribute = value.packet.doc.attribute;

    var mapped = attribute.xorMappedAddress || attribute.mappedAddress;

    callback(null, { mapped: mapped ? mapped.value.obj : { } });
  }

  var packet = new Packet();

  packet.type = Packet.BINDING_REQUEST;

  transmit(socket, server, packet, count, timeout, done);
}

test.portMapping = function testPortMapping ( socket, server, count, timeout, callback ) {
  var done = function done ( error, value ) {
    if ( error ) return callback(error);

    var attribute = value.packet.doc.attribute;

    var mapped = attribute.xorMappedAddress || attribute.mappedAddress;

    callback(null, { mapped: mapped ? mapped.value.obj : { } });
  }

  var packet = new Packet();

  packet.type = Packet.BINDING_REQUEST;

  transmit(socket, server, packet, count, timeout, done);
}


test.filtering = function testFiltering ( socket, server, count, timeout, callback ) {
  var done = function done ( error, value ) {
    callback(null, !!error);
  }

  var packet = new Packet();

  packet.type = Packet.BINDING_REQUEST;
  packet.append.changeRequest({ host: true, port: true });

  transmit(socket, server, packet, count, timeout, done);
}

test.portFiltering = function testPortFiltering ( socket, server, count, timeout, callback ) {
  var done = function done ( error, value ) {
    callback(null, !!error);
  }

  var packet = new Packet();

  packet.type = Packet.BINDING_REQUEST;
  packet.append.changeRequest({ host: false, port: true });

  transmit(socket, server, packet, count, timeout, done);
}


var transmit = function transmit ( socket, server, packet, count, timeout, callback ) {
  var count = count || config.RETRANSMISSION_COUNT;
  var timeout = timeout || config.RETRANSMISSION_TIMEOUT;
  var timer, error, host = server.host, port = server.port;

  var done = function done ( error, value ) {
    socket.removeListener('message', onValue);
    socket.removeListener('error', onError);

    callback(error, value);
  }

  var retry = function retry ( ) {
    if ( count > 1 ) {
      count -= 1; timeout *= 2; attempt();
    }
    else done(error || new Error('request timeout'));
  }

  var onValue = function onValue ( data, info ) {
    clearTimeout(timer);

    var packet = Packet.parse(data);

    if ( packet instanceof Error ) done(packet);
    else {
      var result = {
        packet: Packet.parse(data),
        address: { host: info.address, port: info.port }
      }

      done(null, result);
    }
  }

  var onError = function onError ( value ) {
    error = value;
  }

  var attempt = function attempt ( ) {
    socket.send(packet.raw, 0, packet.raw.length, port, host);

    timer = setTimeout(retry, timeout);
  }

  socket.on('message', onValue);
  socket.on('error', onError);

  attempt();
}
