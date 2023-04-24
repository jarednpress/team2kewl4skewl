// // require('../index.js');
// const axios = require("axios");


// test('this should work', async() => {
//     var thisThing = await getLatLong("Boulder", "CO", "US");

//     console.log(`This is the thing ${thisThing}`);

// });

// test(`test lat long`, async() =>{
//     var otherguy = await getWeather("40.0154155", "-105.270241");

//     expect(otherguy != null);

//     console.log("this is the object %j", otherguy);

//     console.log(`This is the weather: ${otherguy}`);
    
// });

// async function getLatLong(cityname, statecode, countrycode) {
//     const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityname},${statecode},${countrycode}&appid=37dc46921df33a021efbbcd0e447e4a7`;
//     // const url = `http://api.openweathermap.org/geo/1.0/direct?q=boulder,CO,US&appid=37dc46921df33a021efbbcd0e447e4a7`;
//     try {
//       console.log(`We are in the function`);
//       const response = await axios.get(url);
//       const lat = response.data[0].lat;
//       const long = response.data[0].lon;
//       console.log(`Here is the lat ${lat} and the long ${long}`)
//       return [ lat, long ];
//     } catch (error) {
//       console.error(error);
//       return null;
//     }
//   }


//   async function getWeather(lat, lon) {
//     const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=37dc46921df33a021efbbcd0e447e4a7`;
//     try {
//       const response = await axios.get(url);
//       const temperature = response.data.list[0].main.temp;
//       return temperature;
//     } catch (error) {
//       console.error(error);
//       return null;
//     }
//   }