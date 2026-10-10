/**
 * @fileoverview Utility functions for calculating Mercator map projections.
 */

/**
 * Variables to memoize Mercator scaling factor
 * @type {number|null}
 */
let lastZoom = null;
let cachedScalingFactor = null;

/**
 * Get scaling factor for Mercator projection based on zoom level.
 * @param {number} zoom - Map zoom level.
 * @returns {number} The calculated scaling factor.
 */
function getMercatorScalingFactor(zoom) {
  if (zoom !== lastZoom || cachedScalingFactor === null) {
    cachedScalingFactor = (256 / Math.PI) * Math.pow(2, zoom);
    lastZoom = zoom;
  }
  return cachedScalingFactor;
}

/**
 * Calculates the Mercator X-coordinate from longitude.
 * @param {number} lon - Longitude in degrees.
 * @param {number} zoom - Zoom level.
 * @returns {number} The X-coordinate.
 */
function mercX(lon, zoom) {
  const a = getMercatorScalingFactor(zoom);
  const b = (lon * Math.PI) / 180 + Math.PI;
  return a * b;
}

/**
 * Calculates the Mercator Y-coordinate from latitude.
 * @param {number} lat - Latitude in degrees.
 * @param {number} zoom - Zoom level.
 * @returns {number} The Y-coordinate.
 */
function mercY(lat, zoom) {
  const a = getMercatorScalingFactor(zoom);
  const b = Math.tan(Math.PI / 4 + (lat * Math.PI) / 180 / 2);
  const c = Math.PI - Math.log(b);
  return a * c;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { mercX, mercY, getMercatorScalingFactor };
} else if (typeof window !== 'undefined') {
  window.mathUtils = { mercX, mercY, getMercatorScalingFactor };
}
