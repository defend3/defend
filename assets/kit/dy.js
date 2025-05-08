// load
$(document).ready(function () {

    $('body').prepend(`
      <div class="dyEnter"><img src="assets/img/eye-close.svg"></div>
      <audio src="assets/media/audio.mp3" class="dyPlayer" loop></audio>
      <video class="dyBg" autoplay muted loop id="bgvid"><source src="assets/media/src.mp4" type="video/mp4"></video>
      <div class="dyOverlay"></div>
      <canvas class="fireworks"></canvas>
      <div class="dyProfile">
        <img src="assets/img/pfp.webp">
        <div class="name">dy <img class="dev" src="assets/img/dev.png" title="sick!"></div>
        <div class="bio">ddddddddddddddddddddd</div>
      </div>
      <canvas id="c"></canvas>
    `);
  
    // fetch
    $.ajax({
      type: "GET",
      url: "assets/config.json",
      dataType: "json",
      success: function (data) {
  
        // if (window.location.hostname !== "defend.wtf") {
        //   window.location.replace("https://defend.wtf");
        // }
  
        var profile = data.profile;
        var config = data.config;
        var socials = profile[0].socials;
  
        $.each(Object.entries(socials), function (index, entry) {
          var key = entry[0];
          var value = entry[1];
  
          console.log("Index:", index);
          console.log("Key:", key);
          console.log("Value:", value);
  
  
          var $child = $('.dyWrap').children().eq(index)[0];
          console.log("Child element:", $child);
  
          $($child).css({'background-image': 'url(assets/img/platforms/' + key + '.webp)'});
  
          $($child).on('mouseover', function () {
            $($child).css({'transform': 'scale(1.1)'});
          });
  
          var url = config.platforms[key].link+value;
  
          $($child).click(function () {
            window.open(url, '_blank');
          });
  
        });
  
      }
    });
  
  
    // dy attract
    function magnetAni() {
  
      var cerchio = document.querySelectorAll('.dyItem');
  
      cerchio.forEach(function (elem) {
        console.log(elem)
        $(document).on('mousemove touch', function (e) {
          magnetize(elem, e);
        });
      })
  
      $(document).on('mousemove touch', function(e){
        magnetize('.cerchio', e);
      });
  
      function magnetize(el, e) {
        var mX = e.pageX,
          mY = e.pageY;
        const item = $(el);
  
        const customDist = item.data('dist') * 20 || 110;
        const centerX = item.offset().left + (item.width() / 2);
        const centerY = item.offset().top + (item.height() / 2);
  
        var deltaX = Math.floor((centerX - mX)) * -0.45;
        var deltaY = Math.floor((centerY - mY)) * -0.45;
  
        var distance = calculateDistance(item, mX, mY);
  
        if (distance < customDist) {
          TweenMax.to(item, 0.5, { y: deltaY, x: deltaX, scale: 1.3 });
          item.addClass('magnet');
        }
        else {
          TweenMax.to(item, 0.6, { y: 0, x: 0, scale: 1 });
          item.removeClass('magnet');
        }
      }
  
      function calculateDistance(elem, mouseX, mouseY) {
        return Math.floor(Math.sqrt(Math.pow(mouseX - (elem.offset().left + (elem.width() / 2)), 2) + Math.pow(mouseY - (elem.offset().top + (elem.height() / 2)), 2)));
      }
  
    }
  
  
  
  
  
  
    // magic mouse
    function magicMouseExec() {
      function calculateDistance(elem, mouseX, mouseY) {
        return Math.floor(Math.sqrt(Math.pow(mouseX - (elem.offset().left + (elem.width() / 2)), 2) + Math.pow(mouseY - (elem.offset().top + (elem.height() / 2)), 2)));
      }
  
      options = {
        "hoverEffect": "circle-move",
        "hoverItemMove": true,
        "defaultCursor": false,
        "outerWidth": 40,
        "outerHeight": 40
      };
  
      magicMouse(options);
  
    } magicMouseExec();
  
  
    // image drag disable
    $('img').on('dragstart', function (event) { event.preventDefault(); });
  
  
    // change bg on click (pfp)
  
  
    // text scramble
    function textScramble() {
  
      let interval
  
      const element = document.querySelector('.bio')
      const originalText = element.innerText
  
      const randomInt = max => Math.floor(Math.random() * max)
      const randomFromArray = array => array[randomInt(array.length)]
  
      const scrambleText = text => {
        const chars = '@$%><~*CWY%@*ZXCQY=+'.split('')
        return text
          .split('')
          .map(x => randomInt(5) > 1 ? randomFromArray(chars) : x)
          .join('')
      }
  
      element.addEventListener('mouseover', () => {
        interval = setInterval(() =>
          element.innerText = scrambleText(originalText)
          , 100)
      })
  
      element.addEventListener('mouseout', () => {
        clearInterval(interval)
        element.innerText = originalText
      })
  
    }
  
  
    // for desktop
    if ($(window).width() > 1024) {
  
      textScramble();
      magnetAni();
  
    } else {
      // for tablet and mobile
    }
  
    // click effect
    var anicolors = ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C'];
    function clickEffect() {
  
      var canvasEl = document.querySelector('.fireworks');
      var ctx = canvasEl.getContext('2d');
      var numberOfParticules = 30;
      var pointerX = 0;
      var pointerY = 0;
      var tap = ('ontouchstart' in window || navigator.msMaxTouchPoints) ? 'touchstart' : 'mousedown';
  
  
      function setCanvasSize() {
        canvasEl.width = window.innerWidth * 2;
        canvasEl.height = window.innerHeight * 2;
        canvasEl.style.width = window.innerWidth + 'px';
        canvasEl.style.height = window.innerHeight + 'px';
        canvasEl.getContext('2d').scale(2, 2);
      }
  
      function updateCoords(e) {
        pointerX = e.clientX || e.touches[0].clientX;
        pointerY = e.clientY || e.touches[0].clientY;
      }
  
      function setParticuleDirection(p) {
        var angle = anime.random(0, 360) * Math.PI / 180;
        var value = anime.random(50, 180);
        var radius = [-1, 1][anime.random(0, 1)] * value;
        return {
          x: p.x + radius * Math.cos(angle),
          y: p.y + radius * Math.sin(angle)
        }
      }
  
      function createParticule(x, y) {
        var p = {};
        p.x = x;
        p.y = y;
        p.color = anicolors[anime.random(0, anicolors.length - 1)];
        p.radius = anime.random(16, 32);
        p.endPos = setParticuleDirection(p);
        p.draw = function () {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
          ctx.fillStyle = p.color;
          ctx.fill();
        }
        return p;
      }
  
      function createCircle(x, y) {
        var p = {};
        p.x = x;
        p.y = y;
        p.color = '#FFF';
        p.radius = 0.1;
        p.alpha = .5;
        p.lineWidth = 6;
        p.draw = function () {
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
          ctx.lineWidth = p.lineWidth;
          ctx.strokeStyle = p.color;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
        return p;
      }
  
      function renderParticule(anim) {
        for (var i = 0; i < anim.animatables.length; i++) {
          anim.animatables[i].target.draw();
        }
      }
  
      function animateParticules(x, y) {
        var circle = createCircle(x, y);
        var particules = [];
        for (var i = 0; i < numberOfParticules; i++) {
          particules.push(createParticule(x, y));
        }
        anime.timeline().add({
          targets: particules,
          x: function (p) { return p.endPos.x; },
          y: function (p) { return p.endPos.y; },
          radius: 0.1,
          duration: anime.random(1200, 1800),
          easing: 'easeOutExpo',
          update: renderParticule
        })
      }
  
      var render = anime({
        duration: Infinity,
        update: function () {
          ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        }
      });
  
      document.addEventListener(tap, function (e) {
        window.human = true;
        render.play();
        updateCoords(e);
        animateParticules(pointerX, pointerY);
      }, false);
  
      var centerX = window.innerWidth / 2;
      var centerY = window.innerHeight / 2;
  
  
      setCanvasSize();
      window.addEventListener('resize', setCanvasSize, false);
  
    } clickEffect();
  
    // tab message
    $(window).blur(function () {
      document.title = "where do you think you're going?";
    });
  
    $(window).focus(function () {
      document.title = "dy ^-^";
    });
  
  
    // dy enter
    $('.dyEnter>img').on('click', function () {
      $('.dyEnter').fadeOut('fast');
      $('.dyProfile').css('animation', 'dyEnter 2s ease-in-out forwards');
      $('.dyWrap').css('animation', 'dyEnter 2s ease-in-out forwards');
      $('.dyPlayer').get(0).play();
    })
  
    $('.dyEnter>img').mouseenter(function () {
  
      $('.dyEnter').css('backdrop-filter', 'blur(40px)');
  
      var $this = $(this);
      $this.fadeOut(100, function () {
        $this.attr('src', 'assets/img/eye-open.svg').fadeIn(100);
      });
  
    }).mouseleave(function () {
  
      $('.dyEnter').css('backdrop-filter', 'blur(50px)');
  
      var $this = $(this);
      $this.fadeOut(100, function () {
        $this.attr('src', 'assets/img/eye-close.svg').fadeIn(100);
      });
  
    });
  
  
    // dev easter egg
    devClicked = false;
    $('.dev').on('click', function () {
      if (devClicked == false) {
        devClicked = true;
        runMatrix();
        $('.dyBg').fadeOut('fast');
        $('.dyPlayer').attr('src', 'assets/media/dev.mp3');
        $('.dyPlayer')[0].play();
        $('.dyProfile>img').attr('src', 'assets/img/hacker.png');
        anicolors = ["#00ff00", "#000"];
      }
    });
    function runMatrix() {
  
      // geting canvas
      var c = document.getElementById("c");
      var ctx = c.getContext("2d");
  
      // making the canvas fullscreen
      c.height = window.innerHeight;
      c.width = window.innerWidth;
  
      // chinese characters - taken from the unicode charset
      var matrix = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
      // converting the string into an array of single characters
      matrix = matrix.split("");
  
      var font_size = 12;
      var columns = c.width / font_size; // number of columns for the rain
      // an array of drops - one per column
      var drops = [];
      // x below is the x coordinate
      // 1 = y co-ordinate of the drop(same for every drop initially)
      for (var x = 0; x < columns; x++)
        drops[x] = 1;
  
      // drawing the characters
      function draw() {
        // Black BG for the canvas
        // translucent BG to show trail
        ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
        ctx.fillRect(0, 0, c.width, c.height);
  
        ctx.fillStyle = "#00ff00";//green text
        ctx.font = font_size + "px arial";
        // looping over drops
        for (var i = 0; i < drops.length; i++) {
          // a random chinese character to print
          var text = matrix[Math.floor(Math.random() * matrix.length)];
          // x = i*font_size, y = value of drops[i]*font_size
          ctx.fillText(text, i * font_size, drops[i] * font_size);
  
          // sending the drop back to the top randomly after it has crossed the screen
          // adding a randomness to the reset to make the drops scattered on the Y axis
          if (drops[i] * font_size > c.height && Math.random() > 0.975)
            drops[i] = 0;
  
          // incrementing Y coordinate
          drops[i]++;
        }
      }
  
      setInterval(draw, 35);
  
    }
  
  
  });