// /* globals $,Mapper */

var ajax;
var Mapper;

function Tripplanner(map){
  this.currentDay = null;

  this.mapper = new Mapper(map);

  console.log("map: ",map);
  var that = this;
  ajax.getRequest('/api', function(res){
    if (res.length === 0)
      that.addDay();
    else {
      that.renderDayPicker();
    }
  });
  this.init();
}


Tripplanner.prototype.init = function(){
  var that = this;
  //changing behavior for day-picker
  $('#dayPicker').on('click', 'li', function(){
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    that.currentDay = $(this).attr('value');
    that.renderDay();
  });


  this.dayListIterator(function(list){
    var that = this;
    list.on('click', 'li', function(){
      var id = $(this).attr('data-id');
      var category = $(this).attr('data-category');
      that.removeItemFromDay(id,category, $(this));
    });
  });
  //buttons for adding events
  this.categoryIterator(function(category){
    var btn = $('#' + category + 'Add');
    var that = this;

    btn.click(function(){
      var selector = that.getChooser(category);
      var data = {
        attr: selector.val(),
        method: 'PUT'
      };
      ajax.putRequest('/api/' + that.currentDay + '/' + category, data, function(){
        that.renderDay();
      });
      // if(that.days.length === 0 || !selector.val())
      //   return;

    });
  });
  $('#dayAdder').click(function(){
    that.addDay();
  });

  $('#dayRemover').click(function(){
    var id = $('#dayPicker .active').attr('value');
    ajax.deleteRequest('/api/' + id, function(){
      that.renderDayPicker();
    });
  });
};

Tripplanner.prototype.addDay = function(){
  var that = this;
  ajax.postRequest('/api', null, function(res){
    that.renderDayPicker();
  },function(err){
    console.log(err);
  });
};


Tripplanner.prototype.getChooser = function(category){
    return $('#' + category + 'Chooser');
};

Tripplanner.prototype.chooserIterator = function(fn){
  this.categoryIterator(function(cat){
      fn(this.getChooser(cat));
  });
};

Tripplanner.prototype.getDayList = function(category){
    return $('#dayList' + category );
};

Tripplanner.prototype.dayListIterator = function(fn){
    fn = fn.bind(this);
    this.categoryIterator(function(cat){
        fn(this.getDayList(cat));
    });
};

Tripplanner.prototype.categoryIterator = function(fn){
  fn = fn.bind(this);
  ['Hotels', 'Restaurants', 'Activities'].forEach(fn);
};

Tripplanner.prototype.resetLists = function(){
    this.dayListIterator(function(dayList){
      dayList.empty();
    });

    this.chooserIterator(function(chooser){
      chooser.children().removeClass('hidden').show();
    });
    // this.mapper.reset();
};

Tripplanner.prototype.hideItemInChooser = function(item){
    var chooser = this.getChooser(item.category);
    var option = $('[value=' + item._id + ']', chooser);
    option.hide().addClass('hidden');
    var sibs = option.siblings(':not(.hidden)');
    if(sibs.length)
      chooser.val(sibs[0].value);
    else
      chooser.val(null);
};

Tripplanner.prototype.showItemInChooser = function(item){
    var chooser = this.getChooser(item.category);
    var option = $('[value=' + item._id + ']', chooser);
    option.show().removeClass('hidden');
};

Tripplanner.prototype.removeItemFromDay = function(id, category, elem){
    var data = {
      attr: id,
      method: 'DELETE'
    };
    var that = this;
    ajax.putRequest('/api/' + this.currentDay +'/' + category, data, function(){
      elem.remove();
      that.mapper.removeMarker(id);
    });
    //this.showItemInChooser(item);
    // this.mapper.removeMarker(item);
};

Tripplanner.prototype.renderDayPicker = function(){
    var current;
    $('#dayPicker').empty();
    var that = this;
    ajax.getRequest('/api',function(res){
      var picker = $('#dayPicker');
      res.forEach(function(day,index){
        var link = $('<a />').html(index+1);
        var li = $('<li />').append(link);
        li.attr('value', day._id);
        picker.append(li);
      }, that);
      if (picker.children().length === 1)
        current = $('#dayPicker li').first();
      else
        current = $('#dayPicker li').last();
      current.addClass('active');
      that.currentDay = current.attr('value');
      that.renderDay();

    },
    function(err){
      console.log(err);
    });
};

//Renders all items in current day
Tripplanner.prototype.renderDay = function(){
    this.resetLists();
    this.mapper.reset();

    if(this.currentDay === null)
      return;
    var that = this;
    ajax.getRequest('/api/' + this.currentDay, function(res){
      var day = res;
      that.categoryIterator(function(category){
        var items = day[category];
        items.forEach(function(item){
          that.mapper.addMarker(item);
          this.renderItem(item, category);
        }, that);
      });
    }, function(err){
      console.log(err);
    });

};

Tripplanner.prototype.renderItem = function(item, category){
    var list = this.getDayList(category);
    var li = $('<li />').addClass('list-group-item');
    li.attr('data-id', item._id);
    li.attr('data-category', category);
    li.html(item.name);
    var btn = $('<button />').html('x').addClass('btn btn-danger btn-xs pull-right');
    li.append(btn)
    list.append(li);
    this.hideItemInChooser(item);
    // this.mapper.addMarker(item);
};
define(['ajax', 'mapper'], function(_ajax, _Mapper){
  ajax=_ajax;
  Mapper = _Mapper;
  return Tripplanner;
});
