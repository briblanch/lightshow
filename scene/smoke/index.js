let five = require("johnny-five");
let board = new five.Board({repl: false});

let relay;

board.on('ready', () => {
  relay = new five.Relay(10);
});

let on = () => {
  if (relay) {
    console.log('relay on');
    relay.on();
  }
};

let off = () => {
  if (relay) {
    console.log('relay off');
    relay.off();
  }
};

process.on('message', (m) => {
  switch (m) {
    case 'off':
      off();
      break;
    case 'on':
      on();
      break;
    default:
      break;
  }
});
