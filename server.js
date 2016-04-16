var db = require('./server/db');
var chalk = require('chalk');
var app = require('./app');


db.connect()
  .then(function(conn){
    console.log('db connected:', chalk.green(conn.name));
    var port = process.env.PORT || 3000;
    app.listen(port, function(){
      console.log('listening on', port);
    });
  }, function(err){
    console.log(chalk.red(err));
  });
