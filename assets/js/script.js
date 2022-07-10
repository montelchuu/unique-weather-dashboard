// API Key
var APIKey = "c004625bb1231b99945c0d817472e343";
// other stuff
var searchHistoryList = [];

function getWeather(city) {
    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}&units=imperial`;
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function(cityWeatherResponse) {
        for (i = 0; i < 5; i++) {
            var date = new Date(
                cityWeatherResponse.list[(i + 1) * 8 - 1].dt * 1000
            ).toLocaleDateString();
            var temp = cityWeatherResponse.list[(i + 1) * 8 - 5].main.temp_max; 
            var humidity = cityWeatherResponse.list[(i + 1) * 8 - 1].main.humidity;
            var iconcode = cityWeatherResponse.list[(i + 1) * 8 - 1].weather[0].icon;
            var iconurl = `http://openweathermap.org/img/wn/${iconcode}.png`;
            var windSpeed = cityWeatherResponse.list[(i + 1) * 8 - 1].wind.speed;

            $("#futureDate" + i).html(date);
            $("#futureIcon" + i).html("<img src=" + iconurl + ">");
            $("#futureTemp" + i).html("Temp: " + temp + "&#8457");
            $("#futureHumidity" + i).html("Humidity: " + humidity + "%");
            $("#futureWindSpeed" + i).html("Wind Speed: " + windSpeed + "MPH");
        }
        $(cityName).html(cityWeatherResponse.city.name + " (" + date + ")" + "<img src=" + iconurl + ">");
        var temp = cityWeatherResponse.list[0].main.temp;
        $("#temperature").html("Temperature: " + temp.toFixed(2) + "&#8457");
        $("#humidity").html("Humidity: " + cityWeatherResponse.list[0].main.humidity + "%");
        var windSpeed = cityWeatherResponse.list[0].wind.speed;
        var windSpeedMPH = (windSpeed * 2.237).toFixed(1);
        $("#windSpeed").html("Wind Speed: " + windSpeedMPH + "MPH");

        var lat = cityWeatherResponse.city.coord.lat;
        var lon = cityWeatherResponse.city.coord.lon;
        var uVIQueryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIKey}&units=imperial`;

        $.ajax({
            url: uVIQueryURL,
            method: "GET"
        }).then(function(uVResponse) {
            console.log(uVResponse);
            var UVIndex = document.createElement("span");
                        
                    if (uVResponse.current.uvi < 4 ) {
                        UVIndex.setAttribute("class", "badge badge-success");
                    }
                    else if (uVResponse.current.uvi < 8) {
                        UVIndex.setAttribute("class", "badge badge-warning");
                    }
                    else {
                        UVIndex.setAttribute("class", "badge badge-danger");
                    }
                    console.log(uVResponse.current.uvi)
                    UVIndex.innerHTML = uVResponse.current.uvi;
                    $("#uVIndex").html("");
                    $("#uVIndex").append(UVIndex);
        }            
    );
})};


function clearHistory(event) {
    event.preventDefault();
    searchedCity = [];
    localStorage.removeItem("city");
    window.location.reload();
}

function startWeather(event) {
    event.preventDefault();
    var city = $("#enterCity").val().trim();
    getWeather(city);
    if (!searchHistoryList.includes(city)) {
        searchHistoryList.push(city);
        var searchedCity = $(`
            <li class="list-group-item">${city}</li>
            `);
        $("#searchHistory").append(searchedCity);
    };
    
    localStorage.setItem("city", JSON.stringify(searchHistoryList));
    console.log(searchHistoryList);
};

$(document).on("click", ".list-group-item", function() {
    var listedCity = $(this).text();
    getWeather(listedCity);
});

// On Click Handlers
$("#searchButton").on("click", startWeather);
$("#clearHistory").on("click", clearHistory);