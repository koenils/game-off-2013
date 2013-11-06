
define({

  x: 100, y: 100,

  init: function(game) {
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
    info.ctx.fillRect(this.x-this.width/2, this.y-this.height/2, this.width, this.height);
  },

});
