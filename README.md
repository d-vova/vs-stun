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

var server = 'stun.l.google.com:19302';
var socket = dgram.createSocket('udp4');

stun.resolve(socket, server, function ( error, value ) {
  console.log(value);
});
```


License
-------

MIT
