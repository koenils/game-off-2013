
define({

  fromArray: function (data, width, size){

    var x = 0;
    var y = 0;

    var result = [];
    for( var i = 0; i < data.length; i++ ) {
      if(data[i] == 1) {
        result.push({

          x: x+size/2,
          y: y+size/2,
          width: size,
          height: size,

          render: function(info) {
            info.ctx.fillStyle = 'black';
            info.ctx.fillRect(this.x-this.width/2, this.y-this.height/2, this.width, this.height);
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

});