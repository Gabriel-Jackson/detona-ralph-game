const state = {
  view: {
    squares: document.querySelectorAll(".square"),
    enemy: document.querySelector(".enemy"),
    timeLeft: document.querySelector("#time-left"),
    score: document.querySelector("#score"),
    lifeCount: document.getElementById("life-count")
  },
  values: {
    gameVelocity: 1000,
    lifes: 3,
    hitPosition: 0,
    result: 0,
    currentTime: 60,
    paused: false,
  },
  sounds: {
    hit: "hit.m4a",
    gameOver: "gameOver.wav",
    hurt: "hurt.mp3",
    nextLevel: "nextLevel.mp3",
    pause: "pause.mp3"
  },
  paths: {
    audioPath: "./src/audios/"
  },
  actions: {
    timerId: null,
    countDownTimerId: null,
  }
}
function randomSquare(){
  state.view.squares.forEach((square) => {
    square.classList.remove("enemy");
  });

  let randomNumber = Math.floor(Math.random() * 9);
  let randomSquare = state.view.squares[randomNumber];

  randomSquare.classList.add("enemy");
  state.values.hitPosition = randomSquare.id;
}


function countDown() {
  state.values.currentTime--;
  state.view.timeLeft.textContent = state.values.currentTime;

  if(state.values.currentTime <= 0){
    gameOver();
  }
}

async function gameOver() {
  stopTimers();
  await playSound(state.sounds.gameOver);
  alert("Game Over! O seu resultado foi: " + state.values.result);
  window.location.reload();
}

function stopTimers() {
  clearInterval(state.actions.countDownTimerId);
  clearInterval(state.actions.timerId);
}

async function playSound(audioName) {
  let audio = new Audio(`${state.paths.audioPath}${audioName}`);

  audio.volume = 0.2;

  await audio.play()
}

function addListenerHitbox(){
  state.view.squares.forEach((square) => {
    square.addEventListener('mousedown', async () => {
      if(square.id === state.values.hitPosition){
        state.values.result++;
        state.view.score.textContent = state.values.result;

        state.values.hitPosition = null;
        await playSound(state.sounds.hit);
      } else if(!square.classList.contains("enemy")) {
        
        state.values.lifes --;

        state.view.lifeCount.innerText = "x"+state.values.lifes;

        await checkGameOver();
        
      }
    })
  })
}

async function checkGameOver() {
  if (state.values.lifes == 0) {
    gameOver();
  }

  await playSound(state.sounds.hurt);
}

function playPauseGame() {
  if(!state.values.paused){
    openModal("pause");
    clearInterval(state.actions.countDownTimerId);
    clearInterval(state.actions.timerId);
    state.values.paused = true;
    return;
  }

  closeModal("pause");
  state.actions.countDownTimerId = setInterval(countDown, 1000);
  state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
  state.values.paused = false;

}

function addListenerPause(){
  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape"){
      playPauseGame();
    }
  })
}

function startGame() {
  state.view.timeLeft.innerText = state.values.currentTime;
  state.view.lifeCount.innerText = "x"+state.values.lifes;
  state.actions.timerId = setInterval(randomSquare, 1000);
  state.actions.countDownTimerId = setInterval(countDown, 1000);
}

function init(){
  startGame();
  addListenerHitbox();
  addListenerPause();
}


init();