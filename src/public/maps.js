function initAutocomplete() {
  const input1 = document.getElementById('search-box1');
  const input2 = document.getElementById('search-box2');

  const options = {
    types: ['(cities)'],
    componentRestrictions: { country: 'us' },
  };

  const autocomplete1 = new google.maps.places.Autocomplete(input1, options);
  const autocomplete2 = new google.maps.places.Autocomplete(input2, options);

  let place1, place2;

  autocomplete1.addListener('place_changed', function() {
    place1 = autocomplete1.getPlace();
    console.log(place1);

    if (place1 && place2) {
      calculateDistance(place1.geometry.location, place2.geometry.location);
    }
  });

  autocomplete2.addListener('place_changed', function() {
    place2 = autocomplete2.getPlace();
    console.log(place2);

    if (place1 && place2) {
      calculateDistance(place1.geometry.location, place2.geometry.location);
    }
  });
}

function calculateDistance(location1, location2) {
  const service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [location1],
      destinations: [location2],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.IMPERIAL,
    },
    function (response, status) {
      if (status === google.maps.DistanceMatrixStatus.OK) {
        const distance = response.rows[0].elements[0].distance;
        const duration = response.rows[0].elements[0].duration;
        console.log(`Distance: ${distance.text} (${distance.value} meters)`);
        console.log(`Duration: ${duration.text} (${duration.value} seconds)`);
        console.log(duration.text); //THIS IS THE DISTANCE IN HOURS, MINS
      } else {
        console.log(`Error: ${status}`);
      }
    }
  );
}

window.addEventListener('load', initAutocomplete);
