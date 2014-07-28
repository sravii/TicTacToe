var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

var Game = require('/Users/user/Tic/public/game.js');

var clients = new Array();
var count = 0;
var rooms = new Array();
var counter = 0;
var inc = 0;
var playerNum = 0;

app.get('/',function(req, res) {
	res.sendfile('tic.html');
});

io.on('connection', function(socket) {
	console.log('User Connected');
	clients.push(socket);
	playerNum++;
	socket.emit('player-num',playerNum);
	if(playerNum == 2)
	{
		playerNum = 0;
	}
	if((clients.length % 2) == 0) {
		var currentSocket = socket;
		rooms[counter] = "Room"+counter;
		clients[inc].join(rooms[counter]);
		clients[inc+1].join(rooms[counter]);
		var game = new Game(clients[inc],clients[inc+1],currentSocket,rooms[counter],io);
		game.initialize();
		inc = inc + 2;
		counter++;
	}
	socket.on('disconnect', function() {
		console.log('User Disconnected');
	});
});

http.listen(3000, function() {
	console.log('listening on *:3000');
});