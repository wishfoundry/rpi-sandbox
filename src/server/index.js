const express = require('express');
const addWsSupport = require('express-ws');
const os = require('os');
const attemptCycle = require('./runCycle');
const path = require('path');
const fs = require('fs');
const child_process = require('child_process');
const exec = child_process.exec;
const execSync = child_process.execSync

const staticDir = path.resolve(__dirname, '../../dist/')

const expressWs = addWsSupport(express());
const { app } = expressWs;
const port = process.env.NODE_PORT || 8080;

app.use(express.static(staticDir));
app.use(express.json());

app.get('/api/getUsername', (req, res) => {
    res.send({ username: os.userInfo().username });
});

app.get('/api/settings', (req, res) => {

    const filePath = path.resolve(__dirname, './settings.js')
    let settings = fs.readFileSync(filePath, 'utf8').replace('module.exports = ', '');
    settings = JSON.stringify(JSON.parse(settings))
    res.send(settings);
})

app.post('/api/settings', (req, res) => {

    console.log(req.body)
    const value = JSON.stringify(req.body, null, 4);
    const filePath = path.resolve(__dirname, './settings.js')
    fs.writeFileSync(filePath, value, 'utf8')
    res.send({ success: true });
})

const update = (req, res) => {
    /*
    console.log('updating')
    setTimeout(() => {
        res.send({ message: 'success' })
    }, 3000)
    return
    /*/
    try {
        const cwd = path.resolve(__dirname, '../../');
        execSync('git reset --hard', { cwd: cwd });
        execSync('git pull -r', { cwd: cwd });
        // execSync('/home/pi/.nvm/versions/node/v8.11.3/bin/npm run build', { cwd: cwd });
        // execSync('sudo /sbin/shutdown -r now');
        res.send({ message: 'success' })
    } catch(e) {
        res.send({ error: e.toString() })
    }
    //*/
}

app.get('/api/force-update', update)
app.get('/api/pull-latest', update)

app.get('/api/rebuild', (req, res) => {
    try {
        const cwd = path.resolve(__dirname, '../../');
        execSync('/home/pi/.nvm/versions/node/v8.11.3/bin/npm run build', { cwd: cwd });
        // execSync('sudo /sbin/shutdown -r now');
        res.send({ message: 'success' })
    } catch(e) {
        res.send({ error: e.toString() })
    }
})

app.get('/api/kill-chrome', (req, res) => {
    try {
        const cwd = path.resolve(__dirname, '../../');
        execSync('pkill chrome', { cwd: cwd });
        res.send({ message: 'success' })
    } catch(e) {
        res.send({ error: e.toString() })
    }
})

app.ws('/', (ws) => {
    const update = data => ws.send(JSON.stringify(data));


    ws.on('message', (msg) => {
        attemptCycle(update);
        console.log('received message: ', msg);
    });

});

app.listen(port, () => console.log('Listening on port 8080!'));
