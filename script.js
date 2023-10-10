'use strict';

const images = ['/static/ig-i.png', '/static/ig-g.png', '/static/ig-two.png', '/static/ig-three.png'];
const letters = ['i', 'g', '2', '3']
const dice = document.querySelector('.dice');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const rotateLeftBtn = document.querySelector('#left');
const rotateRightBtn = document.querySelector('#right');
const fireworkSounds = document.getElementById('fireworkSounds');

const frontFace = document.querySelector(".cube__face--front");
const leftFace = document.querySelector(".cube__face--left");
const rightFace = document.querySelector(".cube__face--right");
const backFace = document.querySelector(".cube__face--back");
const btmFace = document.querySelector(".cube__face--bottom");
const topFace = document.querySelector(".cube__face--top");

function showConfetti() {
  // Globals
  var random = Math.random
    , cos = Math.cos
    , sin = Math.sin
    , PI = Math.PI
    , PI2 = PI * 2
    , timer = 1
    , frame = undefined
    , confetti = [];

  var particles = 10
    , spread = 40
    , sizeMin = 3
    , sizeMax = 12 - sizeMin
    , eccentricity = 10
    , deviation = 100
    , dxThetaMin = -.1
    , dxThetaMax = -dxThetaMin - dxThetaMin
    , dyMin = .13
    , dyMax = .18
    , dThetaMin = .4
    , dThetaMax = .7 - dThetaMin;

  var colorThemes = [
    function () {
      return color(200 * random() | 0, 200 * random() | 0, 200 * random() | 0);
    }, function () {
      var black = 200 * random() | 0; return color(200, black, black);
    }, function () {
      var black = 200 * random() | 0; return color(black, 200, black);
    }, function () {
      var black = 200 * random() | 0; return color(black, black, 200);
    }, function () {
      return color(200, 100, 200 * random() | 0);
    }, function () {
      return color(200 * random() | 0, 200, 200);
    }, function () {
      var black = 256 * random() | 0; return color(black, black, black);
    }, function () {
      return colorThemes[random() < .5 ? 1 : 2]();
    }, function () {
      return colorThemes[random() < .5 ? 3 : 5]();
    }, function () {
      return colorThemes[random() < .5 ? 2 : 4]();
    }
  ];
  function color(r, g, b) {
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  // Cosine interpolation
  function interpolation(a, b, t) {
    return (1 - cos(PI * t)) / 2 * (b - a) + a;
  }

  // Create a 1D Maximal Poisson Disc over [0, 1]
  var radius = 1 / eccentricity, radius2 = radius + radius;
  function createPoisson() {
    // domain is the set of points which are still available to pick from
    // D = union{ [d_i, d_i+1] | i is even }
    var domain = [radius, 1 - radius], measure = 1 - radius2, spline = [0, 1];
    while (measure) {
      var dart = measure * random(), i, l, interval, a, b, c, d;

      // Find where dart lies
      for (i = 0, l = domain.length, measure = 0; i < l; i += 2) {
        a = domain[i], b = domain[i + 1], interval = b - a;
        if (dart < measure + interval) {
          spline.push(dart += a - measure);
          break;
        }
        measure += interval;
      }
      c = dart - radius, d = dart + radius;

      // Update the domain
      for (i = domain.length - 1; i > 0; i -= 2) {
        l = i - 1, a = domain[l], b = domain[i];
        // c---d          c---d  Do nothing
        //   c-----d  c-----d    Move interior
        //   c--------------d    Delete interval
        //         c--d          Split interval
        //       a------b
        if (a >= c && a < d)
          if (b > d) domain[l] = d; // Move interior (Left case)
          else domain.splice(l, 2); // Delete interval
        else if (a < c && b > c)
          if (b <= d) domain[i] = c; // Move interior (Right case)
          else domain.splice(i, 0, c, d); // Split interval
      }

      // Re-measure the domain
      for (i = 0, l = domain.length, measure = 0; i < l; i += 2)
        measure += domain[i + 1] - domain[i];
    }

    return spline.sort();
  }

  // Create the overarching container
  var container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '0';
  container.style.overflow = 'visible';
  container.style.zIndex = '9999';

  // Confetto constructor
  function Confetto(theme) {
    this.frame = 0;
    this.outer = document.createElement('div');
    this.inner = document.createElement('div');
    this.outer.appendChild(this.inner);

    var outerStyle = this.outer.style, innerStyle = this.inner.style;
    outerStyle.position = 'absolute';
    outerStyle.width = (sizeMin + sizeMax * random()) + 'px';
    outerStyle.height = (sizeMin + sizeMax * random()) + 'px';
    innerStyle.width = '100%';
    innerStyle.height = '100%';
    innerStyle.backgroundColor = theme();

    outerStyle.perspective = '50px';
    outerStyle.transform = 'rotate(' + (360 * random()) + 'deg)';
    this.axis = 'rotate3D(' +
      cos(360 * random()) + ',' +
      cos(360 * random()) + ',0,';
    this.theta = 360 * random();
    this.dTheta = dThetaMin + dThetaMax * random();
    innerStyle.transform = this.axis + this.theta + 'deg)';

    this.x = window.innerWidth * random();
    this.y = -deviation;
    this.dx = sin(dxThetaMin + dxThetaMax * random());
    this.dy = dyMin + dyMax * random();
    outerStyle.left = this.x + 'px';
    outerStyle.top = this.y + 'px';

    // Create the periodic spline
    this.splineX = createPoisson();
    this.splineY = [];
    for (var i = 1, l = this.splineX.length - 1; i < l; ++i)
      this.splineY[i] = deviation * random();
    this.splineY[0] = this.splineY[l] = deviation * random();

    this.update = function (height, delta) {
      this.frame += delta;
      this.x += this.dx * delta;
      this.y += this.dy * delta;
      this.theta += this.dTheta * delta;

      // Compute spline and convert to polar
      var phi = this.frame % 7777 / 7777, i = 0, j = 1;
      while (phi >= this.splineX[j]) i = j++;
      var rho = interpolation(
        this.splineY[i],
        this.splineY[j],
        (phi - this.splineX[i]) / (this.splineX[j] - this.splineX[i])
      );
      phi *= PI2;

      outerStyle.left = this.x + rho * cos(phi) + 'px';
      outerStyle.top = this.y + rho * sin(phi) + 'px';
      innerStyle.transform = this.axis + this.theta + 'deg)';
      return this.y > height + deviation;
    };
  }

  function poof() {
    if (!frame) {
      // Append the container
      document.body.appendChild(container);

      // Add confetti
      var theme = colorThemes[0]
        , count = 0;
      (function addConfetto() {
        var confetto = new Confetto(theme);
        confetti.push(confetto);
        container.appendChild(confetto.outer);
        timer = setTimeout(addConfetto, spread * random());
      })(0);

      // Start the loop
      var prev = undefined;
      requestAnimationFrame(function loop(timestamp) {
        var delta = prev ? timestamp - prev : 0;
        prev = timestamp;
        var height = window.innerHeight;

        for (var i = confetti.length - 1; i >= 0; --i) {
          if (confetti[i].update(height, delta)) {
            container.removeChild(confetti[i].outer);
            confetti.splice(i, 1);
          }
        }

        if (timer || confetti.length)
          return frame = requestAnimationFrame(loop);

        // Cleanup
        document.body.removeChild(container);
        frame = undefined;
      });
    }
  }

  poof();
};

const faceYRotationVals = {
  front: 0,
  right: 90,
  back: 180,
  left: -90,
};
const faceZRotationVals = {
  btm: 0,
  top: 0,
};
const rotateLeftHandle = () => {
  console.log("Pressed Left!");

  for (let face in faceYRotationVals) {
    faceYRotationVals[face] = (faceYRotationVals[face] - 90);
  }
  faceZRotationVals.top += 90;
  faceZRotationVals.btm -= 90;
  console.log(faceYRotationVals.front)
  frontFace.style.transform = `rotateY(${faceYRotationVals.front}deg) translateZ(100px)`;
  rightFace.style.transform = `rotateY(${faceYRotationVals.right}deg) translateZ(100px)`;
  backFace.style.transform = `rotateY(${faceYRotationVals.back}deg) translateZ(100px)`;
  leftFace.style.transform = `rotateY(${faceYRotationVals.left}deg) translateZ(100px)`;
  btmFace.style.transform = `rotateX(-90deg) translateZ(100px) rotateZ(${faceZRotationVals.btm}deg)`;
  topFace.style.transform = `rotateX(90deg) translateZ(100px) rotateZ(${faceZRotationVals.top}deg)`;
};
const rotateRightHandle = () => {
  console.log("Pressed right!");

  for (let face in faceYRotationVals) {
    faceYRotationVals[face] = (faceYRotationVals[face] + 90);
  }
  faceZRotationVals.top -= 90;
  faceZRotationVals.btm += 90;
  console.log(faceYRotationVals.front)
  frontFace.style.transform = `rotateY(${faceYRotationVals.front}deg) translateZ(100px)`;
  rightFace.style.transform = `rotateY(${faceYRotationVals.right}deg) translateZ(100px)`;
  backFace.style.transform = `rotateY(${faceYRotationVals.back}deg) translateZ(100px)`;
  leftFace.style.transform = `rotateY(${faceYRotationVals.left}deg) translateZ(100px)`;
  btmFace.style.transform = `rotateX(-90deg) translateZ(100px) rotateZ(${faceZRotationVals.btm}deg)`;
  topFace.style.transform = `rotateX(90deg) translateZ(100px) rotateZ(${faceZRotationVals.top}deg)`;
};

let currentIndex = 0;
let lastIndex = 0;
let currentStr = '';
let currentArr = [];

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

function updateDice() {
  dice.src = images[currentIndex]
}

function handleKeyPress(event) {
  switch (event.key) {
    case 'ArrowLeft':
      // Left Arrow key pressed
      handleSwipe('left');
      break;
    case 'ArrowRight':
      // Right Arrow key pressed
      handleSwipe('right');
      break;
    case 'ArrowUp':
      // Up Arrow key pressed
      handleSwipe('up');
      break;
    case 'ArrowDown':
      // Down Arrow key pressed
      handleSwipe('down');
      break;
    case ' ':
      // Spacebar key pressed
      handleSwipe('space');
      break;
  }
}

function handleSwipe(gesture) {
  let printGesture;

  if (gesture === 'left') {
    // Swipe left: Decrease the current image index (looping back to the end if needed)
    rotateLeftHandle();
    currentIndex = (currentIndex - 1 + letters.length) % letters.length;
    printGesture = "⬅️";
  } else if (gesture === 'right') {
    // Swipe right: Increase the current image index (looping back to the beginning if needed)
    rotateRightHandle();
    currentIndex = (currentIndex + 1 + letters.length) % letters.length;
    printGesture = "➡️";
  } else if (gesture === 'up') {
    if (currentArr.length < 4) {
      currentStr = currentStr + letters[currentIndex]
      currentArr.push(letters[currentIndex])
      printGesture = "⬆️";
    } else {
      console.log("Max Chars Reached. Ignoring Addition")
    }
  } else if (gesture === 'down') {
    currentStr = currentStr.slice(0, -1);
    currentArr.pop();
    printGesture = "⬇️";
  } else if (gesture === 'space') {
    printGesture = "🤚"
    currentArr = [];
    currentStr = "";
    closeModal();
    fireworkSounds.pause();
  }
  if (currentStr === 'ig23') {
    openModal();
    showConfetti();
    fireworkSounds.play();
    // createFireworks();
  }

  // console.log(currentStr)
  // console.log(currentArr)

  // updateDice();
  updateCurrentGesture(printGesture);
  displayString(currentArr);

}

// Function to update the current-letter element
function updateCurrentGesture(gesture) {
  const currentGesture = document.getElementById('current--id');
  if (currentGesture) {
    let l = gesture.toUpperCase()
    currentGesture.textContent = l;
  }
}

function displayString(currentArr) {
  let count = 0;

  if (currentArr.length >= 1) {
    // Display existing text in current array
    for (let i = 0; i < currentArr.length; i++) {
      let displayChar = document.getElementById(`flex-child--${i + 1}`);
      displayChar.textContent = currentArr[i].toUpperCase();
      count++;
    }

    for (let i = count; i < 4; i++) {
      let displayChar = document.getElementById(`flex-child--${i + 1}`);
      displayChar.textContent = "_";
    }
  } else {
    // Fill the rest with hypens
    for (let i = count; i < 4; i++) {
      let displayChar = document.getElementById(`flex-child--${i + 1}`);
      displayChar.textContent = "_";
    }
  }
}

// Function to update the dice image and animate it
function updateDice() {
  // Create a GSAP timeline for the animation
  const tl = gsap.timeline();

  // Define the animation for swiping left
  if (currentIndex > lastIndex) {
    tl.to('.dice', { x: '-100%', duration: 0.2, ease: 'power1.in' })
      .set('.dice', { x: '100%' }) // Reset the position off-screen to the right
      .to('.dice', { x: '0%', duration: 0.2, ease: 'power1.out' });
  }
  // Define the animation for swiping right
  else if (currentIndex < lastIndex) {
    tl.to('.dice', { x: '100%', duration: 0.2, ease: 'power1.in' })
      .set('.dice', { x: '-100%' }) // Reset the position off-screen to the left
      .to('.dice', { x: '0%', duration: 0.2, ease: 'power1.out' });
  }
  // Define the animation for swiping up
  else if (currentArr.length > lastIndex) {
    const fillChar = currentArr[lastIndex];
    const targetElement = document.getElementById(`flex-child--${lastIndex + 1}`);

    tl.to('.dice', { y: '-100%', duration: 0.2, ease: 'power1.in' })
      .set('.dice', { y: '100%' }) // Reset the position off-screen below
      .to('.dice', { y: '0%', duration: 0.2, ease: 'power1.out' })
      .to(targetElement, { textContent: fillChar.toUpperCase(), duration: 0.2, ease: 'power1.out' });
  }

  // Update the dice image after the animation
  setTimeout(() => {
    dice.src = images[currentIndex];
  }, 100); // Delay to match the animation duration (adjust as needed)

  // Update the lastIndex
  lastIndex = currentIndex;
}

function createFireworks() {
  const fireworksContainer = document.createElement('div');
  fireworksContainer.classList.add('firework-container');

  // Create and append firework elements to the container
  for (let i = 0; i < 10; i++) {
    const firework = document.createElement('div');
    firework.classList.add('firework');
    fireworksContainer.appendChild(firework);
  }

  // Append the fireworks container to the body
  document.body.appendChild(fireworksContainer);

  // Remove the fireworks container after the animation duration
  setTimeout(() => {
    fireworksContainer.remove();
  }, 20000); // Adjust the duration as needed (2s in this case)
}

const init = function () {
  document.addEventListener('keydown', handleKeyPress);

  // updateDice();
  updateCurrentGesture(" ");
};
init();