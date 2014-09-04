/*jslint node: true */
/*global io */
var socket = io();

var Client = {
    
    playerNum: 0,
    currentTurn: 1,

    initialize: function () {
        "use strict";
        this.allTheSocketListeners();
        this.windowLoad();
    },

    windowLoad: function () {
        "use strict";
        var i, j, row, col;
        for (i = 0; i < 3; i += 1) {
            row = document.createElement('tr');
            this.Utils.element('tictactoe').appendChild(row);
            for (j = 0; j < 3; j += 1) {
                col = document.createElement('td');
                col.setAttribute('id', 'c' + (i * 3 + j));
                col.setAttribute('name', 'cell');
                row.appendChild(col);
            }
        }
        this.Utils.addLisN("cell", "click", this.eventClicked, this);
    },

    playagain: function () {
        "use strict";
        var btn = document.createElement("BUTTON"),
            t = document.createTextNode("PLAY AGAIN");
        btn.appendChild(t);
        btn.setAttribute('id', 'restart_btn');
        this.Utils.element('display_msg').appendChild(btn);
        this.Utils.element('restart_btn').addEventListener('click', function () { location.reload(); });
    },

    Utils: {

        MSGS: {
            turn: "It's your turn now",
            wait: "Wait for your turn",
            occupied: "Place occupied..Try a different place",
            start: {
                1: "Other player has joined..You can start playing now",
                2: "You can start playing now"
            },
            gameover: "GAME OVER !!!"
        },

        byName: function (name) {
            "use strict";
            return document.getElementsByName(name);
        },

        element: function (id) {
            "use strict";
            return document.getElementById(id);
        },

        addLisN: function (name, type, func, arg) {
            "use strict";
            var arr = this.byName(name),
                i,
                clickHandler;
            clickHandler = function () {
                func(arg, event);
            };
            for (i in arr) {
                if (arr.hasOwnProperty(i)) {
                    arr[i].addEventListener(type, clickHandler);
                }
               
            }
        }
    },

    eventClicked: function (obj, e) {
        "use strict";
        var e_id = e.target.id;
        if (obj.playerNum === obj.currentTurn) {
            if (!(obj.Utils.element(e_id).getAttribute('class'))) {
                socket.emit('myClick', e_id);
                obj.Utils.element('display_msg').innerHTML = "";
            } else {
                obj.Utils.element('display_msg').innerHTML = obj.Utils.MSGS.occupied;
            }
        } else {
            obj.Utils.element('display_msg').innerHTML = obj.Utils.MSGS.wait;
        }
    },

    allTheSocketListeners: function () {
        "use strict";
        var obj = this;

        socket.on('player-num', function (num) {
            obj.playerNum = num;
            obj.Utils.element('player_num').innerHTML = "PLAYER " + num;
        });

        socket.on('game-started', function () {
            obj.Utils.element('display_msg').innerHTML = obj.Utils.MSGS.start[obj.playerNum];
        });

        socket.on('display-image', function (id, sym) {
            obj.Utils.element(id).setAttribute('class', sym);
            obj.currentTurn = obj.currentTurn === 1 ? 2 : 1;
        });

        socket.on('current-turn', function () {
            obj.Utils.element('display_msg').innerHTML = obj.Utils.MSGS.turn;
        });

        socket.on('game-over', function () {
            obj.Utils.element('display_msg').innerHTML = obj.Utils.MSGS.gameover;
            obj.playagain();
        });

        socket.on('play-again', function (player) {
            obj.Utils.element('display_msg').innerHTML = "PLAYER " + player + " WON !!!";
            obj.playagain();
        });
    }
};

Client.initialize();