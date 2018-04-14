
let express = require('express');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io').listen(server);


let users = [];
let connections = [];

server.listen(process.env.PORT || 3000);
console.log('Server in funzione...');

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

io.sockets.on('connection', (socket) => {
    connections.push(socket);
    console.log('Socket connessi: ',connections.length);

    socket.on('disconnect', (data) => {
        connections.splice(connections.indexOf(socket), 1);
        console.log('socket disconnesso ', socket);
    });

    socket.on('send message', (data) => {
        io.sockets.emit('new message', {msg: data, id: socket.id});
    });
    
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
    });

});