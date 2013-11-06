
quick start:
------------

Simply run the following command (depends: node.js, npm, curl & a browser):
`$ curl -sL http://git.io/qx2R-A | egrep '\s{4}\$\s' | sed 's/[[:space:]]\{4\}$ //' | bash`


Fetch source:
-------------

    $ git clone git@github.com:koenils/game-off-2013.git
    $ cd game-off-2013/


Build for deployment:
---------------------

    $ npm install
    $ npm install -g requirejs
    $ r.js -o build.js


Run in development:
-------------------

    $ npm install
    $ npm install -g reload
    $ reload -b
