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

```javascript
var stun = require('vs-stun');

var socket, server = { host: 'stun.l.google.com', port: 19302 }

var callback = function callback ( error, value ) {
  if ( !error ) {
    socket = value;

    console.log(socket.stun);

    socket.close();
  }
  else console.log('Something went wrong: ' + error);
}

stun.connect(server, callback);
```

Or discover host, port, and topology of an existing socket:

```javascript
var stun = require('vs-stun');

// socket is created and opened here...

var server = { host: 'stun.l.google.com', port: 19302 }

var callback = function callback ( error, value ) {
  if ( !error ) {
    console.log(value);

    socket.close();
  }
  else console.log('Something went wrong: ' + error);
}

stun.resolve(socket, server, callback);
```


Create Packet
-------------

```javascript
var packet = stun.create({ username: 'name', password: 'pswd' });
```


##### Binding Request #####

```javascript
var packet = stun.create.bindingRequest({ username: 'name', password: 'pswd' });
```

##### Binding Response #####

```javascript
var packet = stun.create.bindingSuccess({ username: 'name', password: 'pswd' });
```

##### Binding Error #####

```javascript
var packet = stun.create.bindingFailure({ username: 'name', password: 'pswd' });
```

##### Shared Secret Request #####

```javascript
var packet = stun.create.sharedSecretRequest({ username: 'name', password: 'pswd' });
```

##### Shared Secret Response #####

```javascript
var packet = stun.create.sharedSecretSuccess({ username: 'name', password: 'pswd' });
```

##### Shared Secret Error #####

```javascript
var packet = stun.create.sharedSecretFailure({ username: 'name', password: 'pswd' });
```


Append Attributes
-----------------

### RFC 3489 (STUN) ###

##### Response-Address #####

```javascript
var error, address = { host: '192.168.0.1', port: 8080, family: 'IPv4' }

if ( error = packet.append.responseAddress(address) ) console.log(error);
```

##### Changed-Address #####

```javascript
var error, address = { host: '192.168.0.1', port: 8080, family: 'IPv4' }

if ( error = packet.append.changedAddress(address) ) console.log(error);
```

##### Source-Address #####

```javascript
var error, address = { host: '192.168.0.1', port: 8080, family: 'IPv4' }

if ( error = packet.append.sourceAddress(address) ) console.log(error);
```

##### Password #####

```javascript
var error, password = "secret";

if ( error = packet.append.password(password) ) console.log(error);
```

##### Reflected-From #####

```javascript
var error, address = { host: '192.168.0.1', port: 8080, family: 'IPv4' }

if ( error = packet.append.reflectedFrom(address) ) console.log(error);
```


### RFC 5245 (ICE) ###

##### Priority #####

```javascript
var error, level = 12345;

if ( error = packet.append.priority(level) ) console.log(error);
```

##### Use-Candidate #####

```javascript
var error = null;

if ( error = packet.append.useCandidate() ) console.log(error);
```

##### Ice-Controlled #####

```javascript
var error, tieBreaker = '08192a3b4c5e6d7f';

if ( error = packet.append.iceControlled(tieBreaker) ) console.log(error);
```

##### Ice-Controlling #####

```javascript
var error, tieBreaker = '08192a3b4c5e6d7f';

if ( error = packet.append.iceControlling(tieBreaker) ) console.log(error);
```


### RFC 5389 (STUN) ###

##### Mapped-Address #####

```javascript
var error, address = { host: '192.168.0.1', port: 8080, family: 'IPv4' }

if ( error = packet.append.mappedAddress(address) ) console.log(error);
```

##### XOR-Mapped-Address #####

```javascript
var error, address = { host: '192.168.0.1', port: 8080, family: 'IPv4' }

if ( error = packet.append.xorMappedAddress(address) ) console.log(error);
```

##### Username #####

```javascript
var error, name = 'Joe';

if ( error = packet.append.username(name) ) console.log(error);
```

##### Message-Integrity #####

```javascript
var error = null;

if ( error = packet.append.messageIntegrity() ) console.log(error);
```

##### Fingerprint #####

```javascript
var error = null;

if ( error = packet.append.fingerprint() ) console.log(error);
```

##### Error-Code #####

```javascript
var error, errorCode = { code: 300, reason: 'Try Alternate' }

if ( error = packet.append.errorCode(errorCode) ) console.log(error);
```

##### Realm #####

```javascript
var error, name = 'realm';

if ( error = packet.append.realm(name) ) console.log(error);
```

##### Nonce #####

```javascript
var error, name = 'nonce';

if ( error = packet.append.nonce(name) ) console.log(error);
```

##### Unknown-Attributes #####

```javascript
var error, attributes = [ 0x02, 0x04, 0x05 ];

if ( error = packet.append.unknownAttributes(attributes) ) console.log(error);
```

##### Software #####

```javascript
var error, name = 'soft';

if ( error = packet.append.software('soft') ) console.log(error);
```

##### Alternate-Server #####

```javascript
var error, address = { host: '192.168.0.1', port: 8080, family: 'IPv4' }

if ( error = packet.append.alternateServer(address) ) console.log(error);
```


### RFC 5780 (NAT) ###

##### Change-Request #####

```javascript
var error, flags = { host: true, port: true }

if ( error = packet.append.changeRequest(flags) ) console.log(error);
```

##### Response-Origin #####

```javascript
var error, address = { host: '192.168.0.1', port: 8080, family: 'IPv4' }

if ( error = packet.append.responseOrigin(address) ) console.log(error);
```

##### Other-Address #####

```javascript
var error, address = { host: '192.168.0.1', port: 8080, family: 'IPv4' }

if ( error = packet.append.otherAddress(address) ) console.log(error);
```

##### Response-Port #####

```javascript
var error, port = 8080;

if ( error = packet.append.responsePort(port) ) console.log(error);
```

##### Padding #####

```javascript
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
