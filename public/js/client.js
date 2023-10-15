// const form = document.getElementById("weatherForm");
// const citySearchInput = document.getElementById("citySearch");
// const weatherInfo = document.getElementById("weatherInfo");
// const searchButton = document.getElementById("searchButton");

// // form.addEventListener("submit", async (e) => {
// //   e.preventDefault();
// //   const cityName = citySearchInput.value;

// //   try {
// //     const response = await fetch(`/getWeather?city=${cityName}`);
// //     if (response.status === 200) {
// //       const weatherData = await response.text();
// //       // Update the 'weatherInfo' div with the rendered HTML from the server
// //       weatherInfo.innerHTML = weatherData;
// //     } else {
// //       console.error(
// //         "Weather API request failed with status code",
// //         response.status,
// //       );
// //       // Display an error message on the webpage
// //       weatherInfo.innerHTML = "Weather data could not be retrieved.";
// //     }
// //   } catch (error) {
// //     console.error("Error:", error);
// //     // Display an error message on the webpage
// //     weatherInfo.innerHTML = "An error occurred while fetching weather data.";
// //   }
// // });

// form.addEventListener("submit", (e) => {
//   e.preventDefault();
//   exports.cityName = citySearchInput.value;
//   // module.exports = cityName;
// });
