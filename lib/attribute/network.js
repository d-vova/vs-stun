var util = require('../util');

exports.encode = function encode ( packet, value ) {
  var result = new Buffer(4);

  result.writeInt16LE(value.readInt16BE(0) || 0);
  result.writeInt16LE(value.readInt16BE(2) || 0)

  return result;
}

exports.decode = function decode ( packet, value ) {
  if ( value.length != 4 ) {
    return new Error('invalid network');
  }
  var networkID = value.readInt16BE(0);
  var networkCost = value.readInt16BE(2);
  return networkID + networkCost;
}

exports.TYPE = 0xC057;
exports.NAME = 'network';
