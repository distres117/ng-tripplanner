var express = require('express');
var router = express.Router();
var models = require("./db/models");
var Promise = require('bluebird');

var Day = models.Day;

router.param('id', function(req,res,next,id){
	Day.findById(id).populate('Hotels Restaurants Activities')
	.then(function(day){
		req.day = day;
		next();
	}, next);
});

router.route('/')
	.get(function(req, res, next) {
		Day.find()
		.then(function(days){
			res.json(days);
		});
	})
.post(function(req, res, next) {
	Day.create({})
	.then(function(){
		res.sendStatus(204);
	});
});

router.route('/:id')
	.get(function(req, res, next) {
		res.json(req.day);
	})
	.delete(function(req,res,next){
		req.day.remove()
		.then(function(){
			res.sendStatus(204);
		}, next);
	});

router.route('/:id/:attrType')
	.put(function(req,res,next){
		var type = req.params.attrType;
		var attrId = req.body.attr;
		_models[type].findById(req.body.attr)
		.then(function(attr){
			if (req.body.method === 'PUT')
				req.day[type].push(attr._id);
			else
				req.day[type].remove(attr._id);
			return req.day.save();
		})
		.then(function(day){
			res.sendStatus(204);
		}, next);


	});




module.exports = router;
