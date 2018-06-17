let io;
if (process.platform === 'darwin' || process.platform === 'win32') {
    // if not on rasberry, setup dummy gpio
    io = {
        setup(pin, mode, cb) {
            setTimeout(() => cb(), 1);
        },
        destroy(cb) {
            setTimeout(() => cb(), 1);
        },
        write(pin, value, cb) {
            setTimeout(() => cb(), 1);
        },
        read(pin, cb) {
            setTimeout(() => cb(null, 1), 1);
        },
    };
} else {
    /* eslint-disable-next-line  */
    io = require('rpi-gpio');
}

const utils = require('./utils');
const waitFor = utils.waitFor;


const writePin = (pin, value) => new Promise((resolve, reject) => {
    io.write(pin, value, err => (err ? reject(err) : resolve()));
});

const readPin = pin => new Promise((resolve, reject) => {
    io.read(pin, (err, value) => (err ? reject(err) : resolve(value)));
});

const setupPin = (id, direction) => new Promise(resolve =>
    io.setup(id, direction, resolve));

// = tables =======================================================
/*
pin 1: 3.3v power
pin 2: 5v power
pin 3: GPIO 2 (I2C capable)
pin 4: 5v power
pin 5: GPIO 3 (I2C capable)
pin 6: GROUND
pin 7: GPIO 4
pin 8: GPIO 14 (UART capable)
pin 9: GROUND
pin 10: GPIO 15 (UART capable)
pin 11: GPIO 17
pin 12: GPIO 18
pin 13: GPIO 27
pin 14: GROUND
pin 15: GPIO 22
pin 16: GPIO 23
pin 17: 3.3v power
pin 18: GPIO 24
pin 19: GPIO 10 (SPI capable)
pin 20: GROUND
pin 21: GPIO 9 (SPI capable)
pin 22: GPIO 25
pin 23: GPIO 11 (SPI capable)
pin 24: GPIO 8 (SPI capable)
pin 25: GROUND
pin 26: GPIO 7 (SPI capable)
pin 27: DO NOT CONNECT
pin 28: DO NOT CONNECT
pin 29: GPIO 5
pin 30: GROUND
pin 31: GPIO 6
pin 32: GPIO 12
pin 33: GPIO 13
pin 34: GROUND
pin 35: GPIO 19
pin 36: GPIO 16
pin 37: GPIO 26
pin 38: GPIO 20
pin 39: GROUND
pin 40: GPIO 21


*/
// GPIO# to pin#
const GPIO = {
    // 1
    2: 3,
    3: 5,
    4: 7,
    5: 29,
    6: 31,
    7: 26,
    8: 24,
    // 9
    10: 19,
    11: 23,
    12: 32,
    13: 33,
    14: 8,
    15: 10,
    16: 36,
    17: 11,
    18: 12,
    19: 35,
    20: 38,
    21: 40,
    22: 15,
    23: 16,
    24: 18,
    25: 22,
    26: 37
};

const GpioPin = ioNumber => GPIO[ioNumber];

// = pin definition ==================================================

const DOOR_LOCK_ACTUATOR = GpioPin(4); // brown wire
const VACUUM_HI = GpioPin(17); // red
const VACUUM_LOW = GpioPin(18); // blue
const SEAL_ACUATOR = GpioPin(27); // white
const FAN = GpioPin(22); // purple
const HEATER = GpioPin(23); // grey

const DOOR_LOCK_SENSOR = GpioPin(0);
const TEMP_SENSOR = GpioPin(0);
const BAG_SEAL_ACTUATOR = GpioPin(0);

const ON = 1;
const OFF = 0;

// = pin setup =============

const INPUT = io.DIR_IN;
const OUTPUT = io.DIR_OUT;

const setupPins = () => Promise.all([
    setupPin(DOOR_LOCK_ACTUATOR, OUTPUT),
    setupPin(DOOR_LOCK_SENSOR, INPUT),
    setupPin(VACUUM_HI, OUTPUT),
    setupPin(VACUUM_LOW, OUTPUT),
    setupPin(SEAL_ACUATOR, OUTPUT),
    setupPin(BAG_SEAL_ACTUATOR, OUTPUT),
    setupPin(FAN, OUTPUT),
    setupPin(TEMP_SENSOR, INPUT),
    setupPin(HEATER, OUTPUT)
]);

const cleanUp = () => new Promise((resolve, reject) =>
    io.destroy(err => (err ? reject(err) : resolve())));

// = commands ========================================================


const lockDoor = () => 
    writePin(DOOR_LOCK_ACTUATOR, ON)
        .then(() => waitFor(4))
        .then(function() {
            return writePin(DOOR_LOCK_ACTUATOR, OFF)
        })

const unlockDoor = async () => { 
    await writePin(DOOR_LOCK_ACTUATOR, ON)
    await waitFor(4)
    await writePin(DOOR_LOCK_ACTUATOR, OFF)
};

// disable sensors for now :(
// const isDoorClosed = () => readPin(DOOR_LOCK_SENSOR).then(value => value === ON);
const isDoorClosed = () => Promise.resolve(true)

const turnVacuumHi = () =>
    writePin(VACUUM_LOW, OFF)
        .then(() =>
            writePin(VACUUM_HI, ON));

const turnVacuumLo = () =>
    writePin(VACUUM_HI, OFF)
        .then(() => writePin(VACUUM_LOW, ON));

const turnVacuumOff = () => Promise.all([
    writePin(VACUUM_HI, OFF),
    writePin(VACUUM_LOW, OFF)
]);

const turnHeaterOn = () => writePin(HEATER, ON);
const turnHeaterOff = () => writePin(HEATER, OFF);

const activateSeal = () => writePin(SEAL_ACUATOR, ON);
const deactivateSeal = () => writePin(SEAL_ACUATOR, OFF);

const activateBagSeal = () => writePin(BAG_SEAL_ACTUATOR, ON);
const deactivateBagSeal = () => writePin(BAG_SEAL_ACTUATOR, OFF);

const turnFanOn = () => writePin(FAN, ON);
const turnFanOff = () => writePin(FAN, OFF);

module.exports = {
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
};
