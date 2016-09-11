var duino = require('duino');

var board = new duino.Board({
  	debug: true,
	device: "ttyACM*"
});

var Rf = new duino.Rf({
  	board: board,
  	pin: "10"
});

var arduino = {
	board: board,
	Rf: Rf
}

module.exports = arduino;
