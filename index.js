const SESSION_TIME = 25 * 60 * 1000;
const BREAK_TIME = 5 * 60 * 1000;
const STEP = 1000;

const timeRef = document.getElementById("time");
const controlsRef = document.getElementById("controls-container");

let interval;
let time = SESSION_TIME;
let pausedAt;
let isBrake = false;
let state;

init();

function start() {
    clearInterval(interval);
    state = 'running';
    updateScreen();

    interval = setInterval(() => {
        if (time - STEP >= 0) {
            time -= STEP;
        } else {
            time = isBrake ? SESSION_TIME : BREAK_TIME;
            isBrake = !isBrake;
        }
        updateTime(time);
    }, STEP);
}

function pause() {
    clearInterval(interval);
    state = 'paused';
    updateScreen();

    pausedAt = time;
}

function stop() {
    clearInterval(interval);
    isBrake = false;
    init();
}

function updateTime(timeNext) {
    timeRef.innerHTML = new Date(timeNext).toISOString().slice(14, -5);
}

function updateScreen() {
    if (isBrake) {
        document.body.classList.add('brake');
    } else { 
        document.body.classList.remove('brake');
    }
    controlsRef.removeAttribute('class');
    controlsRef.classList.add(state);
}

function init() {
    state = 'idle';
    updateScreen();

    time = SESSION_TIME;
    pausedAt = null;
    updateTime(time);
}

function running() {
    document.body.classList.add('running');
}