define(['math'], function(math) {

return {
  position: new math.Vec2(100,100),


  init: function(game, parent) {
    this.game = game;

    this.width = game.renderinfo.tilesize * .4;
    this.height =  game.renderinfo.tilesize * .7;

    console.log('player init', this);
    delete this.init;
  },

  update: function(elapsed) {
  },

  render: function(info) {
    info.ctx.fillStyle = 'indigo';
    info.ctx.fillRect(this.position.x-this.width/2, this.position.y-this.height/2, this.width, this.height);
  },

};

}); // end define