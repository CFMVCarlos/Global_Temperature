const { weatherAsk, firstLoad, getWeather, setInput } = require('./global_temp');

describe('weatherAsk', () => {
  beforeEach(() => {
    // Reset any previous mocks
    jest.clearAllMocks();

    // Set up global p5.js loadJSON function mock
    global.loadJSON = jest.fn((url, callback) => {
      // Simulate network response based on URL if needed, or simply invoke callback
      const mockData = { name: 'TestCity', main: { temp: 20 }, coord: { lon: 0, lat: 0 } };
      if (callback) {
        callback(mockData);
      }
    });

    // Call firstLoad to set up internal variables (weather_apiQ, weather_apiID, weather_units)
    firstLoad({ MapAPI: 'mockMapApiKey', WeatherAPI: 'mockWeatherApiKey' });
  });

  afterEach(() => {
    // Clean up
    delete global.loadJSON;
  });

  it('should construct correct URL and fetch weather data when called', () => {
    // Setup input mock
    const mockCity = 'London';
    setInput({
      value: jest.fn(() => mockCity)
    });

    // Execute weatherAsk
    weatherAsk();

    // Verify correct URL construction
    const expectedUrl = `https://api.openweathermap.org/data/2.5/weather?q=${mockCity}&APPID=mockWeatherApiKey&units=metric`;

    expect(global.loadJSON).toHaveBeenCalledTimes(1);
    expect(global.loadJSON).toHaveBeenCalledWith(expectedUrl, expect.any(Function));

    // After weatherAsk calls loadJSON and its callback executes, verify `weather` state
    const weatherState = getWeather();
    expect(weatherState).toBeDefined();
    expect(weatherState.name).toBe('TestCity');
    expect(weatherState.main.temp).toBe(20);
  });
});
