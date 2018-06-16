const express = require('express');
const addWsSupport = require('express-ws');
const os = require('os');
const attemptCycle = require('./runCycle');


const expressWs = addWsSupport(express());
const app = expressWs.app;


app.use(express.static('dist'));

app.get('/api/getUsername', (req, res) => {
    res.send({ username: os.userInfo().username });
});

app.ws('/', (ws, request) => {
    const update = data => ws.send(JSON.stringify(data));


    ws.on('message', (msg) => {
        attemptCycle(update);
        console.log('received message: ', msg);
    });

});

app.listen(8080, () => console.log('Listening on port 8080!'));
