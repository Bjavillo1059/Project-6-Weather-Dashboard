// src of base code // ellsicozoun(19July2021)weather(javascript)[structure/uv index] //


var searchBtn = $('button');
var inputEl = $('.form-control');

var searchHistory = JSON.parse(localStorage.getItem("search"));
if(!searchHistory){
  var searchHistory = [];
}else{
  generateHistory();
}

// Search Function
// execute getWeather function then add it to the search history
function searchCity() {
  var cityName = inputEl.val();
  getWeather(cityName);
  searchHistory.unshift(cityName);
  searchHistory = searchHistory.slice(0,5);
  localStorage.setItem("search",JSON.stringify(searchHistory));
  generateHistory();
}

// Fetch the API
function getWeather(cityName) {
  // key 7e3a149deb7dcf451641dcd1d05f5cd5
  var url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=7e3a149deb7dcf451641dcd1d05f5cd5";
  fetch(url)
    .then(function (response) {
      return response.json();
    })
      .then(function (data) {
        // Return the result on the DOM
        $(".mainResult").html("");
        var name = $("<h2>");
        name.html(data.name + " (" + moment().format("l") + ")").addClass("cityName display-5 mb-4");

        var icon = $("<img>");
        icon.attr("src","https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png").attr("alt",data.weather[0].description).addClass("icon");;
       

        var temp = $("<p>");
        temp.html("Temperature: " + data.main.temp +"°F");

        var wind = $("<p>");
        wind.html("Wind speed: " + data.wind.speed +" MPH");

        var humidity = $("<p>");
        humidity.html("Humidity: " + data.main.humidity +"%");
        // Append all the values on the DOM
        $('.mainResult').append(name, icon, temp, wind, humidity)

        // call UV index function
        getUV(data.coord.lon, data.coord.lat);
        
      })

      // Render an error message if the city isn't found
      .catch((error) => {
        $(".mainResult").html("");
        var error = $("<h2>");
        error.html("City not found");
        $('.mainResult').append(error);
      });


      //Forecast for the next 5 days
      var ForecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=7e3a149deb7dcf451641dcd1d05f5cd5";
      
      fetch(ForecastUrl)
      .then(function (response) {
        return response.json();
      })
        .then(function (data) {
          $(".forecast").html("");
          // Return the result on the DOM
          for(i=0; i<5; i++){
            var card = $("<div>");
            card.addClass("card text-white bg-primary mb-3 p-2");
            $('.forecast').append(card);

            var name = $("<h5>");
            var date = moment().add(i+1, 'days').format('l'); 
            name.html(date).addClass("card-title");
    
            var icon = $("<img>");
            icon.attr("src","https://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png").attr("alt",data.list[i].weather[0].description).addClass("iconSmall");;
          
    
            var temp = $("<p>");
            temp.html("Temp.: " + data.list[i].main.temp +"°F");
    
            var humidity = $("<p>");
            humidity.html("Humidity: " + data.list[i].main.humidity +"%");
    
            card.append(card, name, icon, temp, humidity)
        }
        });
}

// Get UV index function
function getUV(lon, lat){
  var UVurl = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat +"&lon="+ lon +"&appid=7e3a149deb7dcf451641dcd1d05f5cd5";
  fetch(UVurl)
    .then(function (response) {
      return response.json();
    })
      .then(function (data) {
        // Return the result on the DOM   
        var UVEl = $("<p>");
        UVEl.html("UV index: ");

         var UV = $("<button>");
        UV.attr("type", "button").addClass("btn btn-lg").html(data.current.uvi);

        //Attribute the background color depending on the UV index
        if(data.current.uvi >= 0 && data.current.uvi <3){
          UV.addClass("bg-success");
        }else if(data.current.uvi <= 6){
          UV.addClass("bg-warning");
        }else if(data.current.uvi <= 6){
          UV.addClass("bg-orange");
        }else if(data.current.uvi <= 8){
          UV.addClass("bg-danger");
        }else {
          UV.addClass("bg-violet");
        }

        // Append the value on the DOM
        $('.mainResult').append(UVEl);
        UVEl.append(UV);
      });
}

//Generate the last 5 cities searched
function generateHistory(){
  $('ul').html("");
  for(i=0; i<searchHistory.length; i++){
    var historyEl = $("<li>");
    historyEl.addClass("list-group-item").text(searchHistory[i]);
    $('ul').append(historyEl)
  }
  
}
searchBtn.on('click', searchCity);