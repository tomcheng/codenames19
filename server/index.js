const app = require('express')();
const path = require('path');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
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
http.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});