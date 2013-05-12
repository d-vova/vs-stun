var Attribute = module.exports = function Attribute ( type, value, padding, object ) {
  var value = value || new Buffer(0);
  var length = Math.ceil(value.length / 4) * 4;

  this.buffer = new Buffer(4 + length); this.buffer.fill(0);

  this.buffer.writeUInt16BE(type || 0, 0);
  this.buffer.writeUInt16BE(value.length, 2);
  
  value.copy(this.buffer, 4);

  if ( 4 + value.length < this.buffer.length && padding ) {
    if ( padding instanceof Buffer ) {
      padding.copy(this.buffer, 4 + value.length);
    }
    else this.buffer.fill(padding || 0, 4 + length);
  }

  this.__defineGetter__('type', this.getType.bind(this));
  this.__defineGetter__('length', this.getLength.bind(this));
  this.__defineGetter__('value', this.getValue.bind(this));
  this.__defineGetter__('padding', this.getPadding.bind(this));

  this.object = object === undefined ? value.toString('hex') : object;
}

Attribute.prototype.getType = function getType ( ) {
  return this.buffer.readUInt16BE(0);
}

Attribute.prototype.getLength = function getLength ( ) {
  return this.buffer.readUInt16BE(2);
}

Attribute.prototype.getValue = function getValue ( ) {
  return this.buffer.slice(4, 4 + this.length);
}

Attribute.prototype.getPadding = function getPadding ( ) {
  return this.buffer.slice(4 + this.length);
}

Attribute.prototype.toString = function toString ( ) {
  var name = this.name || 'unknown';
  var type = '(0x' + this.buffer.toString('hex', 0, 2) + ')';
  var length = this.length + ' bytes:';
  var object = JSON.stringify(this.object);
  var value = this.value.toString('hex');
  var padding = this.value.toString('hex', 4 + this.length);

  return [ type, name, length, object, value, padding ].join(' ');
}
