var mongoose = require('mongoose');
var placeSchema = mongoose.Schema({
  address: String,
  city: String,
  state: String,
  phone: String,
  location: [Number]
});

var hotelSchema = mongoose.Schema({
  name: { type: String, required: true },
  num_stars: Number,
  amenities: String,
  place: placeSchema
});

var restaurantSchema = mongoose.Schema({
  name: String,
  cuisine: String,
  price: Number,
  place: placeSchema
});

var activitySchema = mongoose.Schema({
  name: String,
  age_range: String,
  place: placeSchema
});

var daySchema = new mongoose.Schema({
  currentDay: Number,
  Hotels: [{type: mongoose.Schema.Types.ObjectId, ref: 'Hotel'}],
  Restaurants: [{type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'}],
  Activities: [{type: mongoose.Schema.Types.ObjectId, ref: 'Activity'}],

});

var Place = mongoose.model('Place', placeSchema);
var Hotel = mongoose.model('Hotel', hotelSchema);
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
var Activity = mongoose.model('Activity', activitySchema);
var Day = mongoose.model('day', daySchema);

var models = {Hotels: Hotel,
  Places: Place,
  Restaurants: Restaurant,
  Activities: Activity,
  Day :Day};

module.exports = models;
