document.addEventListener('DOMContentLoaded', function() {
  
  const CONFIG = {
    selectors: {
      body: 'body',
      enter: '.dyEnter',
      player: '.dyPlayer',
      bgVideo: '.dyBg',
      overlay: '.dyOverlay',
      fireworks: '.fireworks',
      profile: '.dyProfile',
      canvas: '#c',
      wrap: '.dyWrap',
      bio: '.bio',
      dev: '.dev'
    },
    assets: {
      eyeClose: 'assets/img/eye-close.svg',
      eyeOpen: 'assets/img/eye-open.svg',
      pfp: 'assets/img/pfp.webp',
      devIcon: 'assets/img/dev.png',
      hacker: 'assets/img/hacker.png',
      audio: 'assets/media/audio.mp3',
      devAudio: 'assets/media/dev.mp3',
      video: 'assets/media/src.mp4',
      config: 'assets/config.json'
    },
    animations: {
      magnetDistance: 110,
      magnetScale: 1.3,
      magnetSpeed: 0.5,
      resetSpeed: 0.6
    }
  };

  initializePage();
  
  function initializePage() {
    createPageElements();
    loadConfiguration();
    setupEventListeners();
    setupResponsiveFeatures();
  }

  function createPageElements() {
    const elements = `
      <div class="dyEnter">
        <img src="${CONFIG.assets.eyeClose}" alt="Enter">
      </div>
      <audio src="${CONFIG.assets.audio}" class="dyPlayer" loop></audio>
      <video class="dyBg" autoplay muted loop id="bgvid">
        <source src="${CONFIG.assets.video}" type="video/mp4">
      </video>
      <div class="dyOverlay"></div>
      <canvas class="fireworks"></canvas>
      <div class="dyProfile">
        <img src="${CONFIG.assets.pfp}" alt="Profile">
        <div class="name">
          defend 
          <img class="dev" src="${CONFIG.assets.devIcon}" title="sick!" alt="Dev">
        </div>
        <div class="bio">ddddddddddddddddddddd</div>
      </div>
      <canvas id="c"></canvas>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', elements);
  }

  async function loadConfiguration() {
    try {
      const response = await fetch(CONFIG.assets.config);
      const data = await response.json();
      
      const { profile, config } = data;
      const socials = profile[0].socials;
      
      setupSocialLinks(socials, config);
      
    } catch (error) {
      console.error('Failed to load configuration:', error);
    }
  }

  function setupSocialLinks(socials, config) {
    Object.entries(socials).forEach(([key, value], index) => {
      const childElement = document.querySelector('.dyWrap').children[index];
      if (!childElement) return;

      if (!value) return;

      const platformConfig = config.platforms[key];
      if (platformConfig && platformConfig.icon) {
        childElement.style.backgroundImage = `url(${platformConfig.icon})`;
      } else {
        childElement.style.backgroundImage = `url(assets/img/platforms/${key}.webp)`;
      }
      
      childElement.addEventListener('mouseenter', () => {
        childElement.style.transform = 'scale(1.1)';
      });
      
      childElement.addEventListener('mouseleave', () => {
        childElement.style.transform = 'scale(1)';
      });
      
      const url = platformConfig.link + value;
      childElement.addEventListener('click', () => {
        window.open(url, '_blank');
      });
    });
  }

  function setupEventListeners() {
    document.querySelectorAll('img').forEach(img => {
      img.addEventListener('dragstart', e => e.preventDefault());
    });

    document.addEventListener('visibilitychange', () => {
      document.title = document.hidden 
        ? "where do you think you're going?" 
        : "defend ,(^ᴗ^)ゞ";
    });

    const enterButton = document.querySelector('.dyEnter img');
    if (enterButton) {
      enterButton.addEventListener('click', handleEnterClick);
      enterButton.addEventListener('mouseenter', handleEnterHover);
      enterButton.addEventListener('mouseleave', handleEnterLeave);
    }

    const devElement = document.querySelector('.dev');
    if (devElement) {
      devElement.addEventListener('click', handleDevClick);
    }
  }

  function handleEnterClick() {
        const enterElement = document.querySelector('.dyEnter');
        const profileElement = document.querySelector('.dyProfile');
        const wrapElement = document.querySelector('.dyWrap');
        const playerElement = document.querySelector('.dyPlayer');
        const bgVideo = document.querySelector('.dyBg');

        enterElement.style.display = 'none';
        profileElement.style.animation = 'dyEnter 2s ease-in-out forwards';
        wrapElement.style.animation = 'dyEnter 2s ease-in-out forwards';
        
        const playPromises = [playerElement.play(), bgVideo.play()];
        
        Promise.all(playPromises).then(() => {
            syncAudioVideo(playerElement, bgVideo);
        }).catch(error => {
            console.error('Error playing media:', error);
        });
    }

      function syncAudioVideo(audioElement, videoElement) {
    setTimeout(() => {
      const syncInterval = setInterval(() => {
        if (!audioElement.paused && !videoElement.paused) {
          const timeDiff = Math.abs(audioElement.currentTime - videoElement.currentTime);
          
          if (timeDiff > 0.5) {
            audioElement.currentTime = videoElement.currentTime;
          }
        }
      }, 2000);

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          clearInterval(syncInterval);
        }
      });
    }, 1000);
  }

  function handleEnterHover() {
    const enterElement = document.querySelector('.dyEnter');
    const img = enterElement.querySelector('img');
    
    enterElement.style.backdropFilter = 'blur(40px)';
    img.src = CONFIG.assets.eyeOpen;
  }

  function handleEnterLeave() {
    const enterElement = document.querySelector('.dyEnter');
    const img = enterElement.querySelector('img');
    
    enterElement.style.backdropFilter = 'blur(50px)';
    img.src = CONFIG.assets.eyeClose;
  }

  let devClicked = false;
             function handleDevClick() {
         if (devClicked) return;

         devClicked = true;
         runMatrix();

         const bgVideo = document.querySelector('.dyBg');
         const player = document.querySelector('.dyPlayer');
         const profileImg = document.querySelector('.dyProfile img');

         bgVideo.style.display = 'none';
         player.src = CONFIG.assets.devAudio;
         player.play().catch(error => {
             console.error('Error playing dev audio:', error);
         });
         
         profileImg.src = CONFIG.assets.hacker;
     }

  function setupResponsiveFeatures() {
    if (window.innerWidth > 1024) {
      setupTextScramble();
      setupMagnetAnimation();
      setupMagicMouse();
    }
  }

  function setupTextScramble() {
    const bioElement = document.querySelector('.bio');
    if (!bioElement) return;

    const originalText = bioElement.textContent;
    let interval;

    const scrambleText = (text) => {
      const chars = '@$%><~*CWY%@*ZXCQY=+'.split('');
      return text
        .split('')
        .map(char => Math.random() > 0.2 ? chars[Math.floor(Math.random() * chars.length)] : char)
        .join('');
    };

    bioElement.addEventListener('mouseenter', () => {
      interval = setInterval(() => {
        bioElement.textContent = scrambleText(originalText);
      }, 100);
    });

    bioElement.addEventListener('mouseleave', () => {
      clearInterval(interval);
      bioElement.textContent = originalText;
    });
  }

  function setupMagnetAnimation() {
    const elements = document.querySelectorAll('.dyItem');
    
    elements.forEach(element => {
      document.addEventListener('mousemove', (e) => magnetize(element, e));
      document.addEventListener('touchmove', (e) => magnetize(element, e));
    });
  }

  function magnetize(element, event) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    
    const deltaX = (centerX - mouseX) * -0.45;
    const deltaY = (centerY - mouseY) * -0.45;
    
    const distance = Math.sqrt(
      Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
    );
    
    const customDist = element.dataset.dist * 20 || CONFIG.animations.magnetDistance;
    
    if (distance < customDist) {
      element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${CONFIG.animations.magnetScale})`;
      element.classList.add('magnet');
    } else {
      element.style.transform = 'translate(0, 0) scale(1)';
      element.classList.remove('magnet');
    }
  }

  function setupMagicMouse() {
    if (typeof magicMouse === 'function') {
      magicMouse({
        hoverEffect: "circle-move",
        hoverItemMove: true,
        defaultCursor: false,
        outerWidth: 40,
        outerHeight: 40
      });
    }
  }

  function runMatrix() {
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    
    const matrix = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}".split("");
    const fontSize = 12;
    const columns = canvas.width / fontSize;
    const drops = new Array(Math.floor(columns)).fill(1);
    
    function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ff00";
      ctx.font = `${fontSize}px arial`;
      drops.forEach((drop, i) => {
        const text = matrix[Math.floor(Math.random() * matrix.length)];
        ctx.fillText(text, i * fontSize, drop * fontSize);
        if (drop * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      });
    }
    
    setInterval(draw, 35);
  }
}); 
