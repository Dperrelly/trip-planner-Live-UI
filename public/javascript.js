  var itinerary = [{
    hotels: [],
    restaurants: [],
    activities: []
  }];
  var currentDay = 0;


  function addItem(itemType){
    return function(){
      var itemExists = false;
      var thingName = $('#select-' + itemType).val();
      itinerary[currentDay][itemType + 's'].forEach(function(item){
        if(item.name === thingName) {
          itemExists = true;
        }
      });
      if(!itemExists) {
        //currently only invoked 3 times at start - once for each starting object in drop-down menus
        eval('var item = findItem(thingName, all_' + itemType + 's)');
        var place = item.place[0];
        // console.log("location: ", place);
        var icon = "";

        var icons = {
          hotel: '/images/lodging_0star.png',
          restaurant: '/images/restaurant.png',
          activitie: '/images/star-3.png'
        };

        icon = icons[itemType];

        var marker = drawLocation(place.location, {
            icon: icon
        });

        item.marker = marker;
        markers.push(marker);

        itinerary[currentDay][itemType + 's'].push(item);

        console.log('itinerary: ', itinerary);


        $('#'+ itemType + 'List').append($("<div class='itinerary-item'><span class='title'>" + $(this).parent().find('select').val() + "</span><button onclick=removeItem(this) class='btn btn-xs btn-danger remove btn-circle'>x</button></div>"));
      }
    };
  }

  function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

  function setBounds() {
     var bounds = new google.maps.LatLngBounds();
     for (var i=0; i < markers.length; i++) {
         bounds.extend(markers[i].getPosition());
     }
     map.fitBounds(bounds);
  }

  function drawLocation (location, opts) {
        if (typeof opts !== 'object') {
          opts = {};
        }
        opts.position = new google.maps.LatLng(location[0], location[1]);
        opts.map = map;
        var marker = new google.maps.Marker(opts);
        //console.log(marker)
        marker.setMap(map);
        return marker;
      }

  function findItem(name, all_things){
    for(var i = 0; i < all_things.length; i++){
      //console.log(all_things[i].name + ' should equal: ', name);
      if(all_things[i].name === name) return all_things[i];
    }
  }

  function removeItem(button){
    itemName = $(button).parent().children('span').text();
    itemType = $(button).parent().parent().attr('id').slice(0, -4);
    itinerary[currentDay][itemType +'s'].forEach(function(item, index){
      if(item.name === itemName) itinerary[currentDay][itemType +'s'].splice(index, 1);
    });
    $(button).parent().remove();
    var lists = {
      hotel: all_hotels,
      restaurant: all_restaurants,
      activitie: all_activities
    };

    item = findItem(itemName, lists[itemType]);
    markers.forEach(function(mark, index){
      if(mark === item.marker) {
        markers.splice(index, 1);
        mark.setMap(null);
      }
    });
  }

  function removeDay(){
    itinerary.splice($('.current-day').val() - 1, 1);
    $('.current-day').remove();
    switchDay($('.day-buttons').children().first());
  }

  function addDay(){
    itinerary.push({
      hotels: [],
      restaurants: [],
      activities: []
    });
    button = $('<button day="' + itinerary.length + '" class="btn btn-circle day-btn current-day" onclick="switchDay(this)">' + itinerary.length + '</button>');
    switchDay(button);
    button.insertBefore('.add-day');
  }

  function switchDay(button){
    currentDay = parseInt($(button).attr('day')) - 1;
    $('.current-day').removeClass('current-day');
    $(button).addClass('current-day');
    $('.list-group').empty();
    setMapOnAll(null);
    markers = [];
    itinerary[currentDay].hotels.forEach(function(item){
      $('#hotelList').append($("<div class='itinerary-item'><span class='title'>" + item.name + "</span><button onclick=removeItem(this) class='btn btn-xs btn-danger remove btn-circle'>x</button></div>"));
      
      markers.push(item.marker);
    });
    itinerary[currentDay].restaurants.forEach(function(item){
      $('#restaurantList').append($("<div class='itinerary-item'><span class='title'>" + item.name + "</span><button onclick=removeItem(this) class='btn btn-xs btn-danger remove btn-circle'>x</button></div>"));
      
      markers.push(item.marker);
    });
    itinerary[currentDay].activities.forEach(function(item){
      $('#activitieList').append($("<div class='itinerary-item'><span class='title'>" + item.name + "</span><button onclick=removeItem(this) class='btn btn-xs btn-danger remove btn-circle'>x</button></div>"));

      markers.push(item.marker);
    });
    setMapOnAll(map);
    if(markers.length) setBounds();
    $('#day-title span').text('Day ' + String(currentDay + 1));
  }

  $('#hotel-btn').on('click', addItem('hotel'));
  $('#restaurant-btn').on('click', addItem('restaurant'));
  $('#activity-btn').on('click', addItem('activitie'));
