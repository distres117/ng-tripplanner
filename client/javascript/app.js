require(['tripplanner', 'map'], function(Tripplanner, init){
  $(function() {
      var fn = function(gMap){
      	new Tripplanner(gMap);
      };
      init(fn);
  });

});
