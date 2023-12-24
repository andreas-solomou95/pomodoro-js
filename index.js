const SESSION_TIME = 25 * 60 * 1000;
const BREAK_TIME = 5 * 60 * 1000;
const STEP = 1000;

const bodyRef = document.body;
const timerRef = document.getElementById("timer");
const controlsRef = document.getElementById("controls-container");
const tabTitleRef = document.querySelector('title');

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
    const displayedTime = new Date(timerNext).toISOString().slice(14, -5);
    timerRef.innerHTML = displayedTime;
    tabTitleRef.innerHTML = `${displayedTime} - ${isBreak ? 'Break Time' : 'Focus Time'}`;
    bodyRef.style.setProperty('--counter-size', `${timerNext * 100 / (isBreak ? BREAK_TIME : SESSION_TIME)}%`);
}

function updateControls() {
    controlsRef.removeAttribute('class');
    controlsRef.classList.add(state);
}

function updateBreakState() {
    updateTabIcon();
    if (isBreak) {
        bodyRef.classList.add('break');
        return;
    }
    bodyRef.classList.remove('break');
}

function updateTabIcon() {
    const tabIcon = document.querySelector('link[rel=icon]');
    tabIcon.href = isBreak 
        ? "/assets/break.ico"
        : "/assets/focus.ico";
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