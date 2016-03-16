function Mapper(map, perm){
  // this.points = {
  //   perm: perm
  // };
  this.points = {};
  this.map = map;
  var marker = this.getDefaultMarker();
  this.points["perm"] = marker;
  marker.setMap(this.map);
}

Mapper.prototype.icons = {
  Restaurants: 'http://maps.google.com/mapfiles/kml/pal2/icon37.png',
  Hotels: 'http://maps.google.com/mapfiles/kml/pal2/icon20.png',
  Activities: 'http://maps.google.com/mapfiles/kml/pal2/icon57.png'
};

Mapper.prototype._setBounds = function(){
  var bounds = new google.maps.LatLngBounds();
  Object.keys(this.points).forEach(function(key){
    bounds.extend(this.points[key].getPosition());
  }, this);
  this.map.fitBounds(bounds);
};

Mapper.prototype.addMarker = function(item){
    var pt = new google.maps.LatLng(item.place.location[0],item.place.location[1]);
    var marker = new google.maps.Marker({
        position: pt,
        title: item.name,
        icon: this.icons[item.category]
    });
    marker.setMap(this.map);
    //this.points[item._id] = marker;
    this.points[item._id] = marker;
    this._setBounds();
};

Mapper.prototype.removeMarker = function(id){
  var marker = this.points[id];
  marker.setMap(null);
  delete this.points[id];
  this._setBounds();
};

Mapper.prototype.reset = function(){
  Object.keys(this.points).forEach(function(key) {
    //point.setMap(null);
    this.points[key].setMap(null);
  }, this);
  this.points = {};
  var marker = this.getDefaultMarker();
  marker.setMap(this.map);
  this.points["perm"] = marker;
  this._setBounds();
};

Mapper.prototype.getDefaultMarker = function() {
  var myLatlng = new google.maps.LatLng(40.705189,-74.009209);
  var marker = new google.maps.Marker({
      position: myLatlng,
      title:"Hello World!"
  });
  return marker;
  //marker.setMap(this.map);
};

define(function(){
  return Mapper;
});
