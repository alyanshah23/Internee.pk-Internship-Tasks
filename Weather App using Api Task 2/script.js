const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");
const weatherInfoSection = document.querySelector(".weather-info")
const notFoundSelection = document.querySelector(".not-found")
const searchCitySection = document.querySelector(".search-city")
const countryTxt = document.querySelector(".country-txt")
const tempTxt = document.querySelector(".temp-txt")
const conditionTxt = document.querySelector(".condition-txt")




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
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiUrl)
    return response.json()
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
        wind: speed
    } = weatherData
    showDisplaySection(weatherInfoSection)

}
function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSelection]
        .forEach(section => section.style.display = "none")
    section.style.display = "flex"
}