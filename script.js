import * as THREE from 'three';

// --- 3D SCENE SETUP ---
let scene, camera, renderer;
let earth, clouds, sun, rain, snow;
const bgContainer = document.getElementById('bg-container');

function initThree() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 2.5;
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    bgContainer.appendChild(renderer.domElement);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    sun = new THREE.DirectionalLight(0xffffff, 2.5);
    sun.position.set(5, 3, 5);
    scene.add(sun);
    const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({
        map: new THREE.TextureLoader().load('https://placehold.co/2048x1024/000033/FFFFFF?text=Earth+Texture'),
        metalness: 0.3,
        roughness: 0.7,
    });
    earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);
    const cloudGeometry = new THREE.SphereGeometry(1.02, 64, 64);
    const cloudMaterial = new THREE.MeshStandardMaterial({
        map: new THREE.TextureLoader().load('https://placehold.co/2048x1024/FFFFFF/000000?text=Cloud+Texture&css=%7B%22opacity%22%3A%220.5%22%7D'),
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
    });
    clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    scene.add(clouds);
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.005 });
    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        if (x*x + y*y + z*z > 100*100) starVertices.push(x, y, z);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    earth.rotation.y += 0.0005;
    clouds.rotation.y += 0.0007;
    if(rain) rain.rotation.y += 0.001;
    if(snow) snow.rotation.y += 0.001;
    renderer.render(scene, camera);
}

function update3DScene(weatherCode) {
    if (rain) scene.remove(rain);
    if (snow) scene.remove(snow);
    rain = null;
    snow = null;
    if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) {
        const rainGeometry = new THREE.BufferGeometry();
        const rainVertices = [];
        for (let i = 0; i < 5000; i++) {
            rainVertices.push(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5);
        }
        rainGeometry.setAttribute('position', new THREE.Float32BufferAttribute(rainVertices, 3));
        const rainMaterial = new THREE.PointsMaterial({ color: 0xaaaaee, size: 0.02, transparent: true, opacity: 0.7 });
        rain = new THREE.Points(rainGeometry, rainMaterial);
        scene.add(rain);
    } else if ((weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86)) {
        const snowGeometry = new THREE.BufferGeometry();
        const snowVertices = [];
        for (let i = 0; i < 5000; i++) {
            snowVertices.push(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5);
        }
        snowGeometry.setAttribute('position', new THREE.Float32BufferAttribute(snowVertices, 3));
        const snowMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.02, transparent: true, opacity: 0.8 });
        snow = new THREE.Points(snowGeometry, snowMaterial);
        scene.add(snow);
    }
    if (weatherCode <= 1) {
        sun.intensity = 2.5;
        clouds.material.opacity = 0.2;
    } else if (weatherCode <= 3) {
        sun.intensity = 1.0;
        clouds.material.opacity = 0.6;
    } else {
        sun.intensity = 0.5;
        clouds.material.opacity = 0.8;
    }
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

initThree();

// --- WEATHER API & UI LOGIC ---
const WMO_CODES = {
    0: { desc: "Clear sky", icon: "☀️" }, 1: { desc: "Mainly clear", icon: "🌤️" }, 2: { desc: "Partly cloudy", icon: "⛅️" }, 3: { desc: "Overcast", icon: "☁️" },
    45: { desc: "Fog", icon: "🌫️" }, 48: { desc: "Depositing rime fog", icon: "🌫️" },
    51: { desc: "Light drizzle", icon: "🌦️" }, 53: { desc: "Moderate drizzle", icon: "🌦️" }, 55: { desc: "Dense drizzle", icon: "🌦️" },
    56: { desc: "Light freezing drizzle", icon: "🌨️" }, 57: { desc: "Dense freezing drizzle", icon: "🌨️" },
    61: { desc: "Slight rain", icon: "🌧️" }, 63: { desc: "Moderate rain", icon: "🌧️" }, 65: { desc: "Heavy rain", icon: "🌧️" },
    66: { desc: "Light freezing rain", icon: "🌨️" }, 67: { desc: "Heavy freezing rain", icon: "🌨️" },
    71: { desc: "Slight snow fall", icon: "🌨️" }, 73: { desc: "Moderate snow fall", icon: "🌨️" }, 75: { desc: "Heavy snow fall", icon: "🌨️" },
    77: { desc: "Snow grains", icon: "🌨️" },
    80: { desc: "Slight rain showers", icon: "🌧️" }, 81: { desc: "Moderate rain showers", icon: "🌧️" }, 82: { desc: "Violent rain showers", icon: "🌧️" },
    85: { desc: "Slight snow showers", icon: "🌨️" }, 86: { desc: "Heavy snow showers", icon: "🌨️" },
    95: { desc: "Thunderstorm", icon: "⛈️" }, 96: { desc: "Thunderstorm with slight hail", icon: "⛈️" }, 99: { desc: "Thunderstorm with heavy hail", icon: "⛈️" },
};

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const errorModal = document.getElementById('error-modal');
const closeModal = document.getElementById('close-modal');

async function getWeatherData(latitude, longitude, cityName) {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m,visibility&hourly=temperature_2m,weather_code&daily=uv_index_max&timezone=auto`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Weather data not available.');
        const data = await response.json();
        updateUI(data, cityName);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        showError("Could not fetch weather data. Please try again.");
    }
}

function updateUI(data, cityName) {
    const { current, daily, hourly } = data;
    const weatherInfo = WMO_CODES[current.weather_code] || { desc: "Unknown", icon: "🤷" };
    document.getElementById('city-name').textContent = cityName;
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('temperature').innerHTML = `${Math.round(current.temperature_2m)}&deg;`;
    document.getElementById('weather-description').textContent = weatherInfo.desc;
    document.getElementById('weather-icon-main').innerHTML = `<div class="text-8xl sm:text-9xl animate-pulse">${weatherInfo.icon}</div>`;
    document.getElementById('humidity').innerHTML = `${current.relative_humidity_2m} %`;
    document.getElementById('wind-speed').innerHTML = `${current.wind_speed_10m.toFixed(1)} km/h`;
    document.getElementById('pressure').innerHTML = `${Math.round(current.surface_pressure)} hPa`;
    document.getElementById('visibility').innerHTML = `${(current.visibility / 1000).toFixed(1)} km`;
    document.getElementById('uv-index').textContent = daily.uv_index_max[0].toFixed(1);
    document.getElementById('apparent-temp').innerHTML = `${Math.round(current.apparent_temperature)}&deg;`;
    const forecastContainer = document.getElementById('hourly-forecast-container');
    forecastContainer.innerHTML = '';
    const now = new Date();
    const currentHour = now.getHours();
    const startIndex = hourly.time.findIndex(time => new Date(time).getHours() === currentHour);
    for (let i = startIndex; i < startIndex + 24 && i < hourly.time.length; i++) {
        const time = new Date(hourly.time[i]);
        const temp = Math.round(hourly.temperature_2m[i]);
        const hourWeather = WMO_CODES[hourly.weather_code[i]] || { icon: "🤷" };
        const hourDiv = document.createElement('div');
        hourDiv.className = 'flex-shrink-0 text-center p-3 rounded-xl bg-white/10 w-24';
        hourDiv.innerHTML = `<p class="font-medium">${time.getHours()}:00</p><p class="text-3xl my-2">${hourWeather.icon}</p><p class="font-bold text-lg">${temp}&deg;</p>`;
        forecastContainer.appendChild(hourDiv);
    }
    update3DScene(current.weather_code);
    document.getElementById('main-panel').classList.remove('opacity-0');
    document.getElementById('details-panel').classList.remove('opacity-0');
}

async function searchCity(city) {
    if (!city) return;
    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
    try {
        const response = await fetch(geocodeUrl);
        const data = await response.json();
        if (!data.results || data.results.length === 0) {
            throw new Error('City not found');
        }
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
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchCity(searchInput.value);
});
closeModal.addEventListener('click', () => errorModal.classList.add('hidden'));

function getInitialWeather() {
    const defaultLat = 20.7478;
    const defaultLon = 78.6022;
    const defaultDisplayName = "Wardha, Maharashtra";
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=&count=1&language=en&format=json&latitude=${latitude}&longitude=${longitude}`);
                const data = await response.json();
                if (data.results && data.results.length > 0) {
                    const { name, admin1, country } = data.results[0];
                    const displayName = admin1 ? `${name}, ${admin1}` : `${name}, ${country}`;
                    getWeatherData(latitude, longitude, displayName);
                } else {
                     getWeatherData(latitude, longitude, "Your Location");
                }
            } catch {
                getWeatherData(latitude, longitude, "Your Location");
            }
        }, (error) => {
            console.warn("Geolocation denied. Defaulting to Wardha.");
            getWeatherData(defaultLat, defaultLon, defaultDisplayName);
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
        getWeatherData(defaultLat, defaultLon, defaultDisplayName);
    }
}

window.onload = getInitialWeather;