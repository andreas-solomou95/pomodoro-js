const SESSION_TIME = 25 * 60 * 1000;
const BREAK_TIME = 5 * 60 * 1000;
const STEP = 1000;

const bodyRef = document.body;
const timerRef = document.getElementById("timer");
const controlsRef = document.getElementById("controls-container");

let interval;
let timer = SESSION_TIME;
let pausedAt;
let isBreak = false;
let state;

init();

function start() {
    clearInterval(interval);
    state = 'running';
    updateControls();

    interval = setInterval(() => {
        if (timer - STEP >= 0) {
            timer -= STEP;
        } else {
            timer = isBreak ? SESSION_TIME : BREAK_TIME;
            isBreak = !isBreak;
            updateBreakState();
        }
        updateTimer(timer);
    }, STEP);
}

function pause() {
    clearInterval(interval);
    state = 'paused';
    updateControls();

    pausedAt = timer;
}

function stop() {
    clearInterval(interval);
    init();
}

function updateTimer(timerNext) {
    timerRef.innerHTML = new Date(timerNext).toISOString().slice(14, -5);
    bodyRef.style.setProperty('--counter-size', `${timerNext * 100 / (isBreak ? BREAK_TIME : SESSION_TIME)}%`);
}

function updateControls() {
    controlsRef.removeAttribute('class');
    controlsRef.classList.add(state);
}

function updateBreakState() {
    if (isBreak) {
        bodyRef.classList.add('break');
        return;
    }
    bodyRef.classList.remove('break');
}

function updateTabInfo() {

}

function init() {
    state = 'idle';
    updateControls();

    isBreak = false;
    updateBreakState();
    
    timer = SESSION_TIME;
    pausedAt = null;
    updateTimer(timer);
}