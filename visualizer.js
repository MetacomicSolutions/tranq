
<!--

 Add this inside <body>, ideally at the end
<script>
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
</script>
-->
