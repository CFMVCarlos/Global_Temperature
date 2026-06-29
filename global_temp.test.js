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

const fs = require('fs');

global.PI = Math.PI;
global.CENTER = 'center';
global.width = 1024;
global.height = 512;
global.pow = Math.pow;
global.tan = Math.tan;
global.log = Math.log;
global.radians = (deg) => deg * Math.PI / 180;
global.loadImage = jest.fn();
global.createCanvas = jest.fn();
global.select = jest.fn().mockReturnValue({ changed: jest.fn(), value: jest.fn().mockReturnValue('London') });

// Mock createButton globally
const mockButton = { mousePressed: jest.fn(), html: jest.fn() };
global.createButton = jest.fn().mockReturnValue(mockButton);
global.loadJSON = jest.fn();
global.translate = jest.fn();
global.imageMode = jest.fn();
global.image = jest.fn();
global.stroke = jest.fn();
global.fill = jest.fn();
global.ellipse = jest.fn();
global.text = jest.fn();

const scriptContent = fs.readFileSync('global_temp.js', 'utf8');

const testContext = `
  ${scriptContent}

  module.exports = {
    getSecret: () => secret,
    getWeatherApiQ: () => weather_apiQ,
    getWeatherApiID: () => weather_apiID,
    getWeatherUnits: () => weather_units,
    getSaveFlag: () => saveFlag,
    setSaveFlag: (val) => { saveFlag = val; },
    firstLoad,
    changeFlag,
    mercX,
    mercY,
    setup
  };
`;

const mod = eval(`(function() { const module = {}; ${testContext} return module.exports; })()`);

describe('global_temp.js tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('firstLoad updates globals properly', async () => {
    const dummyData = { MapAPI: "123", WeatherAPI: "456" };
    await mod.firstLoad(dummyData);

    expect(mod.getSecret()).toEqual(dummyData);
    expect(global.loadImage).toHaveBeenCalledWith(
      `https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/0,0,1,0,0/1024x512?access_token=123`
    );
    expect(mod.getWeatherApiQ()).toBe('https://api.openweathermap.org/data/2.5/weather?q=');
    expect(mod.getWeatherApiID()).toBe('&APPID=456');
    expect(mod.getWeatherUnits()).toBe('&units=metric');
  });

  test('changeFlag toggles saveFlag and updates button html', () => {
    global.loadJSON = jest.fn();
    mod.setup();
    mod.setSaveFlag(0);
    mod.changeFlag();

    expect(mockButton.html).toHaveBeenCalledWith('Unmark Locations');
    expect(mod.getSaveFlag()).toBe(true);

    mod.changeFlag();

    expect(mockButton.html).toHaveBeenCalledWith('Mark Locations');
    expect(mod.getSaveFlag()).toBe(false);
  });

  test('mercX calculates the correct mercator X-coordinate', () => {
    const lon = 0;
    const a = (256 / Math.PI) * Math.pow(2, 1);
    const b = (lon * Math.PI / 180) + Math.PI;
    const expectedValue = a * b;

    expect(mod.mercX(lon)).toBeCloseTo(expectedValue);
  });

  test('mercY calculates the correct mercator Y-coordinate', () => {
    const lat = 0;
    const a = (256 / Math.PI) * Math.pow(2, 1);
    const b = Math.tan(Math.PI / 4 + (lat * Math.PI / 180) / 2);
    const c = Math.PI - Math.log(b);
    const expectedValue = a * c;

    expect(mod.mercY(lat)).toBeCloseTo(expectedValue);
  });

});
