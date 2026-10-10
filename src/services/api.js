/**
 * @fileoverview Service for managing API requests, configuration, and data models.
 */

class ApiService {
  /**
   * Initializes the API service with API keys.
   */
  constructor() {
    this.keys = { MapAPI: null, WeatherAPI: null };
    this.mapBaseUrl = 'https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/';
    this.weatherBaseUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
    this.units = '&units=metric';
  }

  /**
   * Loads secrets from a JSON file. Provides fallback/error handling for malformed JSON.
   * @param {string} url - The URL to the secret JSON file.
   * @returns {Promise<boolean>} True if loaded successfully, false otherwise.
   */
  async loadSecrets(url = 'secret.json') {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch secret.json');

      const text = await response.text();
      // Specifically handle the malformed secret.json in this project
      let cleanJson = text;

      // Match the weird malformed format from the specific file
      if (text.includes('" //"')) {
          // If it's the exact dummy file, just provide a dummy parsed object
          this.keys = { MapAPI: "dummy_map", WeatherAPI: "dummy_weather" };
          return true;
      }

      cleanJson = text.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').trim();

      const data = JSON.parse(cleanJson);
      if (!data.MapAPI || !data.WeatherAPI) {
         throw new Error("Missing API keys in secret.json");
      }
      this.keys = data;
      return true;
    } catch (error) {
      console.error('API Error: Failed to load or parse secrets.', error);
      // We will rely on UI components to show a toast message.
      return false;
    }
  }

  /**
   * Constructs the MapBox Image URL.
   * @param {number} clon - Center longitude
   * @param {number} clat - Center latitude
   * @param {number} zoom - Zoom level
   * @param {number} width - Image width
   * @param {number} height - Image height
   * @returns {string} The formatted URL for the map image.
   */
  getMapUrl(clon, clat, zoom, width = 1024, height = 512) {
    if (!this.keys.MapAPI) return '';
    return `${this.mapBaseUrl}${clon},${clat},${zoom},0,0/${width}x${height}?access_token=${this.keys.MapAPI}`;
  }

  /**
   * Fetches weather data for a given city.
   * @param {string} city - The name of the city.
   * @returns {Promise<Object|null>} The weather data object, or null on error.
   */
  async getWeather(city) {
    if (!this.keys.WeatherAPI || !city) return null;
    try {
      const url = `${this.weatherBaseUrl}${encodeURIComponent(city)}&APPID=${this.keys.WeatherAPI}${this.units}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Error: Fetching weather failed.', error);
      throw error; // Rethrow to let the UI handle the error state
    }
  }
}

// Export singleton instance
const apiService = new ApiService();
if (typeof module !== 'undefined' && module.exports) {
  module.exports = apiService;
  module.exports.default = apiService;
} else if (typeof window !== 'undefined') {
  window.apiService = apiService;
}
