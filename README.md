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


### RFC 5245 ###

##### Priority #####

```
var error, level = 12345;
if ( error = packet.append.priority(level) ) console.log(error);
```

##### Use-Candidate #####

```
var error = null;

if ( error = packet.append.useCandidate() ) console.log(error);
```

##### Ice-Controlled #####

```
var error, tieBreaker = '08192a3b4c5e6d7f';

if ( error = packet.append.iceControlled(tieBreaker) ) console.log(error);
```

##### Ice-Controlling #####

```
var error, tieBreaker = '08192a3b4c5e6d7f';

if ( error = packet.append.iceControlling(tieBreaker) ) console.log(error);
```


### RFC 5389 ###

##### Mapped-Address #####

```
var error, address = { address: '192.168.0.1', port: '8080', family: 'IPv4' }

if ( error = packet.append.mappedAddress(address) ) console.log(error);
```

##### XOR-Mapped-Address #####

```
var error, address = { address: '192.168.0.1', port: '8080', family: 'IPv4' }

if ( error = packet.append.xorMappedAddress(address) ) console.log(error);
```

##### Username #####

```
var error, name = 'Joe';

if ( error = packet.append.username(name) ) console.log(error);
```

##### Message-Integrity #####

```
var error = null;

if ( error = packet.append.messageIntegrity() ) console.log(error);
```

##### Fingerprint #####

```
var error = null;

if ( error = packet.append.fingerprint() ) console.log(error);
```

##### Error-Code #####

```
var error, errorCode = { code: 300, reason: 'Try Alternate' }

if ( error = packet.append.errorCode(errorCode) ) console.log(error);
```

##### Realm #####

```
var error, name = 'realm';

if ( error = packet.append.realm(name) ) console.log(error);
```

##### Nonce #####

```
var error, name = 'nonce';

if ( error = packet.append.nonce(name) ) console.log(error);
```

##### Unknown-Attributes #####

```
var error, attributes = [ 0x02, 0x04, 0x05 ];

if ( error = packet.append.unknownAttributes(attributes) ) console.log(error);
```

##### Software #####

```
var error, name = 'soft';

if ( error = packet.append.software('soft') ) console.log(error);
```





License
-------

MIT
