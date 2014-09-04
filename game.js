/*jslint node: true */

function Game(socket1, socket2, roomNum, io_obj) {
    "use strict";
	this.io_obj = io_obj;
	this.roomNum = roomNum;
	this.sockets = [socket1, socket2];
	this.data = [];
	this.io_obj.to(this.roomNum).emit('game-started');
    var i,
        obj = this;
	for (i = 0; i < 2; i += 1) {
		this.sockets[i].on('myClick', function (id) {
			obj.playGame(id, this);
		});
	}
}

Game.prototype = {
	io_obj: null,
	roomNum: 0,
	winCombo: [[0, 1, 2], [0, 3, 6], [0, 4, 8], [1, 4, 7], [2, 5, 8], [2, 4, 6], [3, 4, 5], [6, 7, 8]],
	data: [],
	no_of_filled: 0,
	turn: 0,
	sockets: [],
	currSocket: null,

	playGame: function (id, currSocket) {
		
        "use strict";
		var n = id.charAt('1');

		if ((this.turn % 2) === 0) {
			this.data[n] = 'x';
		} else {
			this.data[n] = 'o';
		}

		this.io_obj.to(this.roomNum).emit('display-image', id, this.data[n]);
        this.turn += 1;
        this.no_of_filled += 1;
        currSocket = (currSocket === this.sockets[0]) ? this.sockets[1] : this.sockets[0];
        currSocket.emit('current-turn');
		this.checkWin(this.data[n]);
        if (this.no_of_filled === 9) {
            this.io_obj.to(this.roomNum).emit('game-over');
        }
	},

	checkWin: function (sym) {
        "use strict";
		var flag, i, j, player;
	    for (i in this.winCombo) {
            if (this.winCombo.hasOwnProperty(i)) {
                flag = true;
                for (j = 0; j < this.winCombo[i].length; j += 1) {
                    if (this.data[this.winCombo[i][j]] !== sym) {
                        flag = false;
                    }
                }
                if (flag === true) {
                    player = sym === 'x' ? "1" : "2";
                    this.playAgain(player);
                }
            }
            
	    }
	},
	playAgain: function (player) {
        "use strict";
		this.io_obj.to(this.roomNum).emit('play-again', player);
	}
};

module.exports = Game;
