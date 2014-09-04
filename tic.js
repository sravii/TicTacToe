/*jslint node: true */

var express = require('express'),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

var Game = require(__dirname + '/game.js'),

	clients = [],
	count = 0,
	rooms = [],
	counter = 0,
	inc = 0,
	playerNum = 0;

app.get('/', function (req, res) {
    "use strict";
	res.sendfile('index.html');
});

function createRoom(currentSocket) {
    "use strict";
	rooms[counter] = counter;
	clients[inc].join(rooms[counter]);
	clients[inc + 1].join(rooms[counter]);
	var game = new Game(clients[inc], clients[inc + 1], rooms[counter], io);
	inc = inc + 2;
	counter += 1;
}

io.on('connection', function (socket) {
    "use strict";
	console.log('User Connected');
	clients.push(socket);
	playerNum += 1;
	socket.emit('player-num', playerNum);
	if (playerNum === 2) {
		playerNum = 0;
	}
	if ((clients.length % 2) === 0) {
		createRoom(socket);
	}
	socket.on('disconnect', function () {
		console.log('User Disconnected');
	});
});

http.listen(3000, function () {
    "use strict";
	console.log('listening on *:3000');
});