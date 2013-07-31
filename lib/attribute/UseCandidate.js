var util = require('../util');

exports.encode = function encode ( packet, value ) {
  return new Buffer(0);
}

exports.decode = function decode ( packet, value ) {
  return true;
}

exports.TYPE = 0x0025;
exports.NAME = 'useCanditate';
