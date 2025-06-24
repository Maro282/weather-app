const listItems = document.querySelectorAll(".navbar-nav .nav-item .nav-link"); // node list
const list = document.querySelector(".navbar-nav");
const cityName = document.querySelector(".city-name");
const searchBtn = document.querySelector(".search-btn");
const day = document.querySelectorAll(".day");
const datee = document.querySelectorAll(".date");
const icon = document.querySelectorAll(".icon");
const condition = document.querySelectorAll(".condition");
const temp = document.querySelectorAll(".temp");
const area = document.querySelectorAll(".area");
const humidity = document.querySelectorAll(".humidity");
const wind = document.querySelectorAll(".wind");
const clouds = document.querySelectorAll(".clouds");
const findLocation = document.querySelector(".find-location");
const errorMsg = document.querySelector(".error");
const apiKey = "a3518b79338e4de1bb5205102252106";
const apiKeyOpenCage = "bf729cb366e445e39a37e5d818e81771";
var weather;
var city;
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const byDefaultCity = "Alexandria";
getWeather(byDefaultCity);

// Done with delegation concept -- when click on nav-item change active
list.addEventListener("click", function (eventInfo) {
  eventInfo.target.classList.add("active");
  for (let j = 0; j < listItems.length; j++) {
    if (!(listItems[j].textContent == eventInfo.target.textContent)) {
      listItems[j].classList.remove("active");
    }
  }
});

// getting information of weather throw 3 Days

searchBtn.addEventListener("click", function (e) {
  getWeather(cityName.value);
});

cityName.addEventListener("keydown", function (e) {
  if (e.key == "Enter") {
    getWeather(cityName.value);
  }
});

document.addEventListener("click", function (e) {
  errorMsg.style.left = "-100%";
});

async function getWeather(value) {
  var data = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${value}&days=3`
  );
  if (data.status == 404 || data.status == 400) {
    errorMsg.style.left = "50%";
  } else {
    data = await data.json();
    city = data.location.name; // city name
    weather = [
      {
        date: new Date(),
        temp: `${data.current.temp_c}<sup><span>o</span></sup>`,
        status: data.current.condition.text,
        humidity: data.current.humidity + "%",
        windSpeed: data.current.wind_kph + " KPH",
        clouds: data.current.cloud + "%",
        icon: data.current.condition.icon,
      },

      {
        date: new Date(data.forecast.forecastday[1].date),
        temp: `${data.forecast.forecastday[1].day.mintemp_c}<sup><span>o</span></sup> - ${data.forecast.forecastday[1].day.maxtemp_c}<sup><span>o</span></sup>`,
        status: data.forecast.forecastday[1].day.condition.text,
        humidity: `${data.forecast.forecastday[1].hour[11].humidity}%`,
        windSpeed: data.forecast.forecastday[1].hour[11].wind_kph + " KPH",
        clouds: data.forecast.forecastday[1].hour[11].cloud + "%",
        icon: data.forecast.forecastday[1].day.condition.icon,
      },

      {
        date: new Date(data.forecast.forecastday[2].date),
        temp: `${data.forecast.forecastday[2].day.mintemp_c}<sup><span>o</span></sup> - ${data.forecast.forecastday[2].day.maxtemp_c}<sup><span>o</span></sup>`,
        status: data.forecast.forecastday[2].day.condition.text,
        humidity: `${data.forecast.forecastday[2].hour[11].humidity}%`,
        windSpeed: data.forecast.forecastday[2].hour[11].wind_kph + " KPH",
        clouds: data.forecast.forecastday[2].hour[11].cloud + "%",
        icon: data.forecast.forecastday[2].day.condition.icon,
      },
    ];
    display();
  }
}

function display() {
  for (let i = 0; i < weather.length; i++) {
    day[i].textContent = `${days[weather[i].date.getDay()]}`;
    datee[i].textContent = `${weather[i].date.toLocaleDateString()}`;
    icon[i].setAttribute("src", `${weather[i].icon}`);
    condition[i].textContent = `${weather[i].status}`;
    temp[i].innerHTML = `${weather[i].temp}`;
    area[i].textContent = city;
    humidity[i].textContent = `${weather[i].humidity}`;
    wind[i].textContent = `${weather[i].windSpeed}`;
    clouds[i].textContent = `${weather[i].clouds}`;
  }
}

//Geolocation

findLocation.addEventListener("click", function () {
  navigator.geolocation.getCurrentPosition(function (position) {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    fetch(
      `https://api.opencagedata.com/geocode/v1/json?key=${apiKeyOpenCage}&q=${lat}+${long}`
    )
      .then((response) => response.json())
      .then((data) => {
        getWeather(data.results[0].components.city);
        cityName.value = data.results[0].components.city;
      })
      .catch(function () {
        console.log("Canot find location"); // for tracing only
      });
  });
});
