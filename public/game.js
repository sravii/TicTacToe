function Game(socket1,socket2,current,rum,io_obj) {

	var filled = new Array();
	var winCombo = [[0,1,2],[0,3,6],[0,4,8],[1,4,7],[2,5,8],[2,4,6],[3,4,5],[6,7,8]];
	var data = new Array();
	var turn = 0;
	var no_of_filled = 0;
	var sockets = new Array();
	var n;
	var roomNum = rum;
	var io = io_obj;
	sockets.push(socket1,socket2);

	this.initialize = function() {
		io.to(roomNum).emit('game-started');
		for(var i=0; i<=8; i++)
		{
		    filled[i] = false;
		    data[i] = '';
		}
		for(var i=0;i<2;i++)
		{
			var _obj = this;
			sockets[i].on('myClick', function(id) {
				_obj.playGame(id,this);
			});
		}
	};

	this.playGame = function(id,curr_socket) {

		var currSocket = curr_socket;
		var changed = false;
		n = id.charAt('1');

		var msg1 = "Its your turn";
		var msg2 = "Wait for your turn";
		var msg3 = "Place already occupied...try another place";

		if((turn % 2) == 0 && currSocket == sockets[0]) {
			if(!(filled[n]))
	        {
	        	data[n] = 'x';
	            changed = true;
	        }
	        else
	        {
	        	currSocket.emit('warning-msg',msg3);	
	        }
		}
		else if(!((turn % 2) == 0) && currSocket == sockets[1]) {
			if(!(filled[n]))
	        {
	        	data[n] = 'o';
	            changed = true;
	        }
	        else
	        {
	        	currSocket.emit('warning-msg',msg3);
	        }
		}
		else {
			currSocket.emit('warning-msg',msg2);
		}
		if(changed == true)
	    {
	    	io.to(roomNum).emit('display-image',id,data[n]);
	        filled[n] = true;
	        turn++;
	        no_of_filled++;
	        currSocket.emit('clear-msg');
	        currSocket = (currSocket == sockets[0]) ? sockets[1] : sockets[0];
	        currSocket.emit('warning-msg',msg1);
			this.checkWin(data[n]);
	        if(no_of_filled == 9)
	        {
	            var msg = "GAME OVER !!!";
	            io.to(roomNum).emit('game-over',msg);
	        } 
	    }  
	};

	this.checkWin = function (sym)
	{
		var flag;
		var _obj = this;
	    for(var i in winCombo)
	    {
	    	flag = true;
	    	for(var j = 0; j < winCombo[i].length; j++)
	    	{
	    		if(!(data[winCombo[i][j]] == sym))
	    		{
	    			flag = false;
	    		}
	    	}
	    	if(flag == true) {
		    	var player = sym == 'x' ? "1" : "2";
			    _obj.playAgain(player);
		    }
	    }
	};

	this.playAgain = function(player) {
		io.to(roomNum).emit('play-again',player);
	};
}

module.exports = Game;
