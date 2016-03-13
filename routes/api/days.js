var express = require('express');
var router = express.Router();
var models = require("../../db");

var Day = models.models.Day;

router.get('/', function(req, res, next) {
	Day.find()
	.then(function(days){
		res.json(days);
	});
});

router.get('/:day', function(req, res, next) {
	Day.findOne({currentDay:req.params.day})
	.then(function(day){
		res.json(day);
	});
});

router.post('/', function(req, res, next) {
	Day.count()
	.then(function(count) {
		var newDay = new Day({
			currentDay: count+1
		});
		return newDay.save();
	})
	.then(function(day) {
		res.json(day);
	});
});

module.exports = router;
