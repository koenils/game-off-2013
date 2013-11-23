define(['math'], function(math) {

return {
  position: new math.Vec2(100,100),
  velocity: new math.Vec2(),
  initiateCollision: true,
  mass: 30,
  friction: .6,
  bounce: .4,
  shape: "aabb",

  init: function(game, parent) {
    this.game = game;

    this.halfSize = new math.Vec2( game.renderinfo.tilesize * .4, game.renderinfo.tilesize * .7 );

    console.log('player init', this);
    delete this.init;
  },

  update: function(elapsed) {
  },

  integrate: function(elapsed) {
    this.velocity.addScaled(this.game.gravity, elapsed, this.velocity);
  },

  render: function(info) {
    info.ctx.fillStyle = 'indigo';
    info.ctx.fillRect(this.position.x-this.halfSize.x, this.position.y-this.halfSize.y, this.halfSize.x*2, this.halfSize.y*2);
  },

};

}); // end define