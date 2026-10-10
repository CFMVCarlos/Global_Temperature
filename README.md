<div align="center">

# 🌍 Global Temperature Map

An interactive, responsive HTML5 Canvas application projecting real-time global weather observations onto a dark Mercator MapBox basemap.

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0%2B-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MapBox](https://img.shields.io/badge/MapBox-API-000000?style=flat-square&logo=mapbox&logoColor=white)](https://www.mapbox.com/)
[![OpenWeatherMap](https://img.shields.io/badge/OpenWeather-API-EB6E4B?style=flat-square&logo=open-weather-map&logoColor=white)](https://openweathermap.org/)
[![Jest](https://img.shields.io/badge/Tests-Jest-C21325?style=flat-square&logo=jest&logoColor=white)](https://jestjs.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

[Overview](#-overview) • [Key Features](#-key-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [Testing](#-testing) • [Author](#-author)

</div>

---

## 📖 Overview

**Global Temperature Map** visualizes global meteorological conditions directly in the browser. Querying city weather records via the OpenWeatherMap REST API, it maps GPS coordinates (latitude & longitude) into exact 2D pixel coordinates using a custom, memoized spherical **Mercator Projection** over a static dark MapBox map canvas.

Built with native ES modules, HTML5 Canvas, and Tailwind CSS without any heavy frontend framework bundles or complex build pipelines.

---

## ✨ Key Features

- **🌐 Dynamic Mercator Projection:** Accurate client-side conversion of spherical geographic coordinates (`lat`, `lon`) into 2D planar canvas coordinates with memoized zoom scaling.
- **🗺️ MapBox Integration:** Fetches static high-resolution dark satellite tiles matching the projection canvas.
- **📍 Real-time Temperature Pins:** Plots glowing temperature tags, city markers, and coordinate dots dynamically onto the canvas.
- **📌 Pin Freezing (`Freeze Pins`):** Pin multiple cities sequentially on the same map to compare global climate patterns simultaneously without clearing previous search data.
- **🔔 Toast Notification System:** Non-intrusive alert popups notifying users of successful API lookups, unknown city errors, or missing access tokens.
- **🛡️ Resilient Error & Offline Fallbacks:** Graceful skeleton loaders and blurred error states if `secret.json` or API keys are missing.

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/CFMVCarlos/Global_Temperature.git
cd Global_Temperature
```

### 2. Configure API Keys
The application requires API tokens for MapBox and OpenWeatherMap. Create or update `secret.json` in the root folder:

```json
{
  "WeatherAPI": "your_openweathermap_api_key",
  "MapAPI": "your_mapbox_access_token"
}
```

> **Where to get keys:**
> - [MapBox Access Token](https://account.mapbox.com/) (Free tier available)
> - [OpenWeatherMap API Key](https://home.openweathermap.org/api_keys) (Free tier available)

### 3. Run Locally
Because modern browsers restrict local `fetch()` calls to `file://` protocols, serve the directory using any static HTTP server:

```bash
# Using Python (standard):
python3 -m http.server 8080

# Or using Node.js:
npx serve .
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 🕹️ Controls & Usage

| Action | Control | Description |
| :--- | :--- | :--- |
| **Search City** | `<input>` + <kbd>Enter</kbd> or <kbd>Search</kbd> | Queries OpenWeatherMap and renders a pinpoint marker with temperature. |
| **Freeze Pins** | <kbd>Freeze Pins</kbd> button | Toggles persistent multi-city marker accumulation across queries. |
| **Clear / Unfreeze** | <kbd>Unfreeze Pins</kbd> button | Re-enables single-city mode, clearing prior pins on subsequent searches. |

---

## 🏛️ Architecture

```
Global_Temperature/
├── index.html                 # Main web interface with Tailwind CSS layout
├── secret.json                # API credentials config (MapBox & OpenWeatherMap)
├── src/
│   ├── app.js                 # Application orchestrator, Canvas drawing, event listeners
│   ├── global_temp.js         # Core bridge & legacy backward compatibility layer
│   ├── services/
│   │   └── api.js             # HTTP client for secret loading and weather/map queries
│   ├── utils/
│   │   └── math.js            # Memoized Mercator projection calculations (mercX, mercY)
│   └── components/
│       └── toast.js           # Lightweight toast notification UI component
└── tests/
    └── global_temp.test.js    # Jest unit test suite covering projection math & endpoints
```

---

## 🧪 Testing

The repository includes a comprehensive Jest test suite verifying Mercator projection accuracy, endpoint query construction, and state toggle handlers.

```bash
# Install test dependencies
npm install

# Run the test suite
npm test
```

```
PASS tests/global_temp.test.js
  weatherAsk
    ✓ should construct correct URL and fetch weather data when called
  global_temp.js tests
    ✓ firstLoad updates globals properly
    ✓ changeFlag toggles saveFlag and updates button html
    ✓ mercX calculates the correct mercator X-coordinate
    ✓ mercY calculates the correct mercator Y-coordinate

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
```

---

## 👤 Author

**Carlos Valente**
- GitHub: [@CFMVCarlos](https://github.com/CFMVCarlos)
- Boot.dev: [Carlos Valente](https://www.boot.dev/u/carlosfmv)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.