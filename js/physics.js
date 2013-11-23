define(['math','utils'], function(math, utils) {

return {

  // TODO: docs?
  // TODO: polygon/OABB

  executionCount: 4,

  init: function(game, parent) {
    this.parent = parent;
    this.initiates = [];

    var parent = this.parent;
    for( var i = 0; i < parent.childs.length; i++ ) {
      var child = parent.childs[i];
      if(child.position !== undefined && child.shape !== undefined) {
        if( child.initiateCollision ) {
          this.initiates.push( child );
        }
      }
    }
  },

  addedChild: function( child ) {
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
          if(e.acceleration !== undefined) {
            e.position.x += e.acceleration.x * subElapsed * subElapsed * .5;
            e.position.y += e.acceleration.y * subElapsed * subElapsed * .5;

            this.velocity.x += e.acceleration.x * subElapsed;
            this.velocity.y += e.acceleration.y * subElapsed;
          }

          e.velocity.x *= Math.pow(.9, subElapsed);
          e.velocity.y *= Math.pow(.9, subElapsed);
        }

        if(e.position !== undefined && e.shape !== undefined && !e.ghost && !e.destroyed) {
          this.checkCollision(e);
        }
      }
    }

  },

  checkCollision: function checkCollision( e ) {
    var parent = this.parent;
    for( var i = this.initiates.length-1; i >= 0; i-- ) {
      if(!this.initiates[i].ghost && !this.initiates[i].destroyed) {
        this.checkCollisionBetween(e, this.initiates[i]);
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

    var friction = a.friction || 0;
    var bounce = a.bounce || 1;
    this.applyModel(a, collision.normal, friction, bounce);
  },

  applyModel: function applyModel(a, normal, friction, bounce) {

    if (friction != 0 || bounce != 1)
    {
      var right = normal.rightPerproduct();
      var f = right.clone(math.Vec2.dot(a.velocity, right));
      var b = normal.clone(math.Vec2.dot(a.velocity, normal));
      a.velocity.x = f.x * (1 - friction) + b.x * bounce;
      a.velocity.y = f.y * (1 - friction) + b.y * bounce;
    }
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

  checkaabbaabb: function checkaabbaabb(a,b) {
    var x = Math.abs(b.position.x - a.position.x) - a.halfSize.x - b.halfSize.x;
    var y = Math.abs(b.position.y - a.position.y) - a.halfSize.y - b.halfSize.y;

    if( x < 0 && y < 0 ) {
      //collision!
      var interpenetration = -Math.max(x,y);
      var normal;
      if( x > y ) {
        normal = a.position.x > b.position.x ? new math.Vec2(-1,0) : new math.Vec2(1,0);
      } else {
        normal = a.position.y > b.position.y ? new math.Vec2(0,-1) : new math.Vec2(0,1);
      }
      return {
        interpenetration: interpenetration,
        normal: normal,
        position: "to lazy to implement",
      }
    }
    return undefined;
  },
  checkcircleaabb: function checkcircleaabb(a,b) {

  },
  checkaabbcircle: function checkcircleaabb(a,b) {
    var r = this.checkcircleaabb(b,a);
    if(r) {
      r.normal.scale(-1, r.normal);
    }
    return r;
  },

  //render: function render(info) {
  //},

};

}); // end define