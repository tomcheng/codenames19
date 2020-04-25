const express = require('express');
const path = require('path');
const io = require('socket.io')(http);

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.static(path.resolve(__dirname, '../build')));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../build'));
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});