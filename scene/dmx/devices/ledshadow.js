let fivetwelve  = require('fivetwelve/es5');
let output      = require('../internals/output');

let param       = fivetwelve.param;

function params() {
  const brightnessOptions = {
    rangeStart: 1, rangeEnd: 255
  };

  return {
    _mode: new param.RangeParam(1),
    _strobe: new param.RangeParam(2),
    _brightness: new param.RangeParam(3, brightnessOptions)
  };
};

let ledMixin = {
  on(brightness = 1) {
    // 0 is on for this particular light
    this._strobe = 0;
    this._brightness = 1 - brightness;
  },
  off() {
    this._brightness = 1;
  },
  strobe(speed = 0.5, brightness = 1) {
    this._brightness = 1 - brightness;
    this._strobe = speed;
  }
};

let createLed = function(channel) {
  let device = new fivetwelve.DmxDevice(channel, params(channel));
  device.setOutput(output);

  return device;
};

module.exports = {
  createLed,
  ledMixin
};
