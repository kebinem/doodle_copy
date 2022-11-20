document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const doodler = document.createElement("img");
  const platforms = [];
  let doodlerLeftSpace = 50;
  let startPoint = 150;
  let doodlerBottomSpace = startPoint;
  let isGameOver = false;
  let platformCount = 5;
  let upTimerId, downTimerId;
  let isJumping = true;
  let isGoingLeft = false;
  let isGoingRight = false;
  let leftTimerId, rightTimerId;
  let score = 0;

  function createDoodler() {
    grid.appendChild(doodler);
    doodler.src = "nlo.png";
    doodler.classList.add("doodler");
    doodlerLeftSpace = platforms[0].left;
    doodler.style.left = doodlerLeftSpace + "px";
    doodler.style.bottom = doodlerBottomSpace + "px";
  }

  class Platform {
    constructor(newPlatformBottom) {
      this.bottom = newPlatformBottom;
      this.left = Math.random() * 315;
      this.visual = document.createElement("div");

      const visual = this.visual;
      visual.classList.add("platform");
      visual.style.left = this.left + "px";
      visual.style.bottom = this.bottom + "px";
      grid.appendChild(visual);
    }
  }

  function createPlatforms() {
    let platformGap = 600 / platformCount;
    for (let i = 0; i < platformCount; i++) {
      let newPlatformBottom = 100 + i * platformGap;
      let newPlatform = new Platform(newPlatformBottom);
      platforms.push(newPlatform);
    }
  }

  function movePlatforms() {
    if (doodlerBottomSpace > 50) {
      platforms.forEach((platform) => {
        platform.bottom -= 4;
        let visual = platform.visual;
        visual.style.bottom = platform.bottom + "px";

        if (platform.bottom < 0) {
          let firstPlatform = platforms[0].visual;
          firstPlatform.classList.remove("platform");
          platforms.shift();
          score++;
          let newPlatform = new Platform(600);
          platforms.push(newPlatform);
        }
      });
    }
  }

  function jump() {
    clearInterval(downTimerId);
    isJumping = true;
    upTimerId = setInterval(function () {
      doodlerBottomSpace += 5;
      doodler.style.bottom = doodlerBottomSpace + "px";
      if (doodlerBottomSpace > startPoint + 200) {
        fall();
      }
    }, 30);
  }

  function fall() {
    clearInterval(upTimerId);
    isJumping = false;
    downTimerId = setInterval(function () {
      doodlerBottomSpace -= 10;
      doodler.style.bottom = doodlerBottomSpace + "px";

      if (doodlerBottomSpace <= 0) {
        gameOver();
      }

      platforms.forEach((platform) => {
        if (
          doodlerBottomSpace >= platform.bottom &&
          doodlerBottomSpace <= platform.bottom + 15 &&
          doodlerLeftSpace + 60 >= platform.left &&
          doodlerLeftSpace <= platform.left + 85 &&
          !isJumping
        ) {
          startPoint = doodlerBottomSpace;
          jump();
        }
      });
    }, 30);
  }

  function gameOver() {
    isGameOver = true;
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
    grid.innerHTML = score;
    clearInterval(upTimerId);
    clearInterval(downTimerId);
  }

  function control(e) {
    if (e.key === "ArrowLeft") {
      moveLeft();
    } else if (e.key === "ArrowRight") {
      moveRight();
    }
    setTimeout(document.removeEventListener("keydown", control), 700);
  }

  function moveLeft() {
    isGoingLeft = true;
    leftTimerId = setInterval(() => {
      if (doodlerLeftSpace > 0) {
        doodlerLeftSpace -= 10;
        doodler.style.left = doodlerLeftSpace + "px";
      }
    }, 30);
  }

  function moveRight() {
    isGoingRight = true;
    rightTimerId = setInterval(() => {
      if (doodlerLeftSpace < 340) {
        doodlerLeftSpace += 10;
        doodler.style.left = doodlerLeftSpace + "px";
      }
    }, 30);
  }

  function stop() {
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
    document.addEventListener("keydown", control);
  }

    function start() {
    if (!isGameOver) {
      createPlatforms();
      createDoodler();
      setInterval(movePlatforms, 30);
      jump();
      document.addEventListener("keydown", control);
      document.addEventListener("keyup", stop);
      window.addEventListener("deviceorientation", onOrientationChange);
    }
  }

  function onOrientationChange(e) {
    doodlerLeftSpace += e.gamma;
        doodler.style.left = doodlerLeftSpace + "px";
  }

  //attach to button
  start();
});
