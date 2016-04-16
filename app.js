var express = require('express'),
  app = express();

require('./server/config')(app);
app.use('/api', require('./server/routes.js'));

//app.use('/api', apiRoutes);

app.use(function(req, res, next){
  var error = new Error('Page Not Found');
  error.status = 404;
  next(error);
});

app.use(function(err, req, res, next){
  res.status(err.status || 500);
  console.log(err);
  res.send({ title: 'Error', error: err });
});


module.exports = app;
