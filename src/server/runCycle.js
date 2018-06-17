/* eslint-disable no-trailing-spaces, no-await-in-loop */
const utils = require('./utils');
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
    activateBagSeal, // eslint-disable-line
    deactivateBagSeal, // eslint-disable-line
    lockDoor,
    unlockDoor,
    isDoorClosed
} = cmd;

const waitFor = utils.waitFor;

// = message helpers =================================================

const ERROR = 'error';
const PROGRESS = 'progress';
const DONE = 'done';

const toMessage = (type, message, progress = 0) => ({
    message,
    type,
    progress
});


// = actual routine ===================================================

async function runCycle(sendMessage) {
    const send = (type, msg, progress) => {
        console.log(msg);
        sendMessage(toMessage(type, msg, progress));
    };

    try {
        setupPins();

        send(PROGRESS, 'starting cycle', 1);
        await waitFor(1);
        send(PROGRESS, 'locking door', 2);
        await lockDoor();
        
        
        // await waitFor(1);
        // const isClosed = await isDoorClosed();
        // if (!isClosed) {
        //     send(ERROR, 'cannot close door', 100);
        //     console.log('door lock failed');
        //     throw new Error('cannot close door');
        // }

        await waitFor(0.3);
        send(PROGRESS, 'door lock success', 3);
        
        await Promise.all([
            turnVacuumLo(),
            activateSeal(),
            turnFanOn(),
            turnHeaterOn()
        ]);
        
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

// = small helper to prevent multiple cycles simultaneously ========

let isRunning = false;
const enable = () => {
    isRunning = false;
};

const attemptCycle = (update) => {
    if (isRunning) return;

    isRunning = true;
    runCycle(update)
        .then(enable)
        .catch(enable);
};

// = export this function to be used by server =====================

module.exports = attemptCycle;
