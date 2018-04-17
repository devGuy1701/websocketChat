
let express = require('express');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io').listen(server);


let users = [];
let connections = [];

server.listen(process.env.PORT || 3000);
console.log('Server in funzione...');


app.get('/', (req, res) => res.sendFile(__dirname + '/index.html') );

io.sockets.on('connection', socket => {
    socket.color = Math.random().toFixed() * 255 + ',' + Math.random().toFixed() * 255 + ',' + Math.random().toFixed() * 255;
    connections.push(socket);
    users.push(socket.id);
    let clientIp = socket.request.connection.remoteAddress;
    socket.emit('getIp', {clientIp});
    socket.broadcast.emit('connection', socket.id);
    console.log('Socket connessi: ', connections.length);

    socket.on('typing', data => {
        socket.broadcast.emit('typing', data);
    });

    socket.on('send message', data => {
        io.sockets.emit('new message', {
            msg: data, 
            id: socket.id,
            color: socket.color
        });
    });
    
    socket.on('disconnect', data => {
        connections.splice(connections.indexOf(socket), 1);
        //console.log('socket disconnesso ', socket);
        io.sockets.emit('socketDisconnect', socket.id);
    });

});