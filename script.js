/* ============================================================================
   LILA'S SITE — MAIN SCRIPT
   ============================================================================
   Sections below, in order:
   1. Countdown (optional real date)
   2. Floating hearts background (canvas)
   3. Scroll-reveal animations
   4. Flip cards (reasons section)
   5. Music player controls
   ============================================================================ */

/* --------------------------------------------------------------------------
   1. COUNTDOWN
   -------------------------------------------------------------------------- */
// REPLACE: set this to an actual date ("2026-12-24T00:00:00") if you ever
// want a real ticking countdown instead of the "Soon" text. Leave it as
// null to keep the playful "Soon" message.
const WEDDING_DATE = null;

function initCountdown() {
  const el = document.getElementById("countdown-value");
  if (!WEDDING_DATE || !el) return; // keeps "Soon 💍" as-is

  function tick() {
    const diff = new Date(WEDDING_DATE) - new Date();
    if (diff <= 0) {
      el.textContent = "Today 💍";
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    el.textContent = `${days}d ${hours}h`;
  }
  tick();
  setInterval(tick, 60 * 1000);
}

/* --------------------------------------------------------------------------
   2. FLOATING HEARTS BACKGROUND
   -------------------------------------------------------------------------- */
function initHearts() {
  const canvas = document.getElementById("hearts-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width, height;
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = document.body.scrollHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  // A gentle number of hearts — tweak HEART_COUNT for more/less
  const HEART_COUNT = 26;
  const hearts = Array.from({ length: HEART_COUNT }, () => spawnHeart());

  function spawnHeart() {
    return {
      x: Math.random() * width,
      y: height + Math.random() * height,
      size: 8 + Math.random() * 14,
      speed: 0.3 + Math.random() * 0.6,
      drift: (Math.random() - 0.5) * 0.6,
      opacity: 0.15 + Math.random() * 0.35,
      wobble: Math.random() * Math.PI * 2,
    };
  }

  function drawHeart(h) {
    const s = h.size;
    ctx.save();
    ctx.translate(h.x, h.y);
    ctx.globalAlpha = h.opacity;
    ctx.fillStyle = "#e186a8";
    ctx.beginPath();
    ctx.moveTo(0, s * 0.3);
    ctx.bezierCurveTo(-s / 2, -s / 3, -s, s / 4, 0, s);
    ctx.bezierCurveTo(s, s / 4, s / 2, -s / 3, 0, s * 0.3);
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    hearts.forEach((h) => {
      h.y -= h.speed;
      h.wobble += 0.02;
      h.x += Math.sin(h.wobble) * h.drift;
      if (h.y < -20) Object.assign(h, spawnHeart(), { y: height + 20 });
      drawHeart(h);
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* --------------------------------------------------------------------------
   3. SCROLL REVEAL (fade + rise elements into view as you scroll)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((item) => observer.observe(item));
}

/* --------------------------------------------------------------------------
   4. FLIP CARDS
   -------------------------------------------------------------------------- */
function initFlipCards() {
  document.querySelectorAll(".flip-card").forEach((card) => {
    card.addEventListener("click", () => card.classList.toggle("is-flipped"));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.classList.toggle("is-flipped");
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. MUSIC PLAYER
   -------------------------------------------------------------------------- */
function initMusicPlayer() {
  const audio = document.getElementById("audio");
  const btn = document.getElementById("play-btn");
  const player = document.getElementById("music-player");
  const info = document.getElementById("music-info");
  const tracks = document.querySelectorAll(".music-track");
  if (!audio || !btn || !player || !info || !tracks.length) return;

  function selectTrack(track) {
    audio.src = track.dataset.src;
    info.innerHTML = `<strong>${track.dataset.title}</strong><span>${track.dataset.artist}</span>`;
    tracks.forEach((item) => item.classList.toggle("is-selected", item === track));
  }

  selectTrack(tracks[0]);

  tracks.forEach((track) => {
    track.addEventListener("click", () => {
      const wasSelected = track.classList.contains("is-selected");
      selectTrack(track);
      if (!wasSelected || audio.paused) {
        audio.play().catch(() => {});
        btn.textContent = "⏸";
        player.classList.add("is-playing");
      }
    });
  });

  btn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().catch(() => {
        // If the browser blocks autoplay/play (e.g. no file added yet), fail quietly.
        console.warn("Add your mp3 file to /music and update the <audio> src in index.html.");
      });
      btn.textContent = "⏸";
      player.classList.add("is-playing");
    } else {
      audio.pause();
      btn.textContent = "▶";
      player.classList.remove("is-playing");
    }
  });
}

/* --------------------------------------------------------------------------
   INIT
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initCountdown();
  initHearts();
  initScrollReveal();
  initFlipCards();
  initMusicPlayer();
});
