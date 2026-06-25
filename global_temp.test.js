const test = require('node:test');
const assert = require('node:assert');

// Mock p5.js globals required for testing
global.PI = Math.PI;
global.pow = Math.pow;
global.radians = (deg) => deg * Math.PI / 180;
global.tan = Math.tan;
global.log = Math.log;
global.zoom = 1; // Default zoom used in global_temp.js

// Import the functions to test
const { mercX } = require('./global_temp.js');

test('mercX tests - Mapbox Mercator projection calculation', async (t) => {

    await t.test('calculates correct x-coordinate for center (lon=0) at default zoom (1)', () => {
        const result = mercX(0);
        // a = (256/PI) * 2^1 = 512/PI
        // b = 0 + PI = PI
        // a * b = 512
        assert.strictEqual(result, 512);
    });

    await t.test('calculates correct x-coordinate for Eastern edge (lon=180) at default zoom (1)', () => {
        const result = mercX(180);
        // a = 512/PI
        // b = PI + PI = 2PI
        // a * b = 1024
        assert.strictEqual(Math.round(result), 1024);
    });

    await t.test('calculates correct x-coordinate for Western edge (lon=-180) at default zoom (1)', () => {
        const result = mercX(-180);
        // a = 512/PI
        // b = -PI + PI = 0
        // a * b = 0
        assert.strictEqual(Math.round(result), 0);
    });

    await t.test('calculates correct x-coordinate for East mid-point (lon=90) at default zoom (1)', () => {
        const result = mercX(90);
        // a = 512/PI
        // b = PI/2 + PI = 1.5PI
        // a * b = 768
        assert.strictEqual(Math.round(result), 768);
    });

    await t.test('calculates correct x-coordinate for West mid-point (lon=-90) at default zoom (1)', () => {
        const result = mercX(-90);
        // a = 512/PI
        // b = -PI/2 + PI = 0.5PI
        // a * b = 256
        assert.strictEqual(Math.round(result), 256);
    });
});
