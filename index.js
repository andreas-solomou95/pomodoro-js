const SESSION_TIME = 1 * 2 * 1000;
const BREAK_TIME = 1 * 2 * 1000;
const STEP = 1000;

const bodyRef = document.body;
const timerRef = document.getElementById("timer");
const controlsRef = document.getElementById("controls-container");
const tabTitleRef = document.querySelector('title');
const notification = new Audio();
// SOLUTION FOR sound NOT PLAYING ON iOS
// https://stackoverflow.com/questions/31776548/why-cant-javascript-play-audio-files-on-iphone-safari
notification.autoplay = true;
// onClick of first interaction on page before I need the sounds
notification.src = "data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
// later on when you actually want to play a sound at any point without user interaction
notification.src = './assets/tone.wav';


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
    if (state === 'running') {
        notification.play();
    }
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
        ? "assets/break.ico"
        : "assets/focus.ico";
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