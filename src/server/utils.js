
const waitFor = seconds =>
    new Promise(resolve =>
        setTimeout(() => resolve(), Math.floor(seconds * 1000)));

module.exports = {
    waitFor
};
