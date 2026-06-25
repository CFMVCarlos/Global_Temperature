const fs = require('fs');

function setupEnvironment() {
  global.PI = Math.PI;
  global.pow = Math.pow;
  global.tan = Math.tan;
  global.log = Math.log;
  global.radians = (deg) => deg * Math.PI / 180;

  // Mock p5.js functions
  global.loadImage = async () => {};
  global.createCanvas = () => {};
  global.loadJSON = () => {};
  global.select = () => ({ changed: () => {} });
  global.createButton = () => ({ mousePressed: () => {}, html: () => {} });

  const code = fs.readFileSync('global_temp.js', 'utf8');

  // Create an environment where we can safely manipulate zoom
  // without eval scoping issues.
  const fn = new Function(`
    ${code}
    return {
      mercY: mercY,
      setZoom: function(v) { zoom = v; }
    };
  `);

  return fn();
}

describe('mercY', () => {
  let env;

  beforeAll(() => {
    env = setupEnvironment();
  });

  describe('when zoom = 1', () => {
    beforeEach(() => {
      env.setZoom(1);
    });

    test('calculates correct Y coordinate for equator (0 degrees)', () => {
      expect(env.mercY(0)).toBeCloseTo(512);
    });

    test('calculates correct Y coordinate for 45 degrees North', () => {
      expect(env.mercY(45)).toBeCloseTo(368.3584, 4);
    });

    test('calculates correct Y coordinate for 45 degrees South', () => {
      expect(env.mercY(-45)).toBeCloseTo(655.6416, 4);
    });

    test('calculates Y coordinate for extreme North (89.9 degrees)', () => {
      expect(env.mercY(89.9)).toBeCloseTo(-635.9868, 4);
    });

    test('calculates Y coordinate for extreme South (-89.9 degrees)', () => {
      expect(env.mercY(-89.9)).toBeCloseTo(1659.9868, 4);
    });
  });

  describe('when zoom = 2', () => {
    beforeEach(() => {
      env.setZoom(2);
    });

    test('calculates correct Y coordinate for equator (0 degrees)', () => {
      expect(env.mercY(0)).toBeCloseTo(1024);
    });

    test('calculates correct Y coordinate for 45 degrees North', () => {
      expect(env.mercY(45)).toBeCloseTo(736.7169, 4);
    });

    test('calculates correct Y coordinate for 45 degrees South', () => {
      expect(env.mercY(-45)).toBeCloseTo(1311.2831, 4);
    });
  });

  describe('when zoom = 3', () => {
    beforeEach(() => {
      env.setZoom(3);
    });

    test('calculates correct Y coordinate for equator (0 degrees)', () => {
      expect(env.mercY(0)).toBeCloseTo(2048);
    });

    test('calculates correct Y coordinate for 45 degrees North', () => {
      expect(env.mercY(45)).toBeCloseTo(1473.4338, 4);
    });
  });
});
