const API_KEY = '7855005149dbf62b347a3f2ffb6074ef';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const countyToCityMap = {
    'Baringo':          'Kabarnet',
    'Bomet':            'Bomet',
    'Bungoma':          'Bungoma',
    'Busia':            'Busia',
    'Elgeyo-Marakwet':  'Iten',
    'Embu':             'Embu',
    'Garissa':          'Garissa',
    'Homa Bay':         'Homa Bay',
    'Isiolo':           'Isiolo',
    'Kajiado':          'Kajiado',
    'Kakamega':         'Kakamega',
    'Kericho':          'Kericho',
    'Kiambu':           'Kiambu',
    'Kilifi':           'Kilifi',
    'Kirinyaga':        'Kerugoya',
    'Kisii':            'Kisii',
    'Kisumu':           'Kisumu',
    'Kitui':            'Kitui',
    'Kwale':            'Kwale',
    'Laikipia':         'Nanyuki',
    'Lamu':             'Lamu',
    'Machakos':         'Machakos',
    'Makueni':          'Wote',
    'Mandera':          'Mandera',
    'Marsabit':         'Marsabit',
    'Meru':             'Meru',
    'Migori':           'Migori',
    'Mombasa':          'Mombasa',
    "Murang'a":         'Murang\'a',
    'Nairobi':          'Nairobi',
    'Nakuru':           'Nakuru',
    'Nandi':            'Kapsabet',
    'Narok':            'Narok',
    'Nyamira':          'Nyamira',
    'Nyandarua':        'Ol Kalou',
    'Nyeri':            'Nyeri',
    'Samburu':          'Maralal',
    'Siaya':            'Siaya',
    'Taita-Taveta':     'Voi',
    'Tana River':       'Hola',
    'Tharaka-Nithi':    'Chuka',
    'Trans-Nzoia':      'Kitale',
    'Turkana':          'Lodwar',
    'Uasin Gishu':      'Eldoret',
    'Vihiga':           'Vihiga',
    'Wajir':            'Wajir',
    'West Pokot':       'Kapenguria',
};

const weatherEmojis = {
    'Clear':        '☀️',
    'Clouds':       '☁️',
    'Rain':         '🌧️',
    'Drizzle':      '🌦️',
    'Thunderstorm': '⛈️',
    'Snow':         '❄️',
    'Mist':         '🌫️',
    'Fog':          '🌫️',
    'Haze':         '🌫️',
    'Dust':         '🌪️',
    'Sand':         '🌪️',
};

function getEmoji(condition) {
    return weatherEmojis[condition] || '🌤️';
}

function formatTime(timestamp) {
    return new Date(timestamp * 1000).toLocaleTimeString('en-KE', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

function formatDate() {
    return new Date().toLocaleDateString('en-KE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

async function getWeather(city) {
    try {
        showLoading();
        const res = await fetch(
            `${BASE_URL}/weather?q=${city},KE&appid=${API_KEY}&units=metric`
        );
        if (!res.ok) {
            const res2 = await fetch(
                `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
            );
            if (!res2.ok) {
                showError('City not found. Please try again.');
                return;
            }
            const data = await res2.json();
            updateMainWeather(data);
            getForecast(city);
            return;
        }
        const data = await res.json();
        updateMainWeather(data);
        getForecast(city);
    } catch (error) {
        showError('Something went wrong. Check your connection.');
    }
}

async function getWeatherByCoords(lat, lon) {
    try {
        showLoading();
        const res = await fetch(
            `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await res.json();
        updateMainWeather(data);
        getForecastByCoords(lat, lon);
    } catch (error) {
        showError('Could not get location weather.');
    }
}

async function getForecast(city) {
    try {
        const res = await fetch(
            `${BASE_URL}/forecast?q=${city},KE&appid=${API_KEY}&units=metric`
        );
        if (!res.ok) {
            const res2 = await fetch(
                `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
            );
            const data = await res2.json();
            updateForecast(data);
            return;
        }
        const data = await res.json();
        updateForecast(data);
    } catch (error) {
        console.log('Forecast error:', error);
    }
}

async function getForecastByCoords(lat, lon) {
    try {
        const res = await fetch(
            `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await res.json();
        updateForecast(data);
    } catch (error) {
        console.log('Forecast error:', error);
    }
}

function updateMainWeather(data) {
    const condition = data.weather[0].main;
    const desc = data.weather[0].description;

    document.getElementById('cityName').textContent =
        `${data.name}, Kenya`;

    document.getElementById('weatherDate').textContent =
        `${formatDate()} • ${new Date().toLocaleTimeString('en-KE', {
            hour: '2-digit', minute: '2-digit'
        })}`;

    document.getElementById('temperature').textContent =
        `${Math.round(data.main.temp)}°C`;

    document.getElementById('weatherDesc').textContent =
        desc.charAt(0).toUpperCase() + desc.slice(1);

    document.getElementById('weatherIcon').textContent =
        getEmoji(condition);

    document.getElementById('tempHigh').textContent =
        `↑ ${Math.round(data.main.temp_max)}°C`;

    document.getElementById('tempLow').textContent =
        `↓ ${Math.round(data.main.temp_min)}°C`;

    document.getElementById('humidity').textContent =
        `${data.main.humidity}%`;

    document.getElementById('windSpeed').textContent =
        `${Math.round(data.wind.speed * 3.6)} km/h`;

    document.getElementById('pressure').textContent =
        `${data.main.pressure} hPa`;

    document.getElementById('visibility').textContent =
        `${(data.visibility / 1000).toFixed(1)} km`;

    updateWeatherDetails(data);
    updateHeroBackground(condition);
}

function updateWeatherDetails(data) {
    document.getElementById('feelsLike').textContent =
        `${Math.round(data.main.feels_like)}°C`;

    document.getElementById('sunrise').textContent =
        formatTime(data.sys.sunrise);

    document.getElementById('sunset').textContent =
        formatTime(data.sys.sunset);

    document.getElementById('cloudCover').textContent =
        `${data.clouds.all}%`;

    const temp = data.main.temp;
    let uv, uvClass;

    if (temp > 35) {
        uv = '11+ (Extreme)';
        uvClass = 'extreme';
    } else if (temp > 30) {
        uv = '8 (Very High)';
        uvClass = 'very-high';
    } else if (temp > 25) {
        uv = '6 (High)';
        uvClass = 'high';
    } else if (temp > 20) {
        uv = '4 (Moderate)';
        uvClass = 'moderate';
    } else {
        uv = '2 (Low)';
        uvClass = 'low';
    }

    const uvEl = document.getElementById('uvIndex');
    uvEl.textContent = uv;
    uvEl.className = uvClass;
}

function updateHeroBackground(condition) {
    const hero = document.querySelector('.weather-hero');
    const gradients = {
        'Clear':        'linear-gradient(160deg, #f97316 0%, #fbbf24 40%, #1a6eb5 100%)',
        'Clouds':       'linear-gradient(160deg, #64748b 0%, #334155 60%, #1e293b 100%)',
        'Rain':         'linear-gradient(160deg, #1e3a5f 0%, #0f2137 60%, #071020 100%)',
        'Drizzle':      'linear-gradient(160deg, #2563eb 0%, #1e3a5f 60%, #0f2137 100%)',
        'Thunderstorm': 'linear-gradient(160deg, #1e1b4b 0%, #312e81 40%, #0f0f1a 100%)',
        'Snow':         'linear-gradient(160deg, #e2e8f0 0%, #94a3b8 60%, #475569 100%)',
        'Mist':         'linear-gradient(160deg, #94a3b8 0%, #64748b 60%, #334155 100%)',
        'Haze':         'linear-gradient(160deg, #92400e 0%, #78350f 60%, #451a03 100%)',
        'Dust':         'linear-gradient(160deg, #d97706 0%, #92400e 60%, #451a03 100%)',
    };
    hero.style.background = gradients[condition] ||
        'linear-gradient(160deg, #1a6eb5 0%, #0d3b6e 60%, #071d3a 100%)';
}

function updateForecast(data) {
    const grid = document.getElementById('forecastGrid');
    const daily = {};

    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('en-KE', { weekday: 'short' });
        const dateStr = date.toLocaleDateString('en-KE', {
            day: 'numeric', month: 'short'
        });
        if (!daily[day] && Object.keys(daily).length < 5) {
            daily[day] = {
                date: dateStr,
                temp_max: item.main.temp_max,
                temp_min: item.main.temp_min,
                condition: item.weather[0].main
            };
        }
    });

    grid.innerHTML = Object.entries(daily).map(([day, info]) => `
        <div class="forecast-card">
            <p class="day">${day}</p>
            <p class="date">${info.date}</p>
            <span style="font-size:36px">${getEmoji(info.condition)}</span>
            <p class="f-high">${Math.round(info.temp_max)}°C</p>
            <p class="f-low">${Math.round(info.temp_min)}°C</p>
        </div>
    `).join('');
}

async function updatePopularPlaces() {
    const places = [
        { name: 'Mombasa', img: 'images/mombasa.jpeg' },
        { name: 'Kisumu',  img: 'images/kisumu.jpeg' },
        { name: 'Nakuru',  img: 'images/nakuru.jpeg' },
        { name: 'Eldoret', img: 'images/eldoret.jpeg' },
    ];

    const grid = document.getElementById('placesGrid');

    const results = await Promise.all(
        places.map(p =>
            fetch(`${BASE_URL}/weather?q=${p.name},KE&appid=${API_KEY}&units=metric`)
                .then(r => r.json())
                .catch(() => null)
        )
    );

    grid.innerHTML = results.map((data, i) => {
        const place = places[i];
        const temp = data && data.main ? `${Math.round(data.main.temp)}°C` : '--';
        const desc = data && data.weather ? data.weather[0].description : 'N/A';
        const emoji = data && data.weather ? getEmoji(data.weather[0].main) : '🌤️';
        return `
            <div class="place-card" onclick="getWeather('${place.name}')">
                <img src="${place.img}" alt="${place.name}">
                <div class="place-overlay">
                    <div class="place-info">
                        <div>
                            <p class="place-name">${place.name}</p>
                            <p class="place-desc">${desc} ${emoji}</p>
                        </div>
                        <span class="place-temp">${temp}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function showLoading() {
    document.getElementById('cityName').textContent = 'Loading...';
    document.getElementById('temperature').textContent = '--°C';
    document.getElementById('weatherDesc').textContent = 'Fetching weather...';
    document.getElementById('weatherIcon').textContent = '🔄';
}

function showError(msg) {
    document.getElementById('cityName').textContent = 'Error';
    document.getElementById('weatherDesc').textContent = msg;
    document.getElementById('temperature').textContent = '--°C';
    document.getElementById('weatherIcon').textContent = '❌';
}

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const countySelect = document.getElementById('countySelect');
const darkBtn = document.getElementById('darkBtn');
const lightBtn = document.getElementById('lightBtn');

searchBtn.addEventListener('click', () => {
    const city = searchInput.value.trim();
    if (!city) {
        alert('Please enter a city name');
        return;
    }
    getWeather(city);
});

searchInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        const city = searchInput.value.trim();
        if (city) getWeather(city);
    }
});

countySelect.addEventListener('change', () => {
    const county = countySelect.value;
    if (!county) return;
    const city = countyToCityMap[county] || county;
    getWeather(city);
});

locationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        alert('Geolocation not supported by your browser');
        return;
    }
    locationBtn.innerHTML = '<i class="ti ti-loader"></i> Getting location...';
    navigator.geolocation.getCurrentPosition(
        pos => {
            getWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
            locationBtn.innerHTML = '<i class="ti ti-navigation"></i> Use My Location';
        },
        () => {
            alert('Location access denied');
            locationBtn.innerHTML = '<i class="ti ti-navigation"></i> Use My Location';
        }
    );
});

darkBtn.addEventListener('click', () => {
    document.body.style.background = '#060910';
    darkBtn.classList.add('active');
    lightBtn.classList.remove('active');
});

lightBtn.addEventListener('click', () => {
    document.body.style.background = '#0d1117';
    lightBtn.classList.add('active');
    darkBtn.classList.remove('active');
});

getWeather('Nairobi');
updatePopularPlaces();
