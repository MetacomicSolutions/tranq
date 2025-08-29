// ===================== ALARM LOGIC =====================

// Grab alarm-related elements
const timeInput = document.getElementById('alarm-time');
const setBtn = document.getElementById('alarm-setBtn');
const cancelBtn = document.getElementById('alarm-cancelBtn');
const statusEl = document.getElementById('alarm-status');

let fireTimeout = null; // reference to scheduled timeout
let targetTs = null;    // timestamp when alarm will fire

// Schedule the alarm
function schedule(){
  if(!timeInput.value){ 
    statusEl.textContent = 'Pick a time!'; 
    return; 
  }

  // Parse input as hours, minutes, optional seconds
  const [hh, mm, ss='0'] = timeInput.value.split(':').map(Number);

  const now = new Date();
  const target = new Date();

  // Set target to selected time today
  target.setHours(hh, mm, ss, 0);

  // If target already passed, push to tomorrow
  if(target <= now) target.setDate(target.getDate()+1);

  targetTs = target.getTime();

  // How long until alarm should fire
  const ms = targetTs - Date.now();

  // At alarm time → reload page
  fireTimeout = setTimeout(()=>location.reload(), ms);

  statusEl.textContent = `Alarm set for ${target.toLocaleTimeString()}`;

  // Disable "Set" button, enable "Cancel"
  setBtn.disabled = true;
  cancelBtn.disabled = false;
}

// Cancel the alarm
function cancel(){
  clearTimeout(fireTimeout);
  targetTs = null;
  statusEl.textContent = 'Alarm canceled.';
  setBtn.disabled = false;
  cancelBtn.disabled = true;
}

// Wire up buttons
setBtn.addEventListener('click', schedule);
cancelBtn.addEventListener('click', cancel);


// ===================== BACKDROP POPUP =====================

const backdrop = document.getElementById("backdrop");
const showBtn = document.getElementById("show-backdrop");
const dismissBtn = document.getElementById("dismiss-btn");

// Show backdrop
showBtn.addEventListener("click", (e) => {
  e.preventDefault();
  backdrop.style.display = "flex";
});

// Hide backdrop via button
dismissBtn.addEventListener("click", () => {
  backdrop.style.display = "none";
});

// Optional: click outside content to close
backdrop.addEventListener("click", (e) => {
  if (e.target === backdrop) {
    backdrop.style.display = "none";
  }
});


// ===================== CORNER ICON OVERLAYS =====================

document.querySelectorAll(".corner-icon").forEach(icon => {
  icon.addEventListener("click", (e) => {
    e.preventDefault();

    // Get overlay ID from data attribute
    const targetId = icon.getAttribute("data-overlay");
    const overlay = document.getElementById(targetId);

    if (overlay) {
      overlay.classList.add("active");

      // Remove overlay when clicked once
      overlay.addEventListener("click", () => {
        overlay.classList.remove("active");
      }, { once: true });
    }
  });
});


// ===================== FAVORITES STORAGE =====================

document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "favorites";

  // Load saved favorites from localStorage
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

  // For each sound control with favorite button
  document.querySelectorAll(".soundControl").forEach(control => {
    const btn = control.querySelector(".favorite-btn");
    const id = control.id; // must exist for persistence

    // Restore saved favorites visually
    if (saved.includes(id)) {
      btn.classList.add("favorited");
    }

    // Toggle on click
    btn.addEventListener("click", () => {
      btn.classList.toggle("favorited");

      // Save all currently favorited items
      const newFavs = Array.from(document.querySelectorAll(".favorite-btn.favorited"))
        .map(b => b.closest(".soundControl").id);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavs));
    });
  });
});


// ===================== GLOW CIRCLE =====================

const circle = document.querySelector('.circle');

// Trigger glow animation once
circle.classList.add('glow');

// When animation ends, reset so it can glow again later
circle.addEventListener('animationend', () => {
  circle.classList.remove('glow');
});


// ===================== AUDIO VISUALIZER =====================

const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

// Make canvas fullscreen
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Web Audio setup
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 256;

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// Connect analyser to all <audio> players
document.querySelectorAll(".audioPlayer").forEach(audio => {
  const src = audioCtx.createMediaElementSource(audio);
  src.connect(analyser);
  src.connect(audioCtx.destination);
});

// Draw audio bars
function draw() {
  requestAnimationFrame(draw);
  analyser.getByteFrequencyData(dataArray);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const barWidth = (canvas.width / bufferLength) * 2.5;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i] * 1.2;

    // Random-ish color variation
    const r = 50 + (i * 2);
    const g = 200 - (i * 2);
    const b = 150 + (i % 50);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

    x += barWidth + 1;
  }
}

draw();

// Required by browsers: resume audio context after user gesture
document.body.addEventListener("click", () => {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
});

// ===================== INTERACTIVE CIRCLE (SWIPE/CLICK) =====================

document.addEventListener('DOMContentLoaded', () => {
  const circleEl = document.getElementById('circle');
  if (!circleEl) return;

  // One-time delayed glow (2s after load)
  const delayMs = 2000; 
  setTimeout(() => {
    circleEl.classList.add('glow');
  }, delayMs);

  // Reset after glow animation ends
  circleEl.addEventListener('animationend', (e) => {
    if (e.animationName === 'glowPulse') {
      circleEl.classList.remove('glow');
    }
  });

  // Click → expand/collapse
  let startY = 0;
  let isDragging = false;
  let didSwipe = false;

  circleEl.addEventListener('click', () => {
    if (didSwipe) {
      // Skip this click because it followed a swipe
      didSwipe = false; 
      return;
    }
    circleEl.classList.toggle('expanded');
  });

  // Swipe up to expand
  circleEl.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
    isDragging = true;
  }, { passive: true });

  circleEl.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    if (startY - currentY > 50) { // swipe up threshold
      circleEl.classList.add('expanded');
      isDragging = false;
      didSwipe = true;

      // Prevent the "ghost click" from happening
      e.preventDefault();
    }
  });

  circleEl.addEventListener('touchend', () => {
    isDragging = false;
  });
});


// ===================== SERVICE WORKER =====================

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(reg => console.log('Service Worker registered', reg))
    .catch(err => console.error('Service Worker registration failed:', err));
}


// ===================== AUDIO CONTROLS =====================

// Start all audio muted and attempt autoplay
document.querySelectorAll('.audioPlayer').forEach(audio => {
  audio.volume = 0;
  audio.play().catch(e => console.warn('Autoplay failed:', e));
});

// Connect sliders to volumes
document.querySelectorAll('.volumeControl').forEach(slider => {
  slider.addEventListener('input', () => {
    const index = slider.dataset.index;
    const audio = document.querySelector(`.audioPlayer[data-index="${index}"]`);
    if (audio) {
      audio.volume = slider.value;
    }
  });
});
