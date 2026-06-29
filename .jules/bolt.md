## 2026-06-29 - Fixed malformed package.json and broken tests
**Learning:** This codebase had broken configurations out of the box (malformed package.json due to duplicate missing brackets, missing brace in tests, and evaluation scope issues for global functions like loadJSON).
**Action:** When finding a completely broken test setup on master, prioritize fixing it first with user confirmation, as testing the performance optimization is impossible otherwise.
## 2026-06-26 - Memoize Mercator Scaling Factor
**Learning:** `draw()` function is called 60 times a second by p5.js, and recalculating constant scaling factors involving computationally expensive operations like `Math.pow()` and `Math.log()` causes unnecessary overhead per frame. The scaling factor only depends on `zoom`, which rarely changes compared to the frame rate.
**Action:** When working with p5.js `draw()`, identify and memoize computations based on slowly changing variables (like zoom or coordinate bounds) outside the tight loop. Cache results instead of recalculating them from scratch every frame.
## 2026-06-27 - Memoize Mercator Scaling Factor to accelerate draw() in p5.js
**Learning:** In a p5.js sketch where the rendering loop runs repeatedly via `draw()`, calculating the scaling factor for Mercator projections every time `mercX` and `mercY` are called causes considerable overhead, as `pow()` and divisions are calculated 4 times per frame.
**Action:** Since `zoom` doesn't change on every frame, use a simple module-level closure or global variable to cache the result based on the current `zoom` value, saving unnecessary compute overhead.
## 2026-06-25 - Caching expensive canvas rendering map projections
**Learning:** Continuous rendering loops (like `draw()` in `p5.js`, running 60fps) are extremely sensitive to mathematical operations. Re-calculating Geographic Mercator Projections (`mercX`, `mercY`) which use `pow()`, `tan()`, and `log()` causes significant CPU overhead and can slow down the framerate, especially if the underlying map coordinates haven't changed.
**Action:** When working with canvas APIs and repeated draw functions, always cache coordinate transforms (or any costly calculations) using a state object that monitors when inputs (`zoom`, `weather`, geographic center) actually change, only triggering recalculations on updates rather than on every frame tick.
