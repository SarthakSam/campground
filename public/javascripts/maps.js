$(document).ready(function () {

  function moveMapToLocation(map,campgroundLocation) {
    // console.log(campgroundLocation)
    let locationMarker = new H.map.Marker({
      lat: campgroundLocation.Latitude,
      lng: campgroundLocation.Longitude
    });
    map.setCenter({ lat: campgroundLocation.Latitude, lng: campgroundLocation.Longitude });
    map.setZoom(11);
    map.addObject(locationMarker);

  }
    /**
* Boilerplate map initialization code starts below:
*/

      //Step 1: initialize communication with the platform
      let platform = new H.service.Platform({
        app_id: 'FuqaEXDeWs5FkdQAlKW3',
        app_code: 'AG4KXTSK7-GAr5jXicSDFw',
        useHTTPS: true
      });

      let pixelRatio = window.devicePixelRatio || 1;
      let defaultLayers = platform.createDefaultLayers({
        tileSize: pixelRatio === 1 ? 256 : 512,
        ppi: pixelRatio === 1 ? undefined : 320
      });


      //Step 2: initialize a map  - not specificing a location will give a whole world view.
      let map = new H.Map(document.getElementById('map'),
        defaultLayers.normal.map, { pixelRatio: pixelRatio });

      //Step 3: make the map interactive
      // MapEvents enables the event system
      // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
      let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

      // Create the default UI components
      let ui = H.ui.UI.createDefault(map, defaultLayers);

      // Now use the map as required...

  $.get(location.pathname + '/location', function (res) {
    // console.log(res);
    if (res.status === 200) {
  
      moveMapToLocation(map,res.coordinates);
    }

  });

  let addLocation = document.getElementById('locationSubmitForm')
  if (addLocation)
    addLocation.addEventListener('submit', function (event) {
      event.preventDefault();
      $.ajax({
        url: 'https://geocoder.api.here.com/6.2/geocode.json',
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        data: {
          searchtext: document.getElementById('location').value,
          app_id: 'FuqaEXDeWs5FkdQAlKW3',
          app_code: 'AG4KXTSK7-GAr5jXicSDFw',
          gen: '9'
        },
        success: function (data) {
          window.obj = data.Response;
          if (data.Response.View.length === 0) {
            alert("Unable to add location. Plzz enter valid location or be more specific");
            return;
          }
          let coordinates = data.Response.View[0].Result[0].Location.DisplayPosition;
          let locEnteredByUser = document.getElementById('location').value;
          $.post(location.pathname + '/location', { coordinates: coordinates, location: locEnteredByUser }, function (res) {
            // console.log(res);
            // console.log(coordinates)
            moveMapToLocation(map,coordinates);
          });
        }
      });
    });
});

