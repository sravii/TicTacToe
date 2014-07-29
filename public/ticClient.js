var socket = io();

    var playerNum;
    var currentTurn = 1;

    var MSGS = {
        turn: "It's your turn now",
        wait: "Wait for your turn",
        occupied: "Place occupied..Try a different place",
        start1: "Other player has joined..You can start playing now",
        start2: "You can start playing now",
        gameover: "GAME OVER !!!"
    }

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
            element('display_msg').innerHTML = MSGS.start1; 
        }
        else
        {
            element('display_msg').innerHTML = MSGS.start2;
        }
    });

    function clicked()
    {   

        if(playerNum == currentTurn)
        {
            if(!(element(this.id).getAttribute('class')))
            {
                socket.emit('myClick',this.id);
                element('display_msg').innerHTML = "";
            }
            else
            {
                element('display_msg').innerHTML = MSGS.occupied;
            }
        }
        else
        {
            element('display_msg').innerHTML = MSGS.wait;
        }
    }

    socket.on('display-image',function(id,sym) {
        if(sym == 'x')
        {
            element(id).setAttribute('class','x');
        }
        else
        {
            element(id).setAttribute('class','o');
        }
        currentTurn = currentTurn == 1 ? 2 : 1;
     });

    socket.on('current-turn',function() {
        element('display_msg').innerHTML = MSGS.turn;
    });

    socket.on('clear-msg', function() {
        element('display_msg').innerHTML = "";
    });

    socket.on('game-over',function() {
        element('display_msg').innerHTML = MSGS.gameover;
        playagain();
    });
    
    socket.on('play-again',function(player) {
        element('display_msg').innerHTML = "PLAYER " + player + " WON !!!";
        playagain();
    });

    function playagain() {
        var btn = document.createElement("BUTTON");
        var t = document.createTextNode("PLAY AGAIN");
        btn.appendChild(t);
        btn.setAttribute('id','restart_btn');
        element('display_msg').appendChild(btn);
        element('restart_btn').addEventListener('click',restart);
    }

    function restart() {
        location.reload();
    }