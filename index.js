const SESSION_TIME = 1 * 10 * 1000;
const BREAK_TIME = 5 * 60 * 1000;
const STEP = 1000;

const bodyRef = document.body;
const timerRef = document.getElementById("timer");
const controlsRef = document.getElementById("controls-container");

let interval;
let timer = SESSION_TIME;
let pausedAt;
let isBrake = false;
let state;

init();

function start() {
    clearInterval(interval);
    state = 'running';
    updateScreen();

    interval = setInterval(() => {
        if (timer - STEP >= 0) {
            timer -= STEP;
        } else {
            timer = isBrake ? SESSION_TIME : BREAK_TIME;
            isBrake = !isBrake;
            updateBreakState();
        }
        updateTimer(timer);
    }, STEP);
}

function pause() {
    clearInterval(interval);
    state = 'paused';
    updateScreen();

    pausedAt = timer;
}

function stop() {
    clearInterval(interval);
    init();
}

function updateTimer(timerNext) {
    timerRef.innerHTML = new Date(timerNext).toISOString().slice(14, -5);
    bodyRef.style.setProperty('--counter-size', `${timerNext * 100 / (isBrake ? BREAK_TIME : SESSION_TIME)}%`);
}

function updateScreen() {
    controlsRef.removeAttribute('class');
    controlsRef.classList.add(state);
}

function updateBreakState() {
    if (isBrake) {
        bodyRef.classList.add('brake');
        return;
    }
    bodyRef.classList.remove('brake');
}

function init() {
    state = 'idle';
    updateScreen();

    isBrake = false;
    updateBreakState();
    
    timer = SESSION_TIME;
    pausedAt = null;
    updateTimer(timer);
}

function running() {
    bodyRef.classList.add('running');
}