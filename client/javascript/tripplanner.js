// /* globals $,Mapper */

var ajax;
function Tripplanner(attractions){
  this.currentDay = null;
  // this.mapper = new Mapper(map, perm);
  this.attractions = attractions;
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
      console.log(id,category);
      var item = that.findItemByIdAndCategory(id, category);
      $(this).remove();
      that.removeItemFromDay(item);
    });
  });
  //buttons for adding events
  this.categoryIterator(function(category){
    var btn = $('#' + category + 'Add');
    var that = this;

    btn.click(function(){
      var selector = that.getChooser(category);
      var data = {
        attrType: 'Hotel',
        attr: selector.val()
      };
      ajax.putRequest('/api/' + that.currentDay, data, function(){
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

Tripplanner.prototype.findItemByIdAndCategory = function(id, cat){
  return this.attractions[category].filter(function(_item){
      return _item._id == id;
    })[0];
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

Tripplanner.prototype.removeItemFromDay = function(item){
    this.showItemInChooser(item);
    var collection = this.days[this.currentDay][item.category];
    var idx = collection.indexOf(item._id);
    collection.splice(idx, 1);
    // this.mapper.removeMarker(item);
};

Tripplanner.prototype.renderDayPicker = function(){
    var current;
    $('#dayPicker').empty();
    var that = this;
    getRequest('/api',function(res){
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

    },
    function(err){
      console.log(err);
    });
};

//Renders all items in current day
Tripplanner.prototype.renderDay = function(){
    this.resetLists();

    if(this.currentDay === null)
      return;
    var that = this;
    ajax.getRequest('/api/' + this.currentDay, function(res){
      var day = res;
      console.log(res);
      that.categoryIterator(function(category){
        var ids = day[category];
        ids.forEach(function(id){
          var item = this.findItemByIdAndCategory(id, category);
          this.renderItem(item);
        }, that);
      });
    }, function(err){
      console.log(err);
    });

};

Tripplanner.prototype.renderItem = function(item){
    var list = this.getDayList(item.category);
    var li = $('<li />').addClass('list-group-item');
    li.attr('data-id', item._id);
    li.attr('data-category', item.category);
    li.html(item.name);
    list.append(li);
    this.hideItemInChooser(item);
    // this.mapper.addMarker(item);
};
define(['ajax'], function(_ajax){
  ajax=_ajax;
  return Tripplanner;
});
