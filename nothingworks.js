var min = require("min");

min.set('foo', 'bar', function(err) {
  if (err) {
    return console.error(err);
  }

  min.get('foo', function(err, value) {
    if (err) {
      return console.error(err);
    }

    console.log(value); //=> bar
  });
});