const { firstLoad } = require('./global_temp.js');

describe('firstLoad', () => {
  let originalConsoleError;

  beforeEach(() => {
    // Mock console.error
    originalConsoleError = console.error;
    console.error = jest.fn();

    // Mock loadImage globally
    global.loadImage = jest.fn();
  });

  afterEach(() => {
    // Restore original console.error
    console.error = originalConsoleError;

    // Clear mocks
    jest.clearAllMocks();
  });

  it('should catch and log error if loadImage fails', async () => {
    // Setup mock data
    const mockData = {
      MapAPI: 'mock-map-api',
      WeatherAPI: 'mock-weather-api',
    };

    // Simulate an error from loadImage
    const mockError = new Error('Network failure');
    global.loadImage.mockRejectedValue(mockError);

    // Call firstLoad
    await firstLoad(mockData);

    // Verify loadImage was called
    expect(global.loadImage).toHaveBeenCalled();
    expect(global.loadImage).toHaveBeenCalledWith(
      expect.stringContaining('mock-map-api')
    );

    // Verify console.error was called with the correct error
    expect(console.error).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Failed to load map image:',
      mockError
    );
  });
});
