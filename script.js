// ================= CANVAS SETUP =================

const canvas = document.getElementById("world");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

let time = 0;
let zen = false;
let focus = false;
let soundOn = true;

// ================= STARS =================

const stars = Array.from({ length: 200 }, () => ({
  x: Math.random(),
  y: Math.random() * 0.7,
  phase: Math.random() * Math.PI * 2,
}));

// ================= SNOW =================

let snowCount = 150;
let snow = [];

function generateSnow() {
  snow = Array.from({ length: snowCount }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    speed: Math.random() * 1 + 0.5,
  }));
}
generateSnow();

const snowSlider = document.getElementById("snowSlider");
if (snowSlider) {
  snowSlider.addEventListener("input", (e) => {
    snowCount = +e.target.value;
    generateSnow();
  });
}

// ================= SKY =================

function drawSky() {
  const cycle = time % 1;
  let g = ctx.createLinearGradient(0, 0, 0, canvas.height);

  if (cycle < 0.25) {
    // Sunrise
    g.addColorStop(0, "#ffcc88");
    g.addColorStop(1, "#87ceeb");
  } else if (cycle < 0.5) {
    // Day
    g.addColorStop(0, "#87ceeb");
    g.addColorStop(1, "#fefcea");
  } else if (cycle < 0.75) {
    // Sunset
    g.addColorStop(0, "#ff9966");
    g.addColorStop(1, "#2c3e50");
  } else {
    // Night
    g.addColorStop(0, "#0f2027");
    g.addColorStop(1, "#203a43");
  }

  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ================= SUN + MOON =================

function drawSunMoon() {
  const cycle = time % 1;
  const x = cycle * canvas.width;
  const y = canvas.height * 0.6 - Math.sin(cycle * Math.PI) * 200;

  ctx.beginPath();
  ctx.arc(x, y, 50, 0, Math.PI * 2);

  if (cycle < 0.75) {
    // Sun
    ctx.fillStyle = "#FFD700";
    ctx.shadowBlur = 40;
    ctx.shadowColor = "#FFD700";
  } else {
    // Moon
    ctx.fillStyle = "#f5f3ce";
    ctx.shadowBlur = 30;
    ctx.shadowColor = "#ffffff";
  }

  ctx.fill();
  ctx.shadowBlur = 0;
}

// ================= STARS =================

function drawStars() {
  if (time % 1 > 0.75) {
    stars.forEach((s) => {
      const alpha = 0.5 + Math.sin(time * 20 + s.phase) * 0.5;
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(s.x * canvas.width, s.y * canvas.height, 2, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}

// ================= AURORA =================

function drawAurora() {
  if (time % 1 > 0.75) {
    const wave = Math.sin(time * 10) * 20;
    ctx.fillStyle = "rgba(0,255,180,0.05)";
    ctx.fillRect(0, wave, canvas.width, canvas.height);
  }
}

// ================= SHOOTING STAR =================

function drawShootingStar() {
  if (Math.random() < 0.002 && time % 1 > 0.75) {
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(Math.random() * canvas.width, 0);
    ctx.lineTo(Math.random() * canvas.width + 200, 200);
    ctx.stroke();
  }
}

// ================= SNOW =================

function drawSnow() {
  if (!zen) return;

  snow.forEach((p) => {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fill();

    p.y += p.speed;
    if (p.y > canvas.height) p.y = 0;
  });
}

// ================= MAIN LOOP =================

function loop() {
  time += zen ? 0.0006 : 0.0002;

  drawSky();
  drawSunMoon();
  drawStars();
  drawAurora();
  drawShootingStar();
  drawSnow();

  requestAnimationFrame(loop);
}
loop();

// ================= AUDIO SYSTEM =================

const audioDay = document.getElementById("audioDay");
const audioZen = document.getElementById("audioZen");
const audioFocus = document.getElementById("audioFocus");

let currentAudio = null;

function switchAudio(targetAudio) {
  if (currentAudio && currentAudio !== targetAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  currentAudio = targetAudio;

  if (soundOn) {
    targetAudio.volume = 0.4;
    targetAudio.play().catch(() => {});
  }
}

// ================= BUTTONS =================

const zenBtn = document.getElementById("zenBtn");
const focusBtn = document.getElementById("focusBtn");
const soundBtn = document.getElementById("soundBtn");

if (zenBtn) {
  zenBtn.addEventListener("click", () => {
    zen = !zen;
    focus = false;

    document.body.classList.toggle("zen", zen);
    document.body.classList.remove("focus");

    zenBtn.textContent = zen ? "Exit Zen" : "Enter Zen";
    if (focusBtn) focusBtn.style.display = zen ? "none" : "inline-block";

    if (zen) {
      switchAudio(audioZen);
    } else {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      currentAudio = null;
    }
  });
}

if (focusBtn) {
  focusBtn.addEventListener("click", () => {
    focus = !focus;
    zen = false;

    document.body.classList.toggle("focus", focus);
    document.body.classList.remove("zen");

    focusBtn.textContent = focus ? "Exit Focus" : "Focus Mode";
    if (zenBtn) zenBtn.style.display = focus ? "none" : "inline-block";

    if (focus) {
      switchAudio(audioFocus);
    } else {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      currentAudio = null;
    }
  });
}

if (soundBtn) {
  soundBtn.addEventListener("click", () => {
    soundOn = !soundOn;
    soundBtn.textContent = soundOn ? "Soundscape On" : "Soundscape Off";

    // If turning OFF
    if (!soundOn) {
      if (currentAudio) {
        currentAudio.pause();
      }
      return;
    }

    // If turning ON
    if (!currentAudio) {
      // Start Day audio if nothing playing
      currentAudio = audioDay;
    }

    currentAudio.volume = 0.4;
    currentAudio.play().catch(() => {});
  });
}

// function generateBookmarklet() {
//   const code = `
//     (function(){
//       function f(o){
//         const r=/^[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+$/;
//         for(let k in o){
//           try{
//             let v=o[k];
//             if(typeof v==='string' && r.test(v)) return v;
//           }catch(e){}
//         }
//         return null;
//       }
//       let t=f(localStorage)||f(sessionStorage);
//       if(t){navigator.clipboard.writeText(t);}
//     })();
//   `;

//   return "javascript:" + code.replace(/\n/g, "");
// }

// document.getElementById("bookmarklet").href = generateBookmarklet();
