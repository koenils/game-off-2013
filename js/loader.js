
define(function (requirejs) {

  var math = requirejs('math');

  return {
    fromArray: function (data, width, size){

      var x = 0;
      var y = 0;

      var result = [];
      for( var i = 0; i < data.length; i++ ) {
        if(data[i] == 1) {
          result.push({

            position: new math.Vec2(x+size/2, y+size/2),
            halfSize: new math.Vec2(size/2, size/2),
            shape: 'aabb',

            render: function(info) {
              info.ctx.fillStyle = 'black';
              info.ctx.fillRect(this.position.x-this.halfSize.x, this.position.y-this.halfSize.y, this.halfSize.x*2, this.halfSize.y*2);
            }

          });

        }

        x += size;
        if( i % width == width-1 ) {
          x = 0;
          y += size;
        }

      }

      return result;
    }

}});