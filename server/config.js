var express = require('express');

module.exports = function(app){

  app.use(require('morgan')('dev'));
  app.use(require('body-parser').json());

};
