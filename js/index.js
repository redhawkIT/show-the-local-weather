$(function() {

    // clock
    let clock = setInterval(setTime, 1000);
    let $time = $('#time');

    function setTime() {
        $time.html(moment().format('h:mm:ss a'));
    }

    function getLocation() {
        return new Promise(function(resolve, reject) {
            let url = 'http://ipinfo.io';
            $.getJSON(url, function(data) {
                resolve(data);
            })
            .fail(() => reject('Error: ipinfo.io'));
        });
    }

    function getWeather(zipCode, country) {
        const API_KEY = '9dc16e2ed288138758b1e8eae271567c';
        return new Promise(function(resolve, reject) {
            let url = `http://api.openweathermap.org/data/2.5/weather?zip=${zipCode},${country}&appid=${API_KEY}`;
            $.getJSON(url, function(data) {
                    resolve(data);
            }).fail(function(){
                return reject('Error: .openweathermap');
            });
        });
    }

    // Promises
    // call getWeather on data that getLocation returns
    // ip => getWeather(ip.postal, ip.country)
    const location = getLocation().then(function(ip) {
        console.log(ip);
        return getWeather(ip.postal, ip.country);
    });

    location.catch(error => console.log(error));

    const weather = location.then(function(json) {
        console.log(json);

        let temp = (json.main.temp - 273);
        $('#temperature').html(Math.round(temp));

        $('#fahrenheit').click(function() {
            $(this).css("color", "white");
            $('#celsius').css("color", "#b0bec5");
            $('#temperature').html(Math.round(temp * 1.8 + 32));
        });

        $('#celsius').click(function() {
            $(this).css("color", "white");
            $('#fahrenheit').css("color", "#b0bec5");
            $('#temperature').html(Math.round(temp));
        });

        $('#city').html(json.name);
        $('#weather-status').html(json.weather[0].main + " / " + json.weather[0].description);
        $('#day').html(moment().format('dddd'));
        $('#date').html(moment().format("MMM Do YYYY"));
        $('.windspeed').html(json.wind.speed + " Km/h");
        $('.humidity').html(json.main.humidity + " %");
        $('.pressure').html(json.main.pressure + " hPa");

        $('.sunrise-time').html(moment(json.sys.sunrise * 1000).format('h:mm:ss a'));
        $('.sunset-time').html(moment(json.sys.sunset * 1000).format('h:mm:ss a'));

        // http://openweathermap.org/weather-conditions
        let condtion = json.weather[0].main;
        if (condtion == "Clouds")
            $('.weather-icon').attr("src", "http://oi68.tinypic.com/296nolt.png");
        if (condtion == "Clear")
            $('.weather-icon').attr("src", "http://oi64.tinypic.com/s3orav.png");
        if (condtion == "Thunderstorm")
            $('.weather-icon').attr("src", "http://oi64.tinypic.com/2dlrp02.png");
        if (condtion == "Drizzle")
            $('.weather-icon').attr("src", "http://oi67.tinypic.com/izbyuu.png");
        if (condtion == "Rain")
            $('.weather-icon').attr("src", "http://oi64.tinypic.com/24cv581.png");
        if (condtion == "Snow")
            $('.weather-icon').attr("src", "http://oi65.tinypic.com/2nqtif4.png");
        if (condtion == "Extreme")
            $('.weather-icon').attr("src", "http://oi64.tinypic.com/2ngfnk5.jpg");
    });

    weather.catch(error => console.log(error));
});