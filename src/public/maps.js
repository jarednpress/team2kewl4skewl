function initAutocomplete() {
  const input1 = document.getElementById('search-box1');
  const input2 = document.getElementById('search-box2');

  // Add options for city and country restrictions
  const options = {
    types: ['(cities)'],
    componentRestrictions: { country: 'us' },
  };

  const autocomplete1 = new google.maps.places.Autocomplete(input1, options);
  const autocomplete2 = new google.maps.places.Autocomplete(input2, options);

  autocomplete1.addListener('place_changed', function() {
    const place = autocomplete1.getPlace();
    console.log(place);
  });

  autocomplete2.addListener('place_changed', function() {
    const place = autocomplete2.getPlace();
    console.log(place);
  });
}

window.addEventListener('load', initAutocomplete);
