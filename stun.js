var message = exports.message = require('./lib/message');

var response = exports.response = function response ( request, address, auth ) {
  var request = request || null, isBuffer = request instanceof Buffer;

  if ( !request ) return request;
  if ( isBuffer ) {
    if ( !message.check(request) ) return null;

    request = message.parse(request, auth);

    if ( request.type != message.TYPE.REQUEST ) return null;
  }

  var response = message.create(auth, message.TYPE.SUCCESS, null, request.transactionID);

  response.xorMappedAddress(address);
  response.messageIntegrity();
  response.fingerprint();

  return isBuffer ? response.buffer : response;
}


var TEST_VECTORS = [
  {
    auth: { username: 'evtj:h6vY', password: 'VOkJxbRl1RmTxUk/WvJxBt' },
    packet: [
      '00010058', '2112a442', 'b7e7a701', 'bc34d686', 'fa87dfae', '80220010', '5354554e', '20746573',
      '7420636c', '69656e74', '00240004', '6e0001ff', '80290008', '932ff9b1', '51263b36', '00060009',
      '6576746a', '3a683676', '59202020', '00080014', '9aeaa70c', 'bfd8cb56', '781ef2b5', 'b2d3f249',
      'c1b571a2', '80280004', 'e57a3bcf'
    ].join('')
  },
  {
    auth: { software: 'test vector', password: 'VOkJxbRl1RmTxUk/WvJxBt' },
    packet: [
      '0101003c', '2112a442', 'b7e7a701', 'bc34d686', 'fa87dfae', '8022000b', '74657374', '20766563',
      '746f7220', '00200008', '0001a147', 'e112a643', '00080014', '2b91f599', 'fd9e90c3', '8c7489f9',
      '2af9ba53', 'f06be7d7', '80280004', 'c07d4c96'
    ].join('')
  },
  {
    auth: { software: 'test vector', password: 'VOkJxbRl1RmTxUk/WvJxBt' },
    packet: [
      '01010048', '2112a442', 'b7e7a701', 'bc34d686', 'fa87dfae', '8022000b', '74657374', '20766563',
      '746f7220', '00200014', '0002a147', '0113a9fa', 'a5d3f179', 'bc25f4b5', 'bed2b9d9', '00080014',
      'a382954e', '4be67bf1', '1784c97c', '8292c275', 'bfe3ed41', '80280004', 'c8fb0b4c'
    ].join('')
  },
//  {
//    auth: { username: '\u30de\u30c8\u30ea\u30c3\u30af\u30b9', password: 'The\u00adM\u00aatr\u2168' },
//    packet: [
//      '00010060', '2112a442', '78ad3433', 'c6ad72c0', '29da412e', '00060012', 'e3839ee3', '8388e383',
//      'aae38383', 'e382afe3', '82b90000', '0015001c', '662f2f34', '39396b39', '35346436', '4f4c3334',
//      '6f4c3946', '53547679', '36347341', '0014000b', '6578616d', '706c652e', '6f726700', '00080014',
//      'f6702465', '6dd64a3e', '02b8e071', '2e85c9a2', '8ca89666'
//    ].join('')
//  }
];

if ( require.main === module ) {
  console.log('STUN Testing');

  for ( var i = 0; i < TEST_VECTORS.length; i += 1 ) {
    var vector = TEST_VECTORS[i];

    var msg = message.parse(new Buffer(vector.packet, 'hex'), vector.auth);

    console.log([ vector.auth.password, vector.packet, msg, '' ].join('\n'));
  }
  console.log('STUN Done');
}
