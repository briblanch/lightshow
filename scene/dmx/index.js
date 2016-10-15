let fivetwelve    = require('fivetwelve/es5');
let ledShadow     = require('./devices/ledshadow');
let wash          = require('./devices/washFx');

let createLed     = ledShadow.createLed;
let ledMixin      = ledShadow.ledMixin;

let pianoBlackLight = createLed(1);
let washBlackLight  = createLed(4);
let washFx          = wash.createWashFx(7);

let blackLights = new fivetwelve.DeviceGroup([pianoBlackLight, washBlackLight]);

pianoBlackLight = Object.assign(pianoBlackLight, ledMixin);
washBlackLight = Object.assign(washBlackLight, ledMixin);
blackLights = Object.assign(blackLights, ledMixin);

module.exports = {
  pianoBlackLight,
  washBlackLight,
  blackLights,
  washFx
};
