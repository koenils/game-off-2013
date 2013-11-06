require(['loader', 'levels', 'player'], function(loader, levels, player) {






var Game = function() {
  this.canvas = document.getElementById('c');
  this.ctx = this.canvas.getContext('2d');

  this.renderinfo = {
    ctx: this.ctx,
    width: this.canvas.width,
    height: this.canvas.height,
  };

  this.root = {
    childs: [],

    render: function(info) {
      info.ctx.clearRect(0,0,info.width,info.height);
    },
  };

  this.root.childs = this.root.childs.concat(loader.fromArray(levels.l[0].data, levels.l[0].width, this.renderinfo.width/levels.l[0].width));
  this.renderinfo.tilesize = this.renderinfo.width/levels.l[0].width;

  this.root.childs.push(player);

};

function walk( entity, fn ) {
  var args = Array.prototype.slice.call(arguments, 0);
  entity = args.shift();
  fn = args.shift();
  if(entity[fn] !== undefined  && !entity.ghost) {
    entity[fn].apply(entity, args);
  }
  if(entity.childs !== undefined && entity.childs.length > 0) {
    for( var i = entity.childs.length-1; i >= 0; i-- ) {
      walk.apply(null, [entity.childs[i], fn].concat(args));
      if(entity.childs[i].destroyed) {
        entity.childs.splice(i,1);
      }
    }
  }
}

Game.prototype.run = function run() {

  var elapsed = 1/60;

  walk(this.root, 'init', this);
  walk(this.root, 'update', elapsed);
  walk(this.root, 'render', this.renderinfo);

};

Game.prototype.start = function start() {
  setInterval(this.run.bind(this), 1000/60);
};

new Game().start();

});
