
var Vec2 = function Vec2(x,y) {
  this.x = x||0;
  this.y = y||0;
}
Vec2.prototype.clone = function clone(scale) {
  scale = scale || 1;
  return new Vec2(this.x*scale, this.y*scale);
};
Vec2.prototype.length = function length() {
  return this._length || (this._length=Math.sqrt(this.x*this.x+this.y*this.y));
};
Vec2.prototype.lengthSquared = function lengthSquared() {
  return this._lengthSquared || (this._lengthSquared=(this.x*this.x+this.y*this.y));
};
Vec2.prototype.add = function add(b, out) {
  out = out || {};
  out.x = this.x + b.x;
  out.y = this.y + b.y;
  return out;
};
Vec2.prototype.addScaled = function addScaled(b, scalar, out) {
  out = out || {};
  out.x = this.x + b.x*scalar;
  out.y = this.y + b.y*scalar;
  return out;
};
Vec2.prototype.sub = function sub(b, out) {
  out = out || {};
  out.x = this.x - b.x;
  out.y = this.y - b.y;
  return out;
};
Vec2.prototype.scale = function scale(scalar, out) {
  out = out || {};
  out.x = this.x * scalar;
  out.y = this.y * scalar;
  return out;
};
Vec2.prototype.normalize = function normalize(out) {
  out = out || {};
  if(this.length() > 0) {
    out.x = this.x / this._length;
    out.y = this.y / this._length;
  } else {
    out.x = 0;
    out.y = 0;
  }
  return out;
};
Vec2.prototype.rightPerproduct = function rightPerproduct() {
  return new Vec2(-this.y, this.x);
};

Vec2.dot = function dot(a, b) {
  return a.x*b.x + a.y*b.y;
};

define({
  Vec2: Vec2,
});