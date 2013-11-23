require.config({
});
require(['math', 'physics', 'loader', 'levels', 'player'], function(math, physics, loader, levels, player) {

var Game = function() {
  this.canvas = document.getElementById('c');
  this.ctx = this.canvas.getContext('2d');

  this.renderinfo = {
    ctx: this.ctx,
    width: this.canvas.width,
    height: this.canvas.height,
  };

  this.gravity = new math.Vec2(0,100);

  this.root = {
    childs: [],

    render: function(info) {
      info.ctx.clearRect(0,0,info.width,info.height);
    },
  };

  this.root.childs.push(physics);

  this.root.childs = this.root.childs.concat(loader.fromArray(levels.l[0].data, levels.l[0].width, this.renderinfo.width/levels.l[0].width));
  this.renderinfo.tilesize = this.renderinfo.width/levels.l[0].width;

  this.root.childs.push(player);

/*
  this.root.childs.push({
    position: new math.Vec2(100,100),
    velocity: new math.Vec2(0,50),
    shape: 'circle',
    radius: 10,
    initiateCollision: true, // two entity can collide if one of them has this on true
    integrate: function(elapsed) {
    },
    render: function(info) {
      info.ctx.beginPath();
      info.ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
      info.ctx.fillStyle = this.color || 'purple';
      info.ctx.fill();
    },
  });
  this.root.childs.push({
    position: new math.Vec2(100,150),
    velocity: new math.Vec2(0,0),
    mass: 99,
    shape: 'circle',
    initiateCollision: true, // two entity can collide if one of them has this on true
    radius: 10,
    render: function(info) {
      info.ctx.beginPath();
      info.ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
      info.ctx.fillStyle = this.color || 'pink';
      info.ctx.fill();
    },
  });
  this.root.childs.push({
    position: new math.Vec2(100,200),
    // no velocity is static
    shape: 'circle',
    radius: 10,
    render: function(info) {
      info.ctx.beginPath();
      info.ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
      info.ctx.fillStyle = this.color || 'pink';
      info.ctx.fill();
    },
  });
  this.root.childs.push({
    position: new math.Vec2(100,50),
    // no velocity is static
    shape: 'circle',
    radius: 10,
    render: function(info) {
      info.ctx.beginPath();
      info.ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
      info.ctx.fillStyle = this.color || 'pink';
      info.ctx.fill();
    },
  });*/

};

function walk( entity, fn, reversed ) {
  var args = Array.prototype.slice.call(arguments, 0);
  entity = args.shift();
  fn = args.shift();
  reversed = args.shift();
  if(entity[fn] !== undefined  && !entity.ghost) {
    entity[fn].apply(entity, args);
  }
  if(entity.childs !== undefined && entity.childs.length > 0) {
    // assign parent if last argument is null:
    if(args[args.length-1] == null) {
      args[args.length-1] = entity;
    }
    if(reversed) {
      for( var i = entity.childs.length-1; i >= 0; i-- ) {
        walk.apply(null, [entity.childs[i], fn, reversed].concat(args));
        if(entity.childs[i].destroyed) {
          entity.childs.splice(i,1);
        }
      }
    } else {
      for( var i = 0; i < entity.childs.length; i++ ) {
        walk.apply(null, [entity.childs[i], fn, reversed].concat(args));
      }
    }
  }
}

Game.prototype.run = function run() {

  var now = (new Date()).getTime();
  var elapsed = (now-this.last)/1000;
  this.last = now;

  walk(this.root, 'update', true, elapsed);
  this.renderinfo.elapsed = elapsed;
  walk(this.root, 'render', false, this.renderinfo);

};

Game.prototype.start = function start() {

  this.last = (new Date()).getTime();

  walk(this.root, 'init', false, this, null);
  setInterval(this.run.bind(this), 1000/60);
};

new Game().start();

});
