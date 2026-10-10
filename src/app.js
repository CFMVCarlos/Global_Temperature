/**
 * @fileoverview Main Application entry point and orchestrator.
 */

// Utils and services are loaded globally in browser environment (index.html)
const mathRef = typeof window !== 'undefined' && window.mathUtils ? window.mathUtils : require('./utils/math.js');
const _mercX = mathRef.mercX;
const _mercY = mathRef.mercY;
const _apiService = typeof window !== 'undefined' && window.apiService ? window.apiService : require('./services/api.js');
const _toast = typeof window !== 'undefined' ? window.toast : null;

class App {
  constructor() {
    // State
    this.mapImage = null;
    this.weatherData = [];
    this.isFrozen = false;
    this.zoom = 1;
    this.clon = 0;
    this.clat = 0;

    // DOM Elements
    this.canvas = document.getElementById('map-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.input = document.getElementById('city-input');
    this.searchBtn = document.getElementById('search-btn');
    this.toggleBtn = document.getElementById('toggle-btn');
    this.loadingSpinner = document.getElementById('loading-spinner');
    this.skeleton = document.getElementById('map-skeleton');
    this.errorState = document.getElementById('map-error');
  }

  /**
   * Initializes the application.
   */
  async init() {
    if (!this.canvas) return; // Prevent errors in non-browser envs

    this.setupEventListeners();

    // Load secrets and initial map
    const loaded = await _apiService.loadSecrets();
    if (!loaded) {
      this.showMapError("Failed to parse API keys. Please check secret.json for malformed JSON or missing keys.");
      if (_toast) _toast.show("Check secret.json for errors.", "error", 6000);
      return;
    }

    await this.loadMap();
  }

  /**
   * Sets up UI event listeners.
   */
  setupEventListeners() {
    if (!this.searchBtn) return;

    this.searchBtn.addEventListener('click', () => this.handleSearch());
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleSearch();
    });

    this.toggleBtn.addEventListener('click', () => {
      this.isFrozen = !this.isFrozen;
      this.toggleBtn.innerText = this.isFrozen ? 'Unfreeze Pins' : 'Freeze Pins';
      this.toggleBtn.classList.toggle('bg-brand', this.isFrozen);
      this.toggleBtn.classList.toggle('bg-slate-800', !this.isFrozen);
    });
  }

  /**
   * Sets UI loading state.
   * @param {boolean} isLoading
   */
  setLoading(isLoading) {
    if (isLoading) {
      this.loadingSpinner.classList.remove('hidden');
      this.searchBtn.disabled = true;
      this.input.disabled = true;
    } else {
      this.loadingSpinner.classList.add('hidden');
      this.searchBtn.disabled = false;
      this.input.disabled = false;
      this.input.focus();
    }
  }

  /**
   * Shows map error state.
   * @param {string} msg
   */
  showMapError(msg) {
    if(this.skeleton) this.skeleton.classList.add('hidden');
    if(this.errorState) {
      this.errorState.classList.remove('hidden');
      document.getElementById('map-error-msg').innerText = msg;
    }
  }

  /**
   * Loads the background map image.
   */
  async loadMap() {
    const url = _apiService.getMapUrl(this.clon, this.clat, this.zoom, this.canvas.width, this.canvas.height);
    if (!url) {
       this.showMapError("MapBox API Key is missing.");
       return;
    }

    return new Promise((resolve) => {
      const img = new Image();
      // Only use crossOrigin if it's not a dummy image
      if (url.indexOf("dummy_map") === -1) {
          img.crossOrigin = "Anonymous";
      }

      img.onload = () => {
        this.mapImage = img;
        if(this.skeleton) this.skeleton.classList.add('hidden');
        if(this.errorState) this.errorState.classList.add('hidden');
        this.canvas.classList.remove('opacity-0');
        this.render();
        resolve();
      };

      img.onerror = () => {
        this.showMapError("Failed to fetch map image. Check API key validity.");
        if (_toast) _toast.show("MapBox API Error", "error");
        resolve();
      };

      img.src = url;
    });
  }

  /**
   * Handles the city search action.
   */
  async handleSearch() {
    const city = this.input.value.trim();
    if (!city) {
      if (_toast) _toast.show("Please enter a city name.", "error");
      return;
    }

    this.setLoading(true);

    try {
      const data = await _apiService.getWeather(city);
      if (data && data.coord) {
        // If not frozen, clear previous data
        if (!this.isFrozen) {
          this.weatherData = [];
        }
        this.weatherData.push(data);
        if (_toast) _toast.show(`Weather found for ${data.name}`, 'success');
        this.render();
      } else {
        if (_toast) _toast.show(`City "${city}" not found.`, 'error');
      }
    } catch (error) {
      if (_toast) _toast.show(`Error fetching weather for ${city}. Check OpenWeather API key.`, 'error');
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Renders the map and weather pins onto the Canvas.
   */
  render() {
    if (!this.ctx || !this.mapImage) return;

    const width = this.canvas.width;
    const height = this.canvas.height;

    // Clear and draw map
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.drawImage(this.mapImage, 0, 0, width, height);

    // Set origin to center for Mercator projection math compatibility with old logic
    this.ctx.save();
    this.ctx.translate(width / 2, height / 2);

    // Draw pins
    for (const data of this.weatherData) {
      this.drawPin(data);
    }

    this.ctx.restore();
  }

  /**
   * Draws a single weather pin.
   * @param {Object} data - Weather API response object.
   */
  drawPin(data) {
    const lon = data.coord.lon;
    const lat = data.coord.lat;
    const temp = Math.round(data.main.temp);
    const name = data.name;

    // Calculate Mercator coordinates relative to center
    const cx = _mercX(this.clon, this.zoom);
    const cy = _mercY(this.clat, this.zoom);
    const x = _mercX(lon, this.zoom) - cx;
    const y = _mercY(lat, this.zoom) - cy;

    const size = 6;

    // Draw point
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fill();
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = '#0ea5e9'; // Brand color ring
    this.ctx.stroke();

    // Draw text styling
    this.ctx.font = 'bold 14px Inter, sans-serif';
    this.ctx.fillStyle = '#ffffff';
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    this.ctx.shadowBlur = 4;
    this.ctx.shadowOffsetX = 1;
    this.ctx.shadowOffsetY = 1;

    // Draw Temperature
    this.ctx.fillText(`${temp}°C`, x + size * 1.5, y - size);

    // Draw City Name
    this.ctx.font = '12px Inter, sans-serif';
    this.ctx.fillStyle = '#e2e8f0'; // slate-200
    this.ctx.fillText(name, x - size * 2, y + size * 3);
  }
}

// Initialize on DOM Load
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
  });
}
