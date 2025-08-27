
   
    const timeInput = document.getElementById('alarm-time');
    const setBtn = document.getElementById('alarm-setBtn');
    const cancelBtn = document.getElementById('alarm-cancelBtn');
    const statusEl = document.getElementById('alarm-status');

    let fireTimeout = null;
    let targetTs = null;

    function schedule(){
      if(!timeInput.value){ 
        statusEl.textContent = 'Pick a time!'; 
        return; 
      }
      const [hh, mm, ss='0'] = timeInput.value.split(':').map(Number);
      const now = new Date();
      const target = new Date();
      target.setHours(hh, mm, ss, 0);
      if(target <= now) target.setDate(target.getDate()+1);
      targetTs = target.getTime();
      const ms = targetTs - Date.now();
      fireTimeout = setTimeout(()=>location.reload(), ms);
      statusEl.textContent = `Alarm set for ${target.toLocaleTimeString()}`;
      setBtn.disabled = true;
      cancelBtn.disabled = false;
    }

    function cancel(){
      clearTimeout(fireTimeout);
      targetTs = null;
      statusEl.textContent = 'Alarm canceled.';
      setBtn.disabled = false;
      cancelBtn.disabled = true;
    }

    setBtn.addEventListener('click', schedule);
    cancelBtn.addEventListener('click', cancel);
  


  
    const backdrop = document.getElementById("backdrop");
    const showBtn = document.getElementById("show-backdrop");
    const dismissBtn = document.getElementById("dismiss-btn");

    showBtn.addEventListener("click", (e) => {
      e.preventDefault();
      backdrop.style.display = "flex";
    });

    dismissBtn.addEventListener("click", () => {
      backdrop.style.display = "none";
    });

    // Optional: click outside to close
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        backdrop.style.display = "none";
      }
    });
  


document.querySelectorAll(".corner-icon").forEach(icon => {
  icon.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = icon.getAttribute("data-overlay");
    const overlay = document.getElementById(targetId);

    if (overlay) {
      overlay.classList.add("active");

      // Hide overlay when clicked
      overlay.addEventListener("click", () => {
        overlay.classList.remove("active");
      }, { once: true });
    }
  });
});




document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "favorites";

  // Load saved favorites
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

  // Initialize all sound controls
  document.querySelectorAll(".soundControl").forEach(control => {
    const btn = control.querySelector(".favorite-btn");
    const id = control.id; // must exist!

    if (saved.includes(id)) {
      btn.classList.add("favorited");
    }

    btn.addEventListener("click", () => {
      btn.classList.toggle("favorited");

      const newFavs = Array.from(document.querySelectorAll(".favorite-btn.favorited"))
        .map(b => b.closest(".soundControl").id);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavs));
    });
  });
});





  const circle = document.querySelector('.circle');
circle.classList.add('glow');
circle.addEventListener('animationend', () => {
  circle.classList.remove('glow'); // reset so it can glow again later
});




  const canvas = document.getElementById("visualizer");
  const ctx = canvas.getContext("2d");

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

  // Connect all <audio> elements
  document.querySelectorAll(".audioPlayer").forEach(audio => {
    const src = audioCtx.createMediaElementSource(audio);
    src.connect(analyser);
    src.connect(audioCtx.destination);
  });

  function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i] * 1.2;

      const r = 50 + (i * 2);
      const g = 200 - (i * 2);
      const b = 150 + (i % 50);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    }
  }

  draw();

  // Resume audio context on user gesture (required by browsers)
  document.body.addEventListener("click", () => {
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  });


document.addEventListener('DOMContentLoaded', () => {
  const circleEl = document.getElementById('circle');
  if (!circleEl) return;

  // --- One-time delayed glow (2s) ---
  // If your CSS already has "animation-delay: 2s" on .circle.glow, set delayMs = 0.
  const delayMs = 2000; 
  setTimeout(() => {
    circleEl.classList.add('glow');
  }, delayMs);

  circleEl.addEventListener('animationend', (e) => {
    if (e.animationName === 'glowPulse') {
      circleEl.classList.remove('glow'); // reset so it can glow again later
    }
  });

  // --- Click to expand/collapse ---
  let startY = 0;
  let isDragging = false;
  let didSwipe = false;

  circleEl.addEventListener('click', () => {
    if (didSwipe) { 
      // Prevent click toggle right after a swipe
      didSwipe = false; 
      return; 
    }
    circleEl.classList.toggle('expanded');
  });

  // --- Swipe up to expand ---
  circleEl.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
    isDragging = true;
    didSwipe = false;
  }, { passive: true });

  circleEl.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    if (startY - currentY > 50) {
      circleEl.classList.add('expanded');
      isDragging = false;
      didSwipe = true;
    }
  }, { passive: true });

  circleEl.addEventListener('touchend', () => {
    isDragging = false;
  });
});



 
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js')
        .then(reg => console.log('Service Worker registered', reg))
        .catch(err => console.error('Service Worker registration failed:', err));
    }
  



  
    document.querySelectorAll('.audioPlayer').forEach(audio => {
      audio.volume = 0;
      audio.play().catch(e => console.warn('Autoplay failed:', e));
    });

    document.querySelectorAll('.volumeControl').forEach(slider => {
      slider.addEventListener('input', () => {
        const index = slider.dataset.index;
        const audio = document.querySelector(`.audioPlayer[data-index="${index}"]`);
        if (audio) {
          audio.volume = slider.value;
        }
      });
    });
  