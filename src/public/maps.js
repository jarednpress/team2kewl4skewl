function initAutocomplete() {
  const input1 = document.getElementById('search-box1');
  const input2 = document.getElementById('search-box2');
  const autocomplete1 = new google.maps.places.Autocomplete(input1);
  const autocomplete2 = new google.maps.places.Autocomplete(input2);

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
