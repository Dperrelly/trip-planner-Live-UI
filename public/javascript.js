  function addItem(itemType){
    var thingName = $('#select-' + itemType).val();
    //console.log('thing name ', thingName);
    eval('var place = findPlace(thingName, all_' + itemType + 's)[0]');
    console.log("location: ", place);
    var icon = "";
    //var place = {};
    if(itemType === 'hotel') {
      icon = '/images/lodging_0star.png';
      //place = findPlace(thingName, all_hotels)[0];

    }
    if(itemType === 'restaurant') {
      icon = '/images/restaurant.png';
    }
    if(itemType === 'activitie') {
      icon = '/images/star-3.png';
    }
    drawLocation(place.location, {
        icon: icon
      });
    return function(){
      $('#'+ itemType + 'List').append($("<div class='itinerary-item'><span class='title'>" + $(this).parent().find('select').val() + "</span><button class='btn btn-xs btn-danger remove btn-circle'>x</button></div>"));
    };
  }
  function drawLocation (location, opts) {
        if (typeof opts !== 'object') {
          opts = {};
        }
        opts.position = new google.maps.LatLng(location[0], location[1]);
        opts.map = map;
        var marker = new google.maps.Marker(opts);
      }

  function findPlace(name, all_things){
    for(var i = 0; i < all_things.length; i++){
      //console.log(all_things[i].name + ' should equal: ', name);
      if(all_things[i].name === name) return all_things[i].place;
    }
  }
  $('#hotel-btn').on('click', addItem('hotel'));
  $('#restaurant-btn').on('click', addItem('restaurant'));
  $('#activity-btn').on('click', addItem('activitie'));