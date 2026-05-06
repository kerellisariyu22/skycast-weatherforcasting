// Paste your OpenWeatherMap API key between the quotes.
// Example: const OPENWEATHER_API_KEY = "abc123yourkey";
const OPENWEATHER_API_KEY = "ded8ab8a5a8fac3215dc40a22592b84e";

const weatherData = {
  chennai: {
    name: "Chennai, India",
    condition: "Partly cloudy",
    icon: "sun-cloud",
    temp: 31,
    feels: 34,
    humidity: 72,
    wind: 16,
    pressure: 1008,
    rain: 38,
    alert: {
      level: "watch",
      title: "Humidity watch",
      body: "Warm and humid conditions may feel uncomfortable during afternoon travel."
    },
    forecast: [
      ["Today", 31, 38, "cloud"],
      ["Wed", 32, 44, "rain"],
      ["Thu", 30, 52, "rain"],
      ["Fri", 31, 24, "cloud"],
      ["Sat", 33, 18, "sun"]
    ]
  },
  mumbai: {
    name: "Mumbai, India",
    condition: "Light rain",
    icon: "rainy",
    temp: 29,
    feels: 33,
    humidity: 81,
    wind: 22,
    pressure: 1006,
    rain: 64,
    alert: {
      level: "warning",
      title: "Rain alert",
      body: "Carry rain protection and watch for slower traffic near low-lying areas."
    },
    forecast: [
      ["Today", 29, 64, "rain"],
      ["Wed", 28, 71, "rain"],
      ["Thu", 29, 46, "cloud"],
      ["Fri", 30, 35, "cloud"],
      ["Sat", 30, 28, "sun"]
    ]
  },
  delhi: {
    name: "Delhi, India",
    condition: "Clear and dry",
    icon: "clear",
    temp: 35,
    feels: 36,
    humidity: 31,
    wind: 13,
    pressure: 1002,
    rain: 5,
    alert: {
      level: "warning",
      title: "Heat caution",
      body: "Avoid long exposure in peak afternoon hours and stay hydrated."
    },
    forecast: [
      ["Today", 35, 5, "sun"],
      ["Wed", 36, 4, "sun"],
      ["Thu", 37, 7, "sun"],
      ["Fri", 35, 12, "cloud"],
      ["Sat", 34, 18, "cloud"]
    ]
  },
  bengaluru: {
    name: "Bengaluru, India",
    condition: "Evening showers",
    icon: "rainy",
    temp: 25,
    feels: 26,
    humidity: 66,
    wind: 12,
    pressure: 1012,
    rain: 57,
    alert: {
      level: "watch",
      title: "Shower watch",
      body: "Short evening showers are likely; outdoor plans may need a buffer."
    },
    forecast: [
      ["Today", 25, 57, "rain"],
      ["Wed", 26, 41, "cloud"],
      ["Thu", 27, 34, "cloud"],
      ["Fri", 25, 62, "rain"],
      ["Sat", 26, 48, "rain"]
    ]
  },
  hyderabad: {
    name: "Hyderabad, India",
    condition: "Sunny",
    icon: "clear",
    temp: 33,
    feels: 35,
    humidity: 43,
    wind: 15,
    pressure: 1007,
    rain: 10,
    alert: {
      level: "normal",
      title: "No severe alert",
      body: "Weather conditions are stable with low precipitation risk."
    },
    forecast: [
      ["Today", 33, 10, "sun"],
      ["Wed", 34, 12, "sun"],
      ["Thu", 34, 16, "cloud"],
      ["Fri", 32, 24, "cloud"],
      ["Sat", 31, 31, "rain"]
    ]
  },
  kolkata: {
    name: "Kolkata, India",
    condition: "Thunder risk",
    icon: "storm",
    temp: 30,
    feels: 36,
    humidity: 84,
    wind: 19,
    pressure: 1004,
    rain: 72,
    alert: {
      level: "warning",
      title: "Thunderstorm alert",
      body: "High humidity and rain probability may produce short intense storms."
    },
    forecast: [
      ["Today", 30, 72, "storm"],
      ["Wed", 31, 66, "rain"],
      ["Thu", 29, 58, "rain"],
      ["Fri", 30, 43, "cloud"],
      ["Sat", 31, 40, "cloud"]
    ]
  }
};

const cityInput = document.querySelector("#cityInput");
const searchForm = document.querySelector("#searchForm");
const unitToggle = document.querySelector("#unitToggle");
const historyList = document.querySelector("#historyList");
const forecastList = document.querySelector("#forecastList");
const state = {
  city: "chennai",
  unit: "c",
  history: ["Chennai"],
  currentWeather: weatherData.chennai
};

function toFahrenheit(value) {
  return Math.round((value * 9) / 5 + 32);
}

function formatTemp(value) {
  return `${state.unit === "c" ? value : toFahrenheit(value)}°`;
}

function normalizeCity(value) {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

function hasApiKey() {
  return OPENWEATHER_API_KEY && OPENWEATHER_API_KEY !== "ded8ab8a5a8fac3215dc40a22592b84e";
}

function getWeatherIcon(condition) {
  const value = condition.toLowerCase();
  if (value.includes("thunder") || value.includes("storm")) return "storm";
  if (value.includes("rain") || value.includes("drizzle")) return "rainy";
  if (value.includes("clear")) return "clear";
  return "sun-cloud";
}

function getMiniIcon(condition) {
  const value = condition.toLowerCase();
  if (value.includes("thunder") || value.includes("storm")) return "storm";
  if (value.includes("rain") || value.includes("drizzle")) return "rain";
  if (value.includes("clear")) return "sun";
  return "cloud";
}

function getAlert(data) {
  if (data.rain >= 65) {
    return {
      level: "warning",
      title: "Rain alert",
      body: "High rain probability is expected. Carry rain protection and plan extra travel time."
    };
  }

  if (data.temp >= 34 || data.feels >= 37) {
    return {
      level: "warning",
      title: "Heat caution",
      body: "High temperature may cause discomfort. Stay hydrated and avoid long afternoon exposure."
    };
  }

  if (data.wind >= 25) {
    return {
      level: "watch",
      title: "Wind watch",
      body: "Breezy conditions are expected. Secure light outdoor items before heading out."
    };
  }

  return {
    level: "normal",
    title: "No severe alert",
    body: "Weather conditions are stable for this location right now."
  };
}

function buildForecast(forecastApiData) {
  const daily = new Map();

  forecastApiData.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" });
    const hour = date.getHours();
    const existing = daily.get(dayKey);

    if (!existing || Math.abs(hour - 12) < Math.abs(existing.hour - 12)) {
      daily.set(dayKey, {
        hour,
        temp: Math.round(item.main.temp),
        rain: Math.round((item.pop || 0) * 100),
        icon: getMiniIcon(item.weather?.[0]?.main || "")
      });
    }
  });

  return [...daily.entries()].slice(0, 5).map(([day, data], index) => [
    index === 0 ? "Today" : day,
    data.temp,
    data.rain,
    data.icon
  ]);
}

async function fetchJson(url) {
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Weather request failed");
  }

  return data;
}

async function fetchLiveWeather(city) {
  const query = encodeURIComponent(city);
  const units = "metric";
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${OPENWEATHER_API_KEY}&units=${units}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${OPENWEATHER_API_KEY}&units=${units}`;
  const [current, forecast] = await Promise.all([
    fetchJson(currentUrl),
    fetchJson(forecastUrl)
  ]);

  const condition = current.weather?.[0]?.description || "Current weather";
  const rainVolume = current.rain?.["1h"] || current.rain?.["3h"] || 0;
  const rainChance = Math.max(Math.round(rainVolume * 20), Math.round(current.clouds?.all || 0));
  const weather = {
    name: `${current.name}, ${current.sys?.country || ""}`.replace(/,\s*$/, ""),
    condition: condition.charAt(0).toUpperCase() + condition.slice(1),
    icon: getWeatherIcon(current.weather?.[0]?.main || condition),
    temp: Math.round(current.main.temp),
    feels: Math.round(current.main.feels_like),
    humidity: current.main.humidity,
    wind: Math.round((current.wind?.speed || 0) * 3.6),
    pressure: current.main.pressure,
    rain: Math.min(rainChance, 100),
    forecast: buildForecast(forecast)
  };

  weather.alert = getAlert(weather);
  return weather;
}

function renderWeather(data = state.currentWeather) {
  document.querySelector("#conditionLabel").textContent = data.condition;
  document.querySelector("#locationName").textContent = data.name;
  document.querySelector("#temperature").textContent = formatTemp(data.temp);
  document.querySelector("#feelsLike").textContent = `Feels like ${formatTemp(data.feels)}`;
  document.querySelector("#humidity").textContent = `${data.humidity}%`;
  document.querySelector("#wind").textContent = `${data.wind} km/h`;
  document.querySelector("#pressure").textContent = `${data.pressure} hPa`;
  document.querySelector("#rain").textContent = `${data.rain}%`;
  document.querySelector("#mapCity").textContent = data.name.split(",")[0];

  const icon = document.querySelector("#weatherIcon");
  icon.className = `weather-icon ${data.icon}`;

  forecastList.innerHTML = data.forecast.map(([day, temp, rain, iconType]) => `
    <article class="forecast-day">
      <span>${day}</span>
      <i class="mini-icon ${iconType}" aria-hidden="true"></i>
      <strong>${formatTemp(temp)}</strong>
      <span>${rain}% rain chance</span>
    </article>
  `).join("");

  document.querySelector("#alertStatus").innerHTML = `
    <div class="alert-item ${data.alert.level}">
      <strong>${data.alert.title}</strong>
      <span>${data.alert.body}</span>
    </div>
    <div class="alert-item">
      <strong>API data path</strong>
      <span>User search connects to a weather API, then the dashboard updates without reloading.</span>
    </div>
  `;

  historyList.innerHTML = state.history.map(city => `<li>${city}</li>`).join("");
}

async function selectCity(rawCity) {
  const key = normalizeCity(rawCity);
  const submitButton = searchForm.querySelector("button");
  submitButton.disabled = true;
  submitButton.textContent = "Loading";

  try {
    if (hasApiKey()) {
      state.currentWeather = await fetchLiveWeather(rawCity);
      document.querySelector("#searchHint").textContent = "Live weather updated from OpenWeatherMap.";
    } else if (weatherData[key]) {
      state.city = key;
      state.currentWeather = weatherData[key];
      document.querySelector("#searchHint").textContent = "Forecast updated with sample weather data. Add your API key for live data.";
    } else {
      state.city = "chennai";
      state.currentWeather = weatherData.chennai;
      cityInput.value = "Chennai";
      document.querySelector("#searchHint").textContent = "Add your API key for live city search. Showing Chennai sample data for now.";
    }
  } catch (error) {
    state.currentWeather = weatherData[key] || weatherData.chennai;
    document.querySelector("#searchHint").textContent = `Live weather failed: ${error.message}. Showing sample data instead.`;
  } finally {
    const historyName = state.currentWeather.name.split(",")[0];
    state.history = [historyName, ...state.history.filter(item => item !== historyName)].slice(0, 5);
    cityInput.value = historyName;
    renderWeather();
    submitButton.disabled = false;
    submitButton.textContent = "Update";
  }
}

if (hasApiKey()) {
  document.querySelector("#searchHint").textContent = "Live mode is ready. Search any city to fetch OpenWeatherMap data.";
} else {
  document.querySelector("#searchHint").textContent = "Paste your OpenWeatherMap API key in script.js for live data. Sample data works now.";
}

searchForm.addEventListener("submit", event => {
  event.preventDefault();
  selectCity(cityInput.value);
});

unitToggle.addEventListener("click", () => {
  state.unit = state.unit === "c" ? "f" : "c";
  unitToggle.textContent = state.unit === "c" ? "°C" : "°F";
  unitToggle.setAttribute("aria-pressed", state.unit === "f");
  renderWeather();
});

renderWeather();
