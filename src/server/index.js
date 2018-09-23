const express = require('express');
const addWsSupport = require('express-ws');
const os = require('os');
const attemptCycle = require('./runCycle');
const path = require('path');

const staticDir = path.resolve(__dirname, '../../dist/')

const expressWs = addWsSupport(express());
const { app } = expressWs;
const port = process.env.NODE_PORT || 8080;

app.use(express.static(staticDir));

app.get('/api/getUsername', (req, res) => {
    res.send({ username: os.userInfo().username });
});

app.ws('/', (ws) => {
    const update = data => ws.send(JSON.stringify(data));


    ws.on('message', (msg) => {
        attemptCycle(update);
        console.log('received message: ', msg);
    });

});

app.listen(port, () => console.log('Listening on port 8080!'));
