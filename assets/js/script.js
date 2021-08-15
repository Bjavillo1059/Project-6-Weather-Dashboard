// src of base code // ellsicozoun(19July2021)weather(javascript)[structure/uv index] //



var searchBtn = $('#search-button');
var formClassEl = $('.input-group');
var inputEl = $('#user-input');
var timeDisplayEl = $('#time-display');
var currentDayEl = $('#current-day')
var fiveDayCastEl = $('#five-day')
var clearHistoryEl = $('#clear-history')
var tempId = $('#temperature');
var humidId = $('#humidity');
var windSpeedId = $('#wind-speed')
var UVindexId = $('#UV-index')

var API_KEY = "62e2ac81b06789e9f89de31b469e8976";

var searchHistory = JSON.parse(localStorage.getItem("search"));
if (!searchHistory) {
  var searchHistory = [];
} else {
  generateHistory();
}

// displaying the time
function displayDate() {
  var currentTime = moment().format('MMMM Do YYYY, h:mm:ss');
  timeDisplayEl.text(currentTime);
};

setInterval(displayDate, 1000);

// Search Function
// execute getWeatherApi function then add it to the search history
function searchCity() {
  var cityName = inputEl.val();
  getWeatherApi(cityName);
  searchHistory.unshift(cityName); // ? ask about unshift / adding something to beginning of an array
  searchHistory = searchHistory.slice(0, 5); //ask about slice / cut items out of an array create a new array / look into splice on MDN
  localStorage.setItem("search", JSON.stringify(searchHistory));
  generateHistory();
}

// clear history when button is clicked
clearHistoryEl.on('click', function () {
  // clear out localStorage
  localStorage.removeItem('search') // removeItem removes single item / clear removes everything
  $('ul').empty()
})

// Fetch the API UV index

// Fetch the API
function getWeatherApi(cityName) {
  let API_KEY = "62e2ac81b06789e9f89de31b469e8976";
  // let weatherUrl = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`);
  // console.log(weatherUrl)
  // let data = await weatherUrl.json()
  // console.log(data)
  // useApidata(data);

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`)
    .then(response => {
      return response.json()
    })
    .then(data => {
      console.log(data)
      response = data
      useApidata(response)
    })
  function useApidata(response) {
    let tempId = $('#temperature');
    let humidId = $('#humidity');
    let windSpeedId = $('#wind-speed')
    // let UVindexId = $('#UV-index')
    currentDayEl.html('')
    for (let i = 0; i < response.length; i++) {
      (response.main.temp).appendTo.$('#temperature');
      console.log()
      humidId.text(response.main.humidity);
      windSpeedId.text(response.main.windSpeedId.speed);
      currentDayEl.append(
        tempId,
        humidId,
        windSpeedId
      )
    }
  }
}



// // Fetch 5 day forecast for city input / array of 4 hour per 5 days
// function getFiveDay() {
//   let API_KEY = "62e2ac81b06789e9f89de31b469e8976";
//   // let fiveDayUrl = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${alerts}&appid=${API_KEY}`)
//   // console.log(fiveDayUrl)
//   // let dataFive = await fiveDayUrl.json()
//   // console.log(dataFive)

//   fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${alerts}&appid=${API_KEY}&q=${fiveDay}`)
//     .then(response => {
//       return response.json()
//     })
//     .then(data => {
//       console.log(data)
//       response = data
//       generateFiveDayEl(response)
//     })
// }

function generateFiveDayEl () {
  
  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${alerts}&appid=${API_KEY}&q=${fiveDay}`)
    .then(response => {
      return response.json()
    })
    .then(data => {
      console.log(data)
      response = data
      generateFiveDayEl(response)
    })

    console.log(response)
    console.log(response.dt)
    $('#forecast').empty();

    // variable to hold response.list
    let results = response.list;
    console.log(results)
    
    //declare start date to check against
    // startDate = 20
    //have end date, endDate = startDate + 5

    for (let i = 0; i < results.length; i++) {

      let day = Number(results[i].dt_txt.split('-')[2].split(' ')[0]);
      let hour = results[i].dt_txt.split('-')[2].split(' ')[1];
      console.log(day);
      console.log(hour);

      if(results[i].dt_txt.indexOf("12:00:00") !== -1){
        
        // get the temperature and convert to fahrenheit 
        let temp = (results[i].main.temp - 273.15) * 1.80 + 32;
        let tempF = Math.floor(temp);

        const card = $("<div>").addClass("card col-md-2 ml-4 bg-primary text-white");
        const cardBody = $("<div>").addClass("card-body p-3 forecastBody")
        const cityDate = $("<h4>").addClass("card-title").text(date.toLocaleDateString('en-US'));
        const temperature = $("<p>").addClass("card-text forecastTemp").text("Temperature: " + tempF + " °F");
        const humidity = $("<p>").addClass("card-text forecastHumidity").text("Humidity: " + results[i].main.humidity + "%");

        const image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + results[i].weather[0].icon + ".png")

        cardBody.append(cityDate, image, temperature, humidity);
        card.append(cardBody);
        $("#forecast").append(card);

      }
    }
  };


//Generate the last 5 cities searched
function generateHistory() {
  $('ul').html("");
  for (i = 0; i < searchHistory.length; i++) {
    var historyEl = $("<li>");
    historyEl.addClass("list-group-item").text(searchHistory[i]);
    $('ul').append(historyEl)
  }

}

formClassEl.on('submit', function (event) {
  event.preventDefault()
  searchCity()
});