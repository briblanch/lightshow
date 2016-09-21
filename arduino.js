'use strict';

let os    = require('os');
let duino = require('duino');

const board = new duino.Board({
  debug: true,
  device: os.platfor == 'darwin' ? null : "ttyACM*"
});

const Rf = new duino.Rf({
  board: board,
  pin: "10"
});

const arduino = {
	board: board,
	Rf: Rf
}

module.exports = arduino;
