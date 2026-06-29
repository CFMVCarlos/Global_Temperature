## 2026-06-27 - Memoize Mercator Scaling Factor to accelerate draw() in p5.js
**Learning:** In a p5.js sketch where the rendering loop runs repeatedly via `draw()`, calculating the scaling factor for Mercator projections every time `mercX` and `mercY` are called causes considerable overhead, as `pow()` and divisions are calculated 4 times per frame.
**Action:** Since `zoom` doesn't change on every frame, use a simple module-level closure or global variable to cache the result based on the current `zoom` value, saving unnecessary compute overhead.
