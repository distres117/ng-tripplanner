require(['tripplanner', 'map'], function(Tripplanner, init){
  $(function() {
      var fn = function(){

        new Tripplanner();
      };
      init(fn);
  });

});
