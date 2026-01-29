const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");
const weatherInfoSection = document.querySelector(".weather-info")
const notFoundSelection = document.querySelector(".not-found")
const searchCitySection = document.querySelector(".search-city")
const countryTxt = document.querySelector(".country-txt")
const tempTxt = document.querySelector(".temp-txt")
const conditionTxt = document.querySelector(".condition-txt")
const humidityvaluetxt = document.querySelector(".Humidity-value-txt")
const windvaluetxt = document.querySelector(".wind-value-txt")
const weatherSummaryImg = document.querySelector(".weather-summary-img")
const currentDateTxt = document.querySelector(".current-date-txt")
const forecastItemsContainer = document.querySelector(".forecast-items-container")


const apiKey = "1310332d62cbecbeb10acce7c398c317"

searchBtn.addEventListener("click", () => {
    if (cityInput.value.trim() != "") {
        updateWeatherInfo(cityInput.value)
        cityInput.value = ""
        cityInput.blur()
    }
})
cityInput.addEventListener("keydown", (event) => {
    if (event.key == "Enter" &&
        cityInput.value.trim() != ""
    ) {
        updateWeatherInfo(cityInput.value)
        cityInput.value = ""
        cityInput.blur()
    }

})
async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl)
    return response.json()
}

function getWeatherIcon(id) {
    if (id <= 232) return 'thunderstorm.svg'
    if (id <= 321) return 'drizzle.svg'
    if (id <= 531) return 'rain.svg'
    if (id <= 622) return 'snow.svg'
    if (id <= 781) return 'atmosphere.svg'
    if (id <= 800) return 'clear.svg'
    else return "clouds.svg"
}

function getCurrentDate() {
    const currentDate = new Date()
    const options = {
        weekday: "short",
        day: "2-digit",
        month: "short"
    }
    return currentDate.toLocaleDateString("en-GB", options
    )
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData(`weather`, city)
    if (weatherData.cod != 200) {
        showDisplaySection(notFoundSelection)
        return
    }
    console.log(weatherData)
    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed }
    } = weatherData
    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + "°C"
    conditionTxt.textContent = main
    humidityvaluetxt.textContent = humidity + "%"
    windvaluetxt.textContent = speed + "M/s"
    currentDateTxt.textContent = getCurrentDate()
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`
    await updateForecastsInfo(city)
    showDisplaySection(weatherInfoSection)

}
async function updateForecastsInfo(city) {
    const forecastsData = await getFetchData("forecast", city)
    const timesTaken = "12:00:00"
    const todayDate = new Date().toISOString().split("T")[0]
    forecastItemsContainer.innerHTML = ""
    forecastsData.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(timesTaken) &&
            !forecastWeather.dt_txt.includes(todayDate)) {
            updateForecastsItems(forecastWeather)
        }
    })
}
function updateForecastsItems(weatherData) {
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp }
    } = weatherData
    const dateTaken = new Date(date)
    const dateOptions ={
        day:"2-digit",
        month:"short"
    }
    const forecastItem = `
    <div class="forecast-item">
                    <h5 class="forecast-item-date regular-txt">05 Aug</h5>
                    <img src="./assets/weather/${getWeatherIcon(id)}" alt="" class="forecast-item-img">
                    <h5 class="forecast-iten-temp">${Math.round(temp)} °C</h5>
                </div>
    `
    forecastItemsContainer.insertAdjacentHTML("beforeend", forecastItem)
}
function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSelection]
        .forEach(section => section.style.display = "none")
    section.style.display = "flex"
}