// REQUIRE
var express = require('express');

// INITIALIZE
var port  = process.env.PORT || 8080,
    app   = express();

// MIDDLEWARE
app.use(express.static(__dirname.replace("/example", "")));
app.set('views', './example');
app.set('view engine', 'ejs');
app.get('/', function (req, res) {
  res.render('index');
});

// LISTEN
app.listen(port, function (err) {
  console.log('Listening on http://localhost:%d', port);
});

// HANDLE ERRORS
process.on('uncaughtException', function(err) {
  if(err.errno !== 'EADDRINUSE'){
    console.log(err);
    process.exit(1);
  }
});
