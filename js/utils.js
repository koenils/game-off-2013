
define({
  test: function test() {
    console.log('asd');
  },
  toTitleCase: function toTitleCase(str) {
    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
  },
});
