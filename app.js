const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const container = document.getElementById("sliders-container");

const NUM_SOUNDS = 40;
const sliders = [];

async function loadSound(index) {
  const response = await fetch(`sounds/sound${index + 1}.mp3`);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.loop = true;

  const gainNode = audioContext.createGain();
  gainNode.gain.value = 0.5; // Default volume

  source.connect(gainNode).connect(audioContext.destination);
  source.start();

  return gainNode;
}

async function init() {
  for (let i = 0; i < NUM_SOUNDS; i++) {
    const gainNode = await loadSound(i);

    // Create slider UI
    const wrapper = document.createElement("div");
    wrapper.classList.add("slider-wrapper");

    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = 0;
    slider.max = 100;
    slider.value = 50; // Default to mid-volume
    slider.addEventListener("input", () => {
      gainNode.gain.value = slider.value / 100;
    });

    wrapper.appendChild(slider);
    container.appendChild(wrapper);
    sliders.push(slider);
  }
}

window.addEventListener("click", () => {
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
});

init();
