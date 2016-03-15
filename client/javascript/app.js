require(['tripplanner', 'map'], function(Tripplanner, init){
  $(function() {
      var fn = function(attractions){

        new Tripplanner(attractions);
      };
      init(fn);
  });

});
