const cmd = require('./commands');

const {
    setupPins,
    cleanUp,
    turnHeaterOff,
    turnHeaterOn,
    turnVacuumHi,
    turnVacuumLo,
    turnVacuumOff,
    turnFanOn,
    turnFanOff,
    activateSeal,
    deactivateSeal,
    activateBagSeal,
    deactivateBagSeal,
    lockDoor,
    unlockDoor,
    isDoorClosed
} = cmd;

const waitFor = seconds =>
    new Promise(resolve =>
        setTimeout(() => resolve(), Math.floor(seconds * 1000)));


const ERROR = 'error';
const PROGRESS = 'progress';
const DONE = 'done';

const toMessage = (type, message, progress = 0) => ({
    message,
    type,
    progress
});


async function runCycle(update) {
    const send = (type, msg, progress) => {
        console.log(msg);
        update(toMessage(type, msg, progress));
    }
    try {
        setupPins();

        send(PROGRESS, 'starting cycle', 1);
        await waitFor(1);
        send(PROGRESS, 'locking door', 2);
        await lockDoor();
        console.log('door lock activated');
        await waitFor(1);
        const isClosed = await isDoorClosed();
        if (!isClosed) {
            send(ERROR, 'cannot close door', 100);
            console.log('door lock failed');
            throw new Error('cannot close door');
        }

        await waitFor(0.3);
        send(PROGRESS, 'door lock success', 3);
        
        await turnVacuumLo();
        await activateSeal();
        await turnFanOn();
        await turnHeaterOn();
        
        send(PROGRESS, 'heating', 5);
        // wait for 10 minutes, update every minute
        for (let i = 0; i < 10; i += 1) {
            await waitFor(1);
            send(PROGRESS, `heating${'.'.repeat(i)}`, 5);
        }

        await turnHeaterOff();
        await turnVacuumHi();

        // wait for 10 minutes, update every minute
        for (let i = 0; i < 10; i += 1) {
            await waitFor(1);
            send(PROGRESS, `cooling${'.'.repeat(i)}`, 5);
        }

        await deactivateSeal();

        // wait for 10 minutes, update every minute
        for (let i = 0; i < 10; i += 1) {
            await waitFor(1);
            send(PROGRESS, `still cooling${'.'.repeat(i)}`, 5);
        }

        await turnFanOff();
        await turnVacuumOff();
        await unlockDoor();

        send(DONE, 'completed', 100);
    } catch (e) {
        console.error(e);
    }

    cleanUp();
}

let isRunning = false;
const enable = () => isRunning = false;

const attemptCycle = (update) => {
    if (isRunning) return;

    isRunning = true;
    runCycle(update)
        .then(enable)
        .catch(enable);
};

module.exports = attemptCycle;
