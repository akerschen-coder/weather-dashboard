//empty array for cities to be put into 
var cities = [];
var form = document.querySelector("#form");
var userChoiceCity = document.querySelector("#userChoiceCity");
var pastCities = document.querySelector("#pastCities");
var currentWeather = document.querySelector("#currentWeather");
var displaySearch = document.querySelector("#displaySearch");
var forecastHeader = document.querySelector("#forecastHeader");
var forecastFiveDay = document.querySelector("#fiveday");

// page activator 
var activatePage = function (event) {
    event.preventDefault();
    var city = userChoiceCity.value.trim();
    if (city) {
        getCityWeather(city);
        get5Day(city);
        cities.unshift({ city });
        userChoiceCity.value = "";
    } else {
      return;
    }
    saveSearch();
    pastSearch(city);
}



var getCityWeather = function (city) {
    var apiKey = 'adb0e583b91898b68082d8370c43563e';
    var requestUrl1 = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(requestUrl1)
        .then(response => response.json()) 
            .then(data =>  {
                displayWeather(data, city);
            });
        };

var displayWeather = function (weather, searchCity) {
    //clear old content
    currentWeather.textContent = "";
    displaySearch.textContent = searchCity;

    //current date
    var currentDate = document.createElement("p")
    currentDate.textContent = " (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
    displaySearch.appendChild(currentDate);

    //image
    var weatherIcon = document.createElement("img")
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    displaySearch.appendChild(weatherIcon);

    //temperature 
    var temperatureEl = document.createElement("p");
    temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
    temperatureEl.classList = "list-group-item"
    currentWeather.appendChild(temperatureEl);

    //Humidity
    var humidity = document.createElement("p");
    humidity.textContent = "Humidity: " + weather.main.humidity + " %";
    humidity.classList = "list-group-item"
    currentWeather.appendChild(humidity);

    //Wind 
    var windSpeed = document.createElement("p");
    windSpeed.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    windSpeed.classList = "list-group-item"
    currentWeather.appendChild(windSpeed);

    
//for next function
    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    getUvIndex(lat, lon)
}

var getUvIndex = function (lat, lon) {
    var apiKey = 'adb0e583b91898b68082d8370c43563e';
    var requestUrl2 = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(requestUrl2)
        .then(response => response.json()) 
            .then(data => {
                displayUvIndex(data)
            });
        };


var displayUvIndex = function (index) {
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: "
    uvIndexEl.classList = "list-group-item"
    uvIndexValue = document.createElement("p")
    uvIndexValue.textContent = index.value
    uvIndexEl.appendChild(uvIndexValue)
    currentWeather.appendChild(uvIndexEl);
    
}

var get5Day = function (city) {
    var apiKey = 'adb0e583b91898b68082d8370c43563e';
    var requestUrl3 = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(requestUrl3)
        .then(response => response.json() )
            .then(data => {
                display5Day(data);
            });
};

var display5Day = function (weather) {
    forecastFiveDay.textContent = ""
    forecastHeader.textContent = "5-Day Forecast:";

    var forecast = weather.list;
    for (var i = 5; i < forecast.length; i = i + 8) {
        var dailyForecast = forecast[i];
        //div for date, image, temp, humidity 
        var fiveDay = document.createElement("div");
        fiveDay.classList = "card bg-primary text-light m-2";

        //date 
        var forecastDate = document.createElement("h5")
        forecastDate.textContent = moment.unix(dailyForecast.dt).format("MMM D, YYYY");
        forecastDate.classList = "card-header text-center"
        fiveDay.appendChild(forecastDate);

        //temperature 5
        var fiveDayTemp = document.createElement("p");
        fiveDayTemp.classList = "card-body text-center";
        fiveDayTemp.textContent = "Temperature: " + dailyForecast.main.temp + " °F";
        fiveDay.appendChild(fiveDayTemp);

        //humidity 5
        var fiveDayHum = document.createElement("p");
        fiveDayHum.classList = "card-body text-center";
        fiveDayHum.textContent = "Humidity: " + dailyForecast.main.humidity + "  %";
        fiveDay.appendChild(fiveDayHum);
        
        //wind 5 
        var fiveDayWind = document.createElement("p");
        fiveDayWind.classList = "card-body text-center";
        fiveDayWind.textContent = "Wind: " + dailyForecast.main.wind + " mph"
        fiveDay.appendChild(fiveDayWind);

        //icon 5
        var weatherIcon = document.createElement("img")
        weatherIcon.classList = "card-body text-center";
        weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);
        fiveDay.appendChild(weatherIcon);
     
        //push to dom 
        forecastFiveDay.appendChild(fiveDay);
    }

}

var pastSearch = function (pastSearch) {

    // console.log(pastSearch)

    pastCitySearch = document.createElement("button");
    pastCitySearch.textContent = pastSearch;
    pastCitySearch.classList = "d-flex w-100 btn-light border p-2";
    pastCitySearch.setAttribute("data-city", pastSearch)
    pastCitySearch.setAttribute("type", "submit");

    pastCities.appendChild(pastCitySearch);
}

var saveSearch = function () {
    localStorage.setItem("cities", JSON.stringify(cities));
};
var pastCitiesDisplay = function (event) {
    var city = event.target.getAttribute("data-city")
    if (city) {
        getCityWeather(city);
        get5Day(city);
    }
}

form.addEventListener("click", activatePage);
pastCities.addEventListener("click", pastCitiesDisplay);