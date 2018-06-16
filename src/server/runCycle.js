// const io = require('rpi-gpio');

const wait = milliSeconds =>
    new Promise(resolve =>
        setTimeout(() => resolve(), milliSeconds));



async function runCycle(update) {
    update({ message: 'waited1', progress: 10 });
    await wait(500);
    update({ message: 'waited1', progress: 50 });
    await wait(500);
    update({ message: 'waited2', progress: 75 });

    await wait(500);
    update({ message: 'done', progress: 100 });
}

let isRunning = false;

const attemptCycle = (update) => {
    if (isRunning) return;

    isRunning = true;
    runCycle(update).then(() => {
        isRunning = false;
    });
};

module.exports = attemptCycle;
