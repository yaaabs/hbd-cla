// HAPPY BIRTHDAY CLA <3

const flames = [
  document.getElementById('flame1'),
  document.getElementById('flame2'),
  document.getElementById('flame3')
];
const statusText = document.getElementById('status');
const volumeBar = document.getElementById('volumeBar');
const music = document.getElementById('hbdMusic');
const musicControl = document.getElementById('musicControl');
const heartsContainer = document.getElementById('heartsContainer');
let isBlown = false;
let heartTimer = null;

// Hearts animations
function createHeart() {
  const heart = document.createElement('div');
  heart.classList.add('heart');
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.animationDuration = `${Math.random() * 3 + 3}s`;
  heart.style.opacity = Math.random() * 0.5 + 0.3;
  heart.style.width = heart.style.height = `${Math.random() * 20 + 15}px`;
  
  // Random heart color
  const colors = ['#ff6b8b', '#ff8aa0', '#ff9eb7', '#ffb3c6'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  heart.style.backgroundColor = color;
  heart.style.setProperty('--heart-color', color);
  
  heartsContainer.appendChild(heart);
  
  // Remove heart after animation completes
  setTimeout(() => {
    heart.remove();
  }, 6000);
}

// Periodically create hearts
function startHearts() {
  if (heartTimer) clearInterval(heartTimer);
  heartTimer = setInterval(() => {
    createHeart();
  }, 300);
}

// Start a few hearts immediately
for (let i = 0; i < 5; i++) {
  setTimeout(() => {
    createHeart();
  }, i * 300);
}

// Music control functionality
let isMusicPlaying = false;
musicControl.addEventListener('click', () => {
  if (isMusicPlaying) {
    music.pause();
    musicControl.textContent = '🔇'; // Mute icon
    musicControl.style.background = '#dc3545'; // Dark red for muted
    musicControl.style.color = '#fff';
    musicControl.dataset.playing = 'false';
  } else {
    music.play();
    musicControl.textContent = '🎵'; // Music icon
    musicControl.style.background = 'var(--primary-color)'; // Use theme pink color
    musicControl.style.color = '#fff';
    musicControl.dataset.playing = 'true';
  }
  isMusicPlaying = !isMusicPlaying;
});

// Auto play music on first interaction
document.addEventListener('click', () => {
  if (!isMusicPlaying && music.paused) {
    music.play();
    musicControl.textContent = '🎵';
    musicControl.style.background = 'var(--primary-color)';
    musicControl.style.color = '#fff';
    musicControl.dataset.playing = 'true';
    isMusicPlaying = true;
  }
}, { once: true });

// Advanced confetti effect
function triggerConfetti() {
  // First burst - center
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
  
  // Side bursts
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.5 }
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.5 }
    });
  }, 750);
  
  // Delayed shower
  setTimeout(() => {
    const end = Date.now() + 3000;
    
    const colors = ['#ff6b8b', '#ffb340', '#7c4dff'];
    
    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });
      
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }, 1500);
}

// Implement microphone access and blow detection
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    source.connect(analyser);

    function checkVolume() {
      analyser.getByteFrequencyData(dataArray);
      let volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      
      // Update volume indicator
      volumeBar.style.width = `${Math.min(volume * 1.5, 100)}%`;

      if (volume > 50 && !isBlown) {
        isBlown = true;
        
        // Hide all flames
        flames.forEach(flame => {
          flame.style.display = 'none';
        });
        
        // Update status with animation
        statusText.textContent = "🎉 Wish granted! Happy Birthday! 🎉";
        statusText.classList.add('wish-granted');
        
        // Trigger confetti and start hearts animation
        triggerConfetti();
        startHearts();
        
        // If music isn't already playing, start it
        if (!isMusicPlaying) {
          music.play();
          musicControl.textContent = '🎵';
          musicControl.style.background = 'var(--primary-color)';
          musicControl.style.color = '#fff';
          musicControl.dataset.playing = 'true';
          isMusicPlaying = true;
        }
      }
      
      if (!isBlown) {
        requestAnimationFrame(checkVolume);
      }
    }

    checkVolume();
  })
  .catch(err => {
    console.error('Mic access denied', err);
    statusText.textContent = "Please allow microphone access to blow the candles! 🎤";
    
    // Provide fallback for when microphone access is denied
    document.querySelector('.cake-container').addEventListener('click', () => {
      if (!isBlown) {
        isBlown = true;
        
        // Hide all flames
        flames.forEach(flame => {
          flame.style.display = 'none';
        });
        
        // Update status with animation
        statusText.textContent = "🎉 Wish granted! Happy Birthday! 🎉";
        statusText.classList.add('wish-granted');
        
        // Trigger confetti and start hearts animation
        triggerConfetti();
        startHearts();
        
        // If music isn't already playing, start it
        if (!isMusicPlaying) {
          music.play();
          musicControl.textContent = '🎵';
          musicControl.style.background = 'var(--primary-color)';
          musicControl.style.color = '#fff';
          musicControl.dataset.playing = 'true';
          isMusicPlaying = true;
        }
      }
    });
  });
