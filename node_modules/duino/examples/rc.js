var arduino = require('../');

var board = new arduino.Board({
  	debug: true
});

var RC = new arduino.RC({
  	board: board,
  	pin: "09"
});

board.on('ready', function(){
  	setTimeout(function() {
  		RC.sendOff('E2'); 	
  	}, 2000);
});