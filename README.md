Run in development:
-------------------

    $ git clone git@github.com:koenils/game-off-2013.git
    $ cd game-off-2013/
    $ npm install
    $ npm install -g reload
    $ reload -b

Build for deployment:
---------------------

    $ npm install -g requirejs
    $ r.js -o build.js
