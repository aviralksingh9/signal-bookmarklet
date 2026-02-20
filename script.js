const canvas = document.getElementById("world");
const ctx = canvas.getContext("2d");

let w = window.innerWidth;
let h = window.innerHeight;
let dpr = 1;

let t = 0.22; // 0..1 full day cycle, start near late morning
let last = performance.now();
let mode = "home";
let soundOn = true;

const snowCount = 190;
let stars = [];
let clouds = [];
let snow = [];

const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

const homeBtn = document.getElementById("homeBtn");
const zenBtn = document.getElementById("zenBtn");
const focusBtn = document.getElementById("focusBtn");
const soundBtn = document.getElementById("soundBtn");
const sessionArc = document.getElementById("sessionArc");
const audioZen = document.getElementById("audioZen");
const audioFocus = document.getElementById("audioFocus");

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function lerp(a, b, x) {
  return a + (b - a) * x;
}

function dayAmount(cycle) {
  return clamp(Math.sin((cycle - 0.12) * Math.PI * 2) * 0.5 + 0.5, 0, 1);
}

function smoothstep(a, b, x) {
  const tStep = clamp((x - a) / (b - a), 0, 1);
  return tStep * tStep * (3 - 2 * tStep);
}

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  w = window.innerWidth;
  h = window.innerHeight;

  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  regenerate();
}

function regenerate() {
  stars = Array.from({ length: 320 }, () => ({
    x: Math.random(),
    y: Math.random() * 0.74,
    r: Math.random() * 1.8 + 0.25,
    p: Math.random() * Math.PI * 2,
    tw: Math.random() * 1.2 + 0.45,
  }));

  clouds = Array.from({ length: 12 }, (_, i) => ({
    x: Math.random() * w,
    y: h * (0.12 + i * 0.055) + Math.random() * 22,
    width: w * (0.32 + Math.random() * 0.38),
    height: 18 + Math.random() * 16,
    speed: 0.035 + Math.random() * 0.055,
    alpha: 0.08 + Math.random() * 0.09,
    wave: 10 + Math.random() * 16,
  }));

  snow = Array.from({ length: snowCount }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    s: Math.random() * 1.05 + 0.45,
    d: Math.random() * 0.4 - 0.2,
    r: Math.random() * 1.8 + 0.6,
  }));
}

function cameraOffset() {
  pointer.x = lerp(pointer.x, pointer.tx, 0.05);
  pointer.y = lerp(pointer.y, pointer.ty, 0.05);

  const modeScale = mode === "zen" ? 1 : mode === "focus" ? 0.55 : 0.78;
  const dx = Math.sin(t * 8.2) * 5 + Math.cos(t * 4.3) * 2.6;
  const dy = Math.cos(t * 6.2) * 3.8 + Math.sin(t * 3.3) * 1.9;

  return {
    x: (dx + pointer.x * 8) * modeScale,
    y: (dy + pointer.y * 5) * modeScale,
  };
}

function drawSky(cycle, day, cam) {
  const g = ctx.createLinearGradient(0, -cam.y * 0.18, 0, h + cam.y * 0.18);

  // Smooth blend between night, dawn, day, dusk.
  const dawn = smoothstep(0.14, 0.3, cycle) * (1 - smoothstep(0.3, 0.46, cycle));
  const dayCore = smoothstep(0.28, 0.45, cycle) * (1 - smoothstep(0.58, 0.72, cycle));
  const dusk = smoothstep(0.5, 0.66, cycle) * (1 - smoothstep(0.66, 0.82, cycle));
  const night = 1 - day;

  const topR = Math.round(12 + 245 * dawn + 108 * dayCore + 218 * dusk + 8 * night);
  const topG = Math.round(20 + 150 * dawn + 184 * dayCore + 108 * dusk + 15 * night);
  const topB = Math.round(38 + 40 * dawn + 255 * dayCore + 72 * dusk + 50 * night);

  const botR = Math.round(32 + 220 * dawn + 238 * dayCore + 255 * dusk + 25 * night);
  const botG = Math.round(54 + 145 * dawn + 248 * dayCore + 198 * dusk + 43 * night);
  const botB = Math.round(83 + 95 * dawn + 255 * dayCore + 140 * dusk + 82 * night);

  g.addColorStop(0, `rgb(${topR},${topG},${topB})`);
  g.addColorStop(0.62, `rgb(${botR},${botG},${botB})`);
  g.addColorStop(1, `rgb(${Math.round(26 + 20 * day)},${Math.round(40 + 26 * day)},${Math.round(60 + 36 * day)})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  const haze = ctx.createRadialGradient(w * 0.5, h * 0.73, 20, w * 0.5, h * 0.73, w * 0.72);
  haze.addColorStop(0, `rgba(255,206,158,${0.24 * day + 0.03})`);
  haze.addColorStop(1, "rgba(255,206,158,0)");
  ctx.fillStyle = haze;
  ctx.fillRect(0, 0, w, h);
}

function drawSunMoon(cycle, day, cam) {
  const night = 1 - day;
  const x = cycle * w + cam.x * 0.3;
  const y = h * 0.81 - Math.sin(cycle * Math.PI) * h * 0.6 + cam.y * 0.24;
  const moonBlend = clamp((0.38 - day) / 0.38, 0, 1);

  const warmEdge = smoothstep(0.12, 0.25, cycle) + (1 - smoothstep(0.64, 0.8, cycle));
  const noonBlend = smoothstep(0.34, 0.52, cycle) * (1 - smoothstep(0.52, 0.68, cycle));

  const sunR = 255;
  const sunG = Math.round(194 + 48 * noonBlend + 18 * warmEdge);
  const sunB = Math.round(112 + 94 * noonBlend);
  const moonR = 238;
  const moonG = 242;
  const moonB = 255;

  const orbR = Math.round(lerp(sunR, moonR, moonBlend));
  const orbG = Math.round(lerp(sunG, moonG, moonBlend));
  const orbB = Math.round(lerp(sunB, moonB, moonBlend));
  const radius = lerp(52, 37, moonBlend);
  const glowSize = lerp(210, 130, moonBlend);
  const glowAlpha = lerp(0.95 * day + 0.14, 0.75 * night + 0.1, moonBlend);

  if (day > 0.02 || night > 0.07) {
    const glow = ctx.createRadialGradient(x, y, 8, x, y, glowSize);
    glow.addColorStop(0, `rgba(${orbR},${orbG},${orbB},${glowAlpha})`);
    glow.addColorStop(1, `rgba(${orbR},${orbG},${orbB},0)`);
    ctx.fillStyle = glow;
    ctx.fillRect(x - glowSize, y - glowSize, glowSize * 2, glowSize * 2);

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${orbR},${Math.min(255, orbG + 6)},${Math.min(255, orbB + 14)},${0.94 - moonBlend * 0.08})`;
    ctx.fill();

    if (moonBlend > 0.16) {
      ctx.beginPath();
      ctx.arc(x + radius * 0.35, y - radius * 0.14, radius * 0.82, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(8,18,36,0.9)";
      ctx.fill();
    }
  }
}

function drawClouds(day, cam) {
  if (day < 0.2) return;

  clouds.forEach((cl, i) => {
    cl.x += cl.speed * (mode === "zen" ? 1.2 : 1);
    if (cl.x > w + cl.width * 0.55) cl.x = -cl.width * 0.8;

    const x = cl.x + cam.x * (0.23 + i * 0.04);
    const y = cl.y + Math.sin(t * (1 + i * 0.2) + i) * cl.wave * 0.2 + cam.y * 0.16;

    const grad = ctx.createLinearGradient(x - cl.width * 0.5, y, x + cl.width * 0.5, y);
    grad.addColorStop(0, "rgba(255,255,255,0)");
    grad.addColorStop(0.25, `rgba(245,250,255,${cl.alpha * 0.75})`);
    grad.addColorStop(0.5, `rgba(245,250,255,${cl.alpha})`);
    grad.addColorStop(0.75, `rgba(245,250,255,${cl.alpha * 0.75})`);
    grad.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = grad;
    ctx.fillRect(x - cl.width * 0.5, y - cl.height * 0.7, cl.width, cl.height * 1.4);
  });
}

function drawStars(day, cam) {
  const night = 1 - day;
  if (night < 0.07) return;

  stars.forEach((s) => {
    const pulse = 0.45 + Math.sin(t * 15 * s.tw + s.p) * 0.55;
    const a = pulse * night;
    const x = s.x * w + cam.x * 0.1;
    const y = s.y * h + cam.y * 0.08;

    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.beginPath();
    ctx.arc(x, y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawAurora(day, cam) {
  const night = 1 - day;
  if (night < 0.42) return;
  const modeBoost = mode === "zen" ? 1 : mode === "focus" ? 0.88 : 0.8;

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  for (let i = 0; i < 5; i += 1) {
    const alpha = (0.13 + i * 0.03) * night * modeBoost;
    const baseY = h * 0.08 + i * 18 + cam.y * 0.2;
    const curve = 24 + i * 12;
    const phase = t * (1.2 + i * 0.16) + i * 1.45;
    const step = Math.max(14, Math.floor(w / 30));
    const ribbon = new Path2D();

    ribbon.moveTo(-30, h * 0.01);
    for (let x = -30; x <= w + 30; x += step) {
      const y = baseY + Math.sin(phase + x * 0.007) * curve;
      ribbon.lineTo(x + cam.x * 0.14, y);
    }
    for (let x = w + 30; x >= -30; x -= step) {
      const y = baseY + Math.sin(phase + x * 0.007) * curve + h * (0.2 + i * 0.028);
      ribbon.lineTo(x + cam.x * 0.14, y);
    }
    ribbon.closePath();

    const grad = ctx.createLinearGradient(0, baseY, w, baseY + h * 0.2);
    grad.addColorStop(0, `rgba(72,255,164,${alpha * 0.92})`);
    grad.addColorStop(0.34, `rgba(120,238,255,${alpha})`);
    grad.addColorStop(0.67, `rgba(255,128,222,${alpha * 0.9})`);
    grad.addColorStop(1, `rgba(120,110,255,${alpha * 0.55})`);

    ctx.fillStyle = grad;
    ctx.fill(ribbon);
  }

  ctx.restore();
}

function drawTerrain(day, cam) {
  const near = day > 0.4 ? "#33513f" : "#2a4234";
  const far = day > 0.4 ? "#24382d" : "#1d2d24";

  const horizon = h * 0.73;

  ctx.beginPath();
  ctx.moveTo(-20, horizon + 28 + cam.y * 0.22);
  for (let x = -20; x <= w + 20; x += 16) {
    const y = horizon + 18 + Math.sin(x * 0.005 + t * 0.8) * 16 + Math.sin(x * 0.01 + 1.8) * 10 + cam.y * 0.22;
    ctx.lineTo(x + cam.x * 0.4, y);
  }
  ctx.lineTo(w + 20, h + 20);
  ctx.lineTo(-20, h + 20);
  ctx.closePath();
  ctx.fillStyle = near;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-20, horizon + 66 + cam.y * 0.12);
  for (let x = -20; x <= w + 20; x += 20) {
    const y = horizon + 55 + Math.sin(x * 0.003 + t * 0.5 + 1.6) * 18 + Math.sin(x * 0.008 + 0.6) * 8 + cam.y * 0.12;
    ctx.lineTo(x + cam.x * 0.2, y);
  }
  ctx.lineTo(w + 20, h + 20);
  ctx.lineTo(-20, h + 20);
  ctx.closePath();
  ctx.fillStyle = far;
  ctx.fill();

  if (mode === "focus") {
    const mask = ctx.createRadialGradient(w * 0.5, h * 0.53, w * 0.08, w * 0.5, h * 0.56, w * 0.62);
    mask.addColorStop(0, "rgba(0,0,0,0)");
    mask.addColorStop(1, "rgba(0,0,0,0.52)");
    ctx.fillStyle = mask;
    ctx.fillRect(0, 0, w, h);
  }
}

function drawSnow(cam) {
  if (mode !== "zen") return;

  snow.forEach((p) => {
    p.y += p.s;
    p.x += p.d + Math.sin((p.y + t * 220) * 0.008) * 0.16;

    if (p.y > h + 8) {
      p.y = -8;
      p.x = Math.random() * w;
    }
    if (p.x < -10) p.x = w + 10;
    if (p.x > w + 10) p.x = -10;

    ctx.fillStyle = "rgba(255,255,255,0.86)";
    ctx.beginPath();
    ctx.arc(p.x + cam.x * 0.2, p.y + cam.y * 0.1, p.r, 0, Math.PI * 2);
    ctx.fill();
  });
}

function setMode(next) {
  mode = next;
  document.body.classList.toggle("zen", mode === "zen");
  document.body.classList.toggle("focus", mode === "focus");

  homeBtn.classList.toggle("active", mode === "home");
  zenBtn.classList.toggle("active", mode === "zen");
  focusBtn.classList.toggle("active", mode === "focus");
  playModeAudio();
}

function pauseAudio(audioEl) {
  if (!audioEl) return;
  audioEl.pause();
  audioEl.currentTime = 0;
}

function playModeAudio() {
  pauseAudio(audioZen);
  pauseAudio(audioFocus);

  if (!soundOn) return;

  const target = mode === "zen" ? audioZen : mode === "focus" ? audioFocus : null;
  if (!target) return;

  target.volume = 0.46;
  target.play().catch(() => {});
}

function toggleSound() {
  soundOn = !soundOn;
  soundBtn.textContent = soundOn ? "Soundscape On" : "Soundscape Off";
  soundBtn.classList.toggle("sound-off", !soundOn);
  playModeAudio();
}

function updateArc(day) {
  if (!sessionArc) return;
  if (mode === "focus") {
    sessionArc.textContent = "Deepen";
    return;
  }
  if (mode === "zen") {
    sessionArc.textContent = "Stillness";
    return;
  }
  sessionArc.textContent = day < 0.3 ? "Rest" : "Arrival";
}

function wire() {
  window.addEventListener("resize", resize);

  window.addEventListener("pointermove", (e) => {
    pointer.tx = ((e.clientX / w) - 0.5) * 2;
    pointer.ty = ((e.clientY / h) - 0.5) * 2;
  });

  window.addEventListener("pointerleave", () => {
    pointer.tx = 0;
    pointer.ty = 0;
  });

  homeBtn.addEventListener("click", () => setMode("home"));
  zenBtn.addEventListener("click", () => setMode("zen"));
  focusBtn.addEventListener("click", () => setMode("focus"));
  soundBtn.addEventListener("click", toggleSound);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMode("home");
  });
}

function frame(now) {
  const dt = Math.min(48, now - last);
  last = now;

  // Slower cycle for smoother experience.
  const speed = mode === "zen" ? 0.0000065 : mode === "focus" ? 0.000006 : 0.0000072;
  t = (t + dt * speed) % 1;

  const day = dayAmount(t);
  const cam = cameraOffset();

  drawSky(t, day, cam);
  drawSunMoon(t, day, cam);
  drawClouds(day, cam);
  drawStars(day, cam);
  drawAurora(day, cam);
  drawTerrain(day, cam);
  drawSnow(cam);

  updateArc(day);

  requestAnimationFrame(frame);
}

function boot() {
  wire();
  setMode("home");
  resize();
  requestAnimationFrame(frame);
}

boot();
