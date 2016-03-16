
  var gMap;

 function initialize_gmaps(fn) {
      // initialize new google maps LatLng object
      var myLatlng = new google.maps.LatLng(40.705189,-74.009209);
      // set the map options hash
      var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      // get the maps div's HTML obj
      var map_canvas_obj = document.getElementById("map-canvas");
      // initialize a new Google Map with the options
      gMap = new google.maps.Map(map_canvas_obj, mapOptions);
      // Add the marker to the map
      //console.log(map);
      // var marker = new google.maps.Marker({
      //     position: myLatlng,
      //     title:"Hello World!"
      // });
      // marker.setMap(gMap);
      fn(gMap);
  };


define(function(){
  return initialize_gmaps;
});