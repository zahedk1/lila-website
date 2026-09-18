/* ============================================================================
   FLOWER FINALE — SCRIPT
   ============================================================================
   This builds the peony as SVG entirely in code (no image files needed) and
   choreographs the four-part finale:
     1. Stem draws itself, leaves unfurl               (0s   -> ~3s)
     2. Petals bloom outward, layer by layer            (~2s  -> ~13s)
     3. The whole bloom spins once                      (~15s -> ~17.2s)
     4. The closing line fades in                       (~17.5s onward)

   TO CUSTOMIZE:
   - Petal counts, sizes, and colors are all in the CONFIG object below.
   - The total bloom time is controlled by TIMING — nothing else needs to
     change if you adjust it.
   ============================================================================ */

const CONFIG = {
  center: { x: 250, y: 300 },
  layers: [
    // Outer layer: biggest, longest petals
    { id: "petals-outer", count: 10, radius: 78, width: 46, height: 92, gradient: "petalGradOuter", offsetDeg: 0 },
    // Middle layer: medium, offset so petals sit between the outer ones
    { id: "petals-mid", count: 8, radius: 50, width: 36, height: 62, gradient: "petalGradMid", offsetDeg: 18 },
    // Inner layer: small, tight petals near the heart
    { id: "petals-inner", count: 6, radius: 26, width: 22, height: 38, gradient: "petalGradInner", offsetDeg: 9 },
  ],
  stamenCount: 12,
  stamenRadius: 14,
};

// Overall pacing, in milliseconds. Layers bloom one after another with a
// small stagger *within* each layer so it feels organic, not mechanical.
const TIMING = {
  stemDraw: 3000,
  leavesStart: 1100,
  layerStartTimes: [2000, 5200, 8400],   // outer, mid, inner start times
  layerDuration: 3000,                    // how long each layer takes to fully bloom
  stamensStart: 11800,
  spinStart: 15000,
  spinDuration: 2200,
  textDelayAfterSpin: 400,
};

/* --------------------------------------------------------------------------
   Petal path generator — a simple teardrop, base at (0,0), tip at (0,-height)
   -------------------------------------------------------------------------- */
function petalPathD(width, height) {
  const w = width / 2;
  return `M0,0 C -${w},-${height * 0.32} -${w},-${height * 0.78} 0,-${height} ` +
         `C ${w},-${height * 0.78} ${w},-${height * 0.32} 0,0 Z`;
}

const svgNS = "http://www.w3.org/2000/svg";
function el(tag, attrs) {
  const node = document.createElementNS(svgNS, tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

/* --------------------------------------------------------------------------
   Build one layer of petals
   -------------------------------------------------------------------------- */
function buildLayer(layer, startTime) {
  const container = document.getElementById(layer.id);
  const angleStep = 360 / layer.count;
  const staggerPerPetal = TIMING.layerDuration / layer.count;

  for (let i = 0; i < layer.count; i++) {
    const angle = angleStep * i + layer.offsetDeg;
    const delay = (startTime + i * staggerPerPetal) / 1000; // seconds, for CSS var

    const position = el("g", {
      transform: `translate(${CONFIG.center.x},${CONFIG.center.y}) rotate(${angle})`,
    });
    const grow = el("g", { class: "petal-grow" });
    grow.style.setProperty("--delay", `${delay}s`);

    const path = el("path", {
      d: petalPathD(layer.width, layer.height),
      fill: `url(#${layer.gradient})`,
    });

    grow.appendChild(path);
    position.appendChild(grow);
    container.appendChild(position);
  }
}

/* --------------------------------------------------------------------------
   Build the flower heart (stamens) — a small ring of gold dots + one center
   -------------------------------------------------------------------------- */
function buildHeart(startTime) {
  const container = document.getElementById("flower-heart");
  const { x, y } = CONFIG.center;

  // Center glow
  const centerDot = el("g", { class: "stamen" });
  centerDot.style.setProperty("--delay", `${startTime / 1000}s`);
  centerDot.appendChild(el("circle", { cx: x, cy: y, r: 12, fill: "url(#heartGlow)" }));
  container.appendChild(centerDot);

  // Ring of little stamens
  for (let i = 0; i < CONFIG.stamenCount; i++) {
    const angle = (360 / CONFIG.stamenCount) * i;
    const rad = (angle * Math.PI) / 180;
    const px = x + Math.cos(rad) * CONFIG.stamenRadius;
    const py = y + Math.sin(rad) * CONFIG.stamenRadius;
    const delay = (startTime + 150 + i * 40) / 1000;

    const dot = el("g", { class: "stamen" });
    dot.style.setProperty("--delay", `${delay}s`);
    dot.appendChild(el("circle", { cx: px, cy: py, r: 3.2, fill: "#e8b85a" }));
    container.appendChild(dot);
  }
}

/* --------------------------------------------------------------------------
   Stem draw-on effect using getTotalLength()
   -------------------------------------------------------------------------- */
function drawStem() {
  const stem = document.getElementById("stem");
  const length = stem.getTotalLength();
  stem.style.strokeDasharray = length;
  stem.style.strokeDashoffset = length;
  // Force a reflow so the browser registers the starting state before we
  // animate to the end state (otherwise it can jump straight to drawn).
  stem.getBoundingClientRect();
  requestAnimationFrame(() => {
    stem.style.strokeDashoffset = "0";
  });
}

/* --------------------------------------------------------------------------
   Orchestration
   -------------------------------------------------------------------------- */
function initFlower() {
  drawStem();

  CONFIG.layers.forEach((layer, i) => buildLayer(layer, TIMING.layerStartTimes[i]));
  buildHeart(TIMING.stamensStart);

  // Activate growth immediately — leaves and petals each carry their own
  // delay (via transition-delay / the --delay CSS variable) so they still
  // appear at the right moment on the global timeline.
  document.body.classList.add("grow-started");

  // Once everything has bloomed, spin the whole head once
  setTimeout(() => {
    document.querySelector(".flower-stage").classList.add("spin");
  }, TIMING.spinStart);

  // After the spin settles, reveal the closing line
  setTimeout(() => {
    document.body.classList.add("show-text");
  }, TIMING.spinStart + TIMING.spinDuration + TIMING.textDelayAfterSpin);
}

document.addEventListener("DOMContentLoaded", initFlower);
