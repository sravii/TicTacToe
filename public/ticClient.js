var socket = io();

    var playerNum;

    function byName(name)
    {
       return document.getElementsByName(name);
    }

    function element(id)
    {
        return document.getElementById(id);
    }

    function addLisN(name,type,func)
    {
       var arr = byName(name);
       for( var i in arr)
       {
          arr[i].addEventListener(type,func); 
       }
    }

    window.onload = function() {
        var count = 0;
        for(i = 0; i < 3; i++)
        {
            var row = document.createElement('tr');
            element('tictactoe').appendChild(row);
            for(j = 0; j < 3; j++)
            {
                var col = document.createElement('td');
                col.setAttribute('id','c'+count);
                col.setAttribute('name','cell');
                count++;
                row.appendChild(col);
            }
        }
        addLisN("cell","click",clicked);
    }

    socket.on('player-num', function(num) {
        playerNum = num;
        element('player_num').innerHTML = "PLAYER " + num;
    });

    socket.on('game-started', function() {
        if(playerNum == 1)
        {
            element('display_msg').innerHTML = "Other player has joined..You can start playing now"; 
        }
        else
        {
            element('display_msg').innerHTML = "You can now start playing";
        }
    });

    function clicked()
    {
      socket.emit('myClick',this.id);
    }

    socket.on('display-image',function(id,dispImg) {
        element(id).style.backgroundSize = "80px 80px";
        element(id).style.backgroundRepeat = "no-repeat";
        element(id).style.backgroundPosition = "center";
        element(id).style.backgroundImage = dispImg;
     });

    socket.on('warning-msg',function(msg) {
        element('display_msg').innerHTML = msg;
    });

    socket.on('clear-msg', function() {
        element('display_msg').innerHTML = "";
    });

    socket.on('game-over',function(msg) {
        element('display_msg').innerHTML = msg;
        var y = confirm("Game over....Play again ?");
        if(y == true)
        {
            location.reload();
        }
    });
    
    socket.on('play-again',function(player) {
        element('display_msg').innerHTML = "PLAYER " + player + " WON !!!";
        var y = confirm("Player "+player+" won....Play again ?");
        if(y == true)
        {
            location.reload();
        }
    });