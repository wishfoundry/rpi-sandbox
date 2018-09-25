/* eslint-disable no-trailing-spaces, no-await-in-loop */
const path = require('path');
const fs = require('fs');
const utils = require('./utils');
const cmd = require('./commands');

const {
    cleanUp,
    setupPin,
    writePin,
    io
} = cmd;

const ON = false;
const OFF = true;
const OUTPUT = io.DIR_HIGH;
const INPUT = io.DIR_IN;

const waitFor = utils.waitFor;

const PID1 = 18;
const PID2 = 17;
const CHAMBER_OPEN = 12;
const CHAMBER_CLOSE = 26;
const VAC = 4;
const CABINET_FAN = 16;
const RADIATOR_FAN = 21;
const HOT_FAN = 13;
const BAG_CLOSE = 22;
const BAG_OPEN = 23;
const COOLING_VENT_OPEN = 19;
const COOLING_VENT_CLOSE = 20;

async function actuator(open, openPin, closePin, seconds, mode = OUTPUT) {
    await setupPin(closePin, mode);
    await setupPin(openPin, mode);
    await writePin(open ? closePin : openPin, OFF);
    await writePin(open ? openPin : closePin, ON);
    await waitFor(seconds);
    await writePin(open ? openPin : closePin, OFF);
}

const openChamber = async (open = true) =>
    await actuator(open, CHAMBER_OPEN, CHAMBER_CLOSE, 7);

const openBag = async (open = true) =>
    await actuator(open, BAG_OPEN, BAG_CLOSE, 13);

const openCoolingVent = async (open = true) =>
    await actuator(open, COOLING_VENT_OPEN, COOLING_VENT_CLOSE, 7);

async function setupAllPins() {
    await setupPin(HOT_FAN, io.DIR_HIGH)
    await setupPin(CABINET_FAN, io.DIR_HIGH)
    await setupPin(RADIATOR_FAN, io.DIR_HIGH)
    await setupPin(VAC, io.DIR_HIGH)
}

// = message helpers =================================================

const ERROR = 'error';
const PROGRESS = 'progress';
const DONE = 'done';

const toMessage = (type, message, progress = 0) => ({
    message,
    type,
    progress
});



async function cycle(pin, times = 3) {
    await setupPin(pin, OUTPUT);
    for (let i = 0; times > i; i++) {
        await writePin(pin, ON);
        await waitFor(1)
        await writePin(pin, OFF);
    }
}

async function once(pin, time = 3, mode = OUTPUT) {
    await setupPin(pin, mode);
    await writePin(pin, ON);
    await waitFor(time)
    await writePin(pin, OFF);
}

// = actual routine ===================================================
const DEVMODE = false

async function runCycle(sendMessage) {
    const send = (type, msg, progress) => {
        sendMessage(toMessage(type, msg, progress));
    };

    const notify = (msg, prog) => {
        console.log(msg);
        if (DEVMODE) {
            send(PROGRESS, msg, prog)
        } else {
            send(PROGRESS, prog + '%', prog)
        }
    }

    const log = (msg, progress = 50) => {
        if (DEVMODE) {
            send(PROGRESS, msg, progress)
        } else {
            console.log(msg);
        }
    }


    try {

        const filePath = path.resolve(__dirname, './settings.js')
        let settings = JSON.parse(fs.readFileSync(filePath, 'utf8').replace('module.exports = ', ''));

        await setupAllPins()
        notify('initialized, starting SCF', 1)

        await writePin(CABINET_FAN, ON);
        notify('closing chamber', 2)
        await waitFor(1)
        await openChamber(false); // close chamber
        notify('turn fan on', 3)
        await writePin(HOT_FAN, ON);
        await waitFor(1)
        
        notify('starting heating process 1', 5)
        await once(PID1, parseInt(settings.pid1))

        notify('starting heating process 2', 10)
        await once(PID2, parseInt(settings.pid2))

        notify('closing bag', 50)
        await openBag(false) // close bag
        notify('begin cooling process', 55)
        await writePin(RADIATOR_FAN, ON)
        notify('opening vent', 58)
        await openCoolingVent() // open vent actuator
        notify('vacuum on', 60)
        await writePin(VAC, ON)

        await waitFor(parseInt(settings.cooldown1)) // pause 10 minutes
        notify('opening bag', 65)
        await openBag(true) // open bag
        notify('cooling', 70)
        await waitFor(parseInt(settings.cooldown2))
        log('cooling complete', 80)
        await writePin(HOT_FAN, OFF)
        await writePin(VAC, OFF)

        log('closing cooling vent', 85)
        await openCoolingVent(false) // close vent
        await writePin(RADIATOR_FAN, OFF)
        log('opening chamber', 90)
        await openChamber(true) // open chamber
        
        await writePin(CABINET_FAN, OFF)

        
    } catch (e) {
        console.error(e);
        send(ERROR, e.toString(), 99);
        await waitFor(5)
    } finally {
        send(DONE, 'completed', 100);
    }

    try {
        await cleanUp();
        console.log('__cleanup__')
    } catch(e) {
        console.error(e);
    }
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
