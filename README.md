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

### Binding Request ###

```
var packet = stun.create.bindingRequest({ username: 'name', password: 'pswd' });
```

### Binding Response ###

```
var packet = stun.create.bindingSuccess({ username: 'name', password: 'pswd' });
```

### Binding Error ###

```
var packet = stun.create.bindingFailure({ username: 'name', password: 'pswd' });
```

### Shared Secret Request ###

```
var packet = stun.create.sharedSecretRequest({ username: 'name', password: 'pswd' });
```

### Shared Secret Response ###

```
var packet = stun.create.sharedSecretSuccess({ username: 'name', password: 'pswd' });
```

### Shared Secret Error ###

```
var packet = stun.create.sharedSecretFailure({ username: 'name', password: 'pswd' });
```


### 


License
-------

MIT
