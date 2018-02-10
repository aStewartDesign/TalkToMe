const express = require('express');
const app = express();
const APIAI_TOKEN = 'b988deedf1054d5983a9d97cf28daeee';
const APIAI_SESSION_TOKEN = 'Oh1w1$h1w3r3@n0$c@rMy@rw1n3r';
const apiai = require('apiai')(APIAI_TOKEN);

app.use(express.static(`${__dirname}/views`));
app.use(express.static(`${__dirname}/public`));

const server = app.listen(5000);
const io = require('socket.io')(server);
app.get('/', (req, res) => {
    res.sendFile('index.html');
});

io.on('connection', (socket) => {
    socket.on('chat-in', (text) => {
        console.log(`incomming message: ${text}`);
        const req = apiai.textRequest(text, {
            sessionId: APIAI_SESSION_TOKEN
        });
        req.on('response', (resp) => {
            const respText = resp.result.fulfillment.speech;
            console.log(`bot message: ${respText}`);
            socket.emit('chat-out', respText);
        });
        req.on('error', (error) => {});
        req.end();
    });
});
