define(['math','utils'], function(math, utils) {

return {

  // TODO: docs?
  // TODO: polygon/OABB

  executionCount: 4,

  init: function(game, parent) {
    this.parent = parent;
  },

  update: function update(elapsed) {
    var parent = this.parent;
    var subElapsed = elapsed / this.executionCount;
    for( var j = 0; j < this.executionCount; j++ ) {
      for( var i = 0; i < parent.childs.length; i++ ) {
        var e = parent.childs[i];
        if(e.integrate !== undefined && !e.ghost) {
          e.integrate(subElapsed);
        }

        if(e.position !== undefined && e.velocity !== undefined) {
          e.position.x += e.velocity.x * subElapsed;
          e.position.y += e.velocity.y * subElapsed;
        }

        if(e.shape !== undefined && !e.ghost && !e.destroyed) {
          this.checkCollision(e);
        }
      }
    }

  },

  checkCollision: function checkCollision( e ) {
    var parent = this.parent;
    for( var i = parent.childs.length-1; i >= 0; i-- ) {
      if(parent.childs[i].shape !== undefined && !parent.childs[i].ghost && !parent.childs[i].destroyed) {
        this.checkCollisionBetween(e, parent.childs[i]);
      }
    }
  },

  checkCollisionBetween: function checkCollisionBetween(a, b) {
    // already checked: both have shape, are not destoryed or ghost.
    if(a == b)
      return;
    if(a.position === undefined || b.position === undefined)
      return;
    if(!a.initiateCollision && !b.initiateCollision)
      return;
    if( (a.canCollideWith !== undefined && !a.canCollideWith(b)) || (b.canCollideWith !== undefined && !b.canCollideWith(a)) )
      return;
    var fn = "check"+a.shape+b.shape;
    if(this[fn] === undefined) {
      console.err('unable to collide two shapes:', a.shape, b.shape);
      return;
    }
    var collision = this[fn](a,b);
    if(collision) {
      collision.a = a;
      collision.b = b;
      if(!a.nonCollidable && !b.nonCollidable) {
        a.mass = a.mass || 1;
        b.mass = b.mass || 1;
        if(a.velocity !== undefined && b.velocity !== undefined && b.mass < a.mass*100 && a.mass < b.mass*100) {
          this.respondToCollision(b, collision, -.5);
          this.respondToCollision(a, collision, .5);
          this.transferEnergy(a, b, collision);
        } else if(a.velocity !== undefined && (b.velocity === undefined || a.mass*100 < b.mass)) {
          this.respondToCollision(a, collision, 1);
          this.bounceEnergy(a, b, collision, 1);
        } else if(b.velocity !== undefined && (a.velocity === undefined || b.mass*100 < a.mass)) {
          this.respondToCollision(b, collision, -1);
          this.bounceEnergy(b, a, collision, -1);
        }

      }
    }
  },

  respondToCollision: function respondToCollision(a, collision, factor) {
    a.position.x -= factor * collision.normal.x * collision.interpenetration;
    a.position.y -= factor * collision.normal.y * collision.interpenetration;
  },

  transferEnergy: function transferEnergy(a, b, collision) {
    var n = new math.Vec2();
    a.position.sub(b.position, n);
    n.normalize(n);
    var a1 = math.Vec2.dot(a.velocity, n);
    var a2 = math.Vec2.dot(b.velocity, n);
    var optimusP = (2 * (a1-a2)) / (a.mass + b.mass);

    var impulse = n.clone();
    impulse.scale(-1*optimusP*b.mass, impulse);
    a.velocity.add(impulse, a.velocity);

    impulse = n.clone();
    impulse.scale(optimusP*b.mass, impulse);
    b.velocity.add(impulse, b.velocity);
  },

  bounceEnergy: function bounceEnergy(a, b, collision, factor) {
    var n = collision.normal;
    n.scale(factor, n);
    var dot = math.Vec2.dot(n, a.velocity);
    if(dot < 0)
      return;
    a.velocity.sub( n.scale(dot*2,{}), a.velocity );
  },

  checkcirclecircle: function checkcirclecircle(a,b) {
    var delta = new math.Vec2();
    b.position.sub(a.position, delta);
    var length = delta.length();
    var distance = a.radius + b.radius;
    if(length < distance) {
      delta.normalize(delta);
      var interpenetration = distance-length;
      var pos = delta.clone();
      pos.scale(-a.radius + interpenetration * .5, pos);
      pos.add(a.position, pos);
      return {
        interpenetration: interpenetration,
        normal: delta,
        position: pos,
      };
    }
    return undefined;
  },

  checkcirclepolygon: function checkcirclepolygon(a,b) {

  },

  //render: function render(info) {
  //},

};

}); // end define