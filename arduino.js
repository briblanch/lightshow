var duino = require('duino');

var board = new duino.Board({
  	debug: true
});

var RC = new duino.RC({
  	board: board,
  	pin: "10"
});

var arduino = {
	board: board,
	RC: RC,
	channel: 'E2'
}

module.exports = arduino;
