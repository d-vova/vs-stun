vs-stun
=======

STUN protocol implementation in NodeJS


Installation
------------

```
npm install vs-stun
```


Quick Start
-----------

Discover host and port of a datagram socket:

```
var dgram = require('dgram');
var stun = require('vs-stun');

var socket = dgram.createSocket('udp4');
var server = { host: 'stun.l.google.com', port: 19302 };

socket.on('listening', function ( ) {
  stun.resolve(socket, server, function ( error, value ) {
    console.log(error || value);

    socket.close();
  });
});

socket.bind();
```


Create Packet
-------------

```
var packet = stun.create({ username: 'name', password: 'pswd' });
```


#### Binding Request ####

```
var packet = stun.create.bindingRequest({ username: 'name', password: 'pswd' });
```

#### Binding Response ####

```
var packet = stun.create.bindingSuccess({ username: 'name', password: 'pswd' });
```

#### Binding Error ####

```
var packet = stun.create.bindingFailure({ username: 'name', password: 'pswd' });
```

#### Shared Secret Request ####

```
var packet = stun.create.sharedSecretRequest({ username: 'name', password: 'pswd' });
```

#### Shared Secret Response ####

```
var packet = stun.create.sharedSecretSuccess({ username: 'name', password: 'pswd' });
```

#### Shared Secret Error ####

```
var packet = stun.create.sharedSecretFailure({ username: 'name', password: 'pswd' });
```


Append Attributes
-----------------


#### Mapped-Address ####

```
packet.append.mappedAddress({ address: '192.168.0.1', port: '8080', family: 'IPv4' });
```

#### Username ####

```
packet.append.username('name');
```

#### Message-Integrity ####

```
packet.append.messageIntegrity();
```

#### Error-Code ####

```
packet.append.errorCode({ code: 300, reason: 'Try Alternate' });
```

#### Unknown-Attributes ####

```
packet.append.unknownAttributes([ 0x02, 0x04, 0x05 ]);
```

#### Realm ####

```
packet.append.realm('realm');
```

#### Nonce ####

```
packet.append.nonce('nonce');
```

#### XOR-Mapped-Address ####

```
packet.append.xorMappedAddress({ address: '192.168.0.1', port: '8080', family: 'IPv4' });
```

#### Priority ####

```
packet.append.priority(12345);
```

#### Use-Candidate ####

```
packet.append.useCandidate();
```

#### Software ####

```
packet.append.software('soft');
```

#### Fingerprint ####

```
packet.append.fingerprint();
```

#### Ice-Controlled ####

```
packet.append.iceControlled('0011223344556677');
```

#### Ice-Controlling ####

```
packet.append.iceControlling('0011223344556677');
```


License
-------

MIT
