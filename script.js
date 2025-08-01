// --- DOM ELEMENTS ---
const introPage = document.getElementById('intro-page');
const mainPage = document.getElementById('main-page');
const conditionsBtn = document.getElementById('conditions-btn');
const splineContainer = document.getElementById('spline-container');

// --- FUNCTION TO REMOVE SPLINE LOGO ---
function removeSplineLogo() {
    const splineViewer = document.querySelector('spline-viewer');
    if (splineViewer) {
        const checkShadowDom = setInterval(() => {
            if (splineViewer.shadowRoot) {
                const logo = splineViewer.shadowRoot.querySelector('#logo');
                if (logo) {
                    logo.style.display = 'none';
                    clearInterval(checkShadowDom); // Stop checking once the logo is removed
                }
            }
        }, 100); // Check every 100ms
    }
}

// Call the function on page load
window.onload = removeSplineLogo;


// --- PAGE TRANSITION & RESPONSIVE LOGIC ---
conditionsBtn.addEventListener('click', () => {
    conditionsBtn.classList.add('clicked');
    
    // Fade out the intro page content
    introPage.style.transition = 'opacity 0.5s ease-out';
    introPage.style.opacity = '0';

    setTimeout(() => {
        introPage.style.display = 'none';
        
        // Prepare main page for display
        mainPage.style.display = 'flex'; // Mobile-first default
        if (window.innerWidth >= 1024) { // lg breakpoint for desktop
            mainPage.style.display = 'grid';
        }

        // Blur the Spline background
        splineContainer.style.filter = 'blur(10px) brightness(0.7)';
        
        getInitialWeather();
    }, 500); // Match this duration with the CSS animation
});

window.addEventListener('resize', () => {
    if (mainPage.style.display !== 'none') {
        mainPage.style.display = window.innerWidth < 1024 ? 'flex' : 'grid';
    }
});


// --- WEATHER API & UI LOGIC ---
const WMO_CODES = {
    0: { desc: "Clear Sky", icon: "☀️" }, 1: { desc: "Mainly Clear", icon: "🌤️" }, 2: { desc: "Partly Cloudy", icon: "⛅️" }, 3: { desc: "Overcast", icon: "☁️" },
    45: { desc: "Fog", icon: "🌫️" }, 48: { desc: "Rime Fog", icon: "🌫️" },
    51: { desc: "Light Drizzle", icon: "🌦️" }, 53: { desc: "Moderate Drizzle", icon: "🌦️" }, 55: { desc: "Dense Drizzle", icon: "🌦️" },
    61: { desc: "Slight Rain", icon: "🌧️" }, 63: { desc: "Moderate Rain", icon: "🌧️" }, 65: { desc: "Heavy Rain", icon: "🌧️" },
    71: { desc: "Slight Snow", icon: "🌨️" }, 73: { desc: "Moderate Snow", icon: "🌨️" }, 75: { desc: "Heavy Snow", icon: "🌨️" },
    80: { desc: "Slight Showers", icon: "🌧️" }, 81: { desc: "Moderate Showers", icon: "🌧️" }, 82: { desc: "Violent Showers", icon: "🌧️" },
    95: { desc: "Thunderstorm", icon: "⛈️" },
};

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const errorModal = document.getElementById('error-modal');
const closeModal = document.getElementById('close-modal');

async function getWeatherData(latitude, longitude, cityName) {
    const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,visibility,precipitation&hourly=temperature_2m,weather_code,precipitation_probability&daily=uv_index_max,precipitation_probability_max&timezone=auto`;
    const airQualityApiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=pm2_5`;

    try {
        const [weatherResponse, airQualityResponse] = await Promise.all([
            fetch(weatherApiUrl),
            fetch(airQualityApiUrl)
        ]);
        if (!weatherResponse.ok) throw new Error('Weather data not available.');
        if (!airQualityResponse.ok) throw new Error('Air quality data not available.');
        const weatherData = await weatherResponse.json();
        const airQualityData = await airQualityResponse.json();
        
        updateUI(weatherData, airQualityData, cityName);

    } catch (error) {
        console.error("Error fetching data:", error);
        showError("Could not fetch weather data. Please try again.");
    }
}

function updateUI(weatherData, airQualityData, cityName) {
    const { current, daily, hourly } = weatherData;
    const weatherInfo = WMO_CODES[current.weather_code] || { desc: "Unknown", icon: "🤷" };

    document.getElementById('city-name').textContent = cityName;
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    document.getElementById('temperature').innerHTML = `${Math.round(current.temperature_2m)}&deg;`;
    document.getElementById('weather-description').textContent = weatherInfo.desc;
    document.getElementById('weather-icon-main').innerHTML = `<div class="text-8xl sm:text-9xl">${weatherInfo.icon}</div>`;
    document.getElementById('humidity').innerHTML = `${current.relative_humidity_2m} %`;
    document.getElementById('wind-speed').innerHTML = `${current.wind_speed_10m.toFixed(1)} km/h`;
    document.getElementById('visibility').innerHTML = `${(current.visibility / 1000).toFixed(1)} km`;
    document.getElementById('apparent-temp').innerHTML = `${Math.round(current.apparent_temperature)}&deg;`;
    document.getElementById('precipitation').innerHTML = `${current.precipitation.toFixed(1)} mm`;
    document.getElementById('air-quality').textContent = airQualityData.current.pm2_5.toFixed(1);

    const weatherEmojiEl = document.getElementById('weather-emoji');
    if (current.weather_code >= 51) { weatherEmojiEl.textContent = '😞'; } 
    else if (current.weather_code <= 1) { weatherEmojiEl.textContent = '😄'; } 
    else { weatherEmojiEl.textContent = '😐'; }

    const forecastContainer = document.getElementById('hourly-forecast-container');
    forecastContainer.innerHTML = '';
    const now = new Date();
    const currentHour = now.getHours();
    const startIndex = hourly.time.findIndex(time => new Date(time).getHours() === currentHour);

    for (let i = startIndex; i < startIndex + 24 && i < hourly.time.length; i++) {
        const time = new Date(hourly.time[i]);
        const temp = Math.round(hourly.temperature_2m[i]);
        const hourWeather = WMO_CODES[hourly.weather_code[i]] || { icon: "🤷" };
        const hourlyRainProb = hourly.precipitation_probability[i];
        const hourDiv = document.createElement('div');
        hourDiv.className = 'flex-shrink-0 text-center p-3 rounded-xl bg-white/10 w-28 glass-panel';
        hourDiv.innerHTML = `
            <p class="font-medium">${String(time.getHours()).padStart(2, '0')}:00</p>
            <p class="text-3xl my-1">${hourWeather.icon}</p>
            <p class="font-bold text-lg">${temp}&deg;</p>
            <p class="text-xs text-cyan-300 mt-1">💧 ${hourlyRainProb}%</p>
        `;
        forecastContainer.appendChild(hourDiv);
    }

    document.getElementById('main-panel').classList.remove('opacity-0');
    document.getElementById('details-panel').classList.remove('opacity-0');
}

async function searchCity(city) {
    if (!city) return;
    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    try {
        const response = await fetch(geocodeUrl);
        const data = await response.json();
        if (!data.results || data.results.length === 0) { throw new Error('City not found'); }
        const { latitude, longitude, name, admin1, country } = data.results[0];
        const displayName = admin1 ? `${name}, ${admin1}` : `${name}, ${country}`;
        getWeatherData(latitude, longitude, displayName);
    } catch (error) {
        console.error("Error geocoding:", error);
        showError(`Could not find "${city}". Please check the spelling.`);
    }
}

function showError(message) {
    document.getElementById('error-message').textContent = message;
    errorModal.classList.remove('hidden');
}

searchButton.addEventListener('click', () => searchCity(searchInput.value));
searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') searchCity(searchInput.value); });
closeModal.addEventListener('click', () => errorModal.classList.add('hidden'));

function getInitialWeather() {
    const defaultLat = 20.7478; // Wardha, Maharashtra
    const defaultLon = 78.6022;
    const defaultDisplayName = "Wardha, Maharashtra";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            getWeatherData(latitude, longitude, "Your Location");
        }, (error) => {
            console.warn("Geolocation denied. Defaulting to Wardha.");
            getWeatherData(defaultLat, defaultLon, defaultDisplayName);
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
        getWeatherData(defaultLat, defaultLon, defaultDisplayName);
    }
}