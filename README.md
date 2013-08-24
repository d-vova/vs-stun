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

Create a datagram socket, discover its host, port, and topology:

```
var stun = require('vs-stun');

var socket, option = {
  primary:        { host: 'stun1.l.google.com', port: 19302 },
  secondary:      { host: 'stun2.l.google.com', port: 19302 },
  retransmission: { count: 7, timeout: 500 }
}

var callback = function callback ( error, value ) {
  if ( !error ) {
    socket = value;
    
    var host = socket.stun.host;
    var port = socket.stun.port;
    var type = socket.stun.type;
    
    console.log('STUN: ' + type + ' => ' + host + ':' + port);
    
    socket.close();
  }
  else console.log('Something went wrong: ' + error);
}

stun.connect(option, callback);
```

Or discover host, port, and topology of an existing socket:

```
var stun = require('vs-stun');

// socket is created and opened here...

var option = {
  primary:        { host: 'stun1.l.google.com', port: 19302 },
  secondary:      { host: 'stun2.l.google.com', port: 19302 },
  retransmission: { count: 7, timeout: 500 }
}

var callback = function callback ( error, value ) {
  if ( !error ) {
    var host = value.host;
    var port = value.port;
    var type = value.type;
    
    console.log('STUN: ' + type + ' => ' + host + ':' + port);
  }
  else console.log('Something went wrong: ' + error);
}

stun.resolve(socket, option, callback);
```


Create Packet
-------------

```
var packet = stun.create({ username: 'name', password: 'pswd' });
```


##### Binding Request #####

```
var packet = stun.create.bindingRequest({ username: 'name', password: 'pswd' });
```

##### Binding Response #####

```
var packet = stun.create.bindingSuccess({ username: 'name', password: 'pswd' });
```

##### Binding Error #####

```
var packet = stun.create.bindingFailure({ username: 'name', password: 'pswd' });
```

##### Shared Secret Request #####

```
var packet = stun.create.sharedSecretRequest({ username: 'name', password: 'pswd' });
```

##### Shared Secret Response #####

```
var packet = stun.create.sharedSecretSuccess({ username: 'name', password: 'pswd' });
```

##### Shared Secret Error #####

```
var packet = stun.create.sharedSecretFailure({ username: 'name', password: 'pswd' });
```


Append Attributes
-----------------

### RFC 3489 (STUN) ###

##### Response-Address #####

```
var error, address = { host: '192.168.0.1', port: 8080, family: 'IPv4' }

if ( error = packet.append.responseAddress(address) ) console.log(error);
```

##### Changed-Address #####

```
var error, address = { host: '192.168.0.1', port: 8080, family: 'IPv4' }

if ( error = packet.append.changedAddress(address) ) console.log(error);
```

##### Source-Address #####

```
var error, address = { host: '192.168.0.1', port: 8080, family: 'IPv4' }

if ( error = packet.append.sourceAddress(address) ) console.log(error);
```

##### Password #####

```
var error, password = "secret";

if ( error = packet.append.password(password) ) console.log(error);
```

##### Reflected-From #####

```
var error, address = { host: '192.168.0.1', port: 8080, family: 'IPv4' }

if ( error = packet.append.reflectedFrom(address) ) console.log(error);
```


### RFC 5245 (ICE) ###

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


### RFC 5389 (STUN) ###

##### Mapped-Address #####

```
var error, address = { host: '192.168.0.1', port: 8080, family: 'IPv4' }

if ( error = packet.append.mappedAddress(address) ) console.log(error);
```

##### XOR-Mapped-Address #####

```
var error, address = { host: '192.168.0.1', port: 8080, family: 'IPv4' }

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

##### Alternate-Server #####

```
var error, address = { host: '192.168.0.1', port: 8080, family: 'IPv4' }

if ( error = packet.append.alternateServer(address) ) console.log(error);
```


### RFC 5780 (NAT) ###

##### Change-Request #####

```
var error, flags = { host: true, port: true }

if ( error = packet.append.changeRequest(flags) ) console.log(error);
```

##### Response-Origin #####

```
var error, address = { host: '192.168.0.1', port: 8080, family: 'IPv4' }

if ( error = packet.append.responseOrigin(address) ) console.log(error);
```

##### Other-Address #####

```
var error, address = { host: '192.168.0.1', port: 8080, family: 'IPv4' }

if ( error = packet.append.otherAddress(address) ) console.log(error);
```

##### Response-Port #####

```
var error, port = 8080;

if ( error = packet.append.responsePort(port) ) console.log(error);
```

##### Padding #####

```
var error, padding = 'some string for padding....';

if ( error = packet.append.padding(padding) ) console.log(error);
```


Error Codes and Reasons
-----------------------

### RFC 5389 (STUN) ###

  - `300` - Try Alternate
  - `400` - Bad Request
  - `401` - Unauthorized
  - `420` - Unknown Attribute
  - `438` - Stale Nonce
  - `500` - Server Error


License
-------

MIT
