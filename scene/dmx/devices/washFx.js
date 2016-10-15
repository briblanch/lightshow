let fivetwelve  = require('fivetwelve/es5');
let output      = require('../internals/output');

let param       = fivetwelve.param;

const fullRangeOptions = {
  min: 0, max: 255
};

function params() {
  return {
    _mode: new param.MappedParam(1, {
      off: [0, 15],
      wash: [16, 30],
      lasers: [31, 45],
      derby: [46, 60],
      strobes: [61, 75],
      washLaserDerby: [76, 90],
      washLaserStrobe: [91, 105],
      washDerbyStrobe: [106, 120],
      laserDerbyStrobe: [121, 135],
      washLaser: [136, 150],
      washDerby: [151, 165],
      washStrobe: [166, 180],
      laserDerby: [181, 195],
      laserStrobe: [196, 210],
      derbyStrobe: [211, 225],
      all: [226, 255]
    }),
    _autoSpeed: new param.RangeParam(2, fullRangeOptions),
    _wash1: new param.RangeParam(3, fullRangeOptions),
    _wash2: new param.RangeParam(4, fullRangeOptions),
    _wash3: new param.RangeParam(5, fullRangeOptions),
    _wash4: new param.RangeParam(6, fullRangeOptions),
    _wash5: new param.RangeParam(7, fullRangeOptions),
    _wash6: new param.RangeParam(8, fullRangeOptions),
    _wash7: new param.RangeParam(9, fullRangeOptions),
    _wash8: new param.RangeParam(10, fullRangeOptions),
    _washStrobe: new param.RangeParam(11),
    _derbyColor: new param.RangeParam(12, fullRangeOptions),
    _derbyStrobe: new param.RangeParam(13, fullRangeOptions),
    _derbySpeed: new param.RangeParam(14, fullRangeOptions),
    _strobe: new param.RangeParam(15, fullRangeOptions),
    _lasers: new param.MappedParam(16, {
      off: [0, 9],
      red: [10, 49],
      green: [50, 89],
      bothStrobeAlt: [90, 129],
      redGreenStrobe: [130, 169],
      greenRedStrobe: [170, 209],
      bothStrobe: [210, 255]
    }),
    _laserStrobeSpeed: new param.RangeParam(17, fullRangeOptions),
    _laserRotateSpeed: new param.RangeParam(18, fullRangeOptions)
  };
};

let washFxMixin = {
  redLaserOn(strobe = 0, rotate = 0) {
    this._lasers = 'red';
    this.laserStrobeRotate(strobe, rotate);
  },
  greenLaserOn(strobe = 0, rotate = 0) {
    this._lasers = 'green';
    this.laserStrobeRotate(strobe, rotate);
  },
  bothLasers(strobe = 0, rotate = 0) {
    this._lasers = 'redGreenStrobe';
    this.laserStrobeRotate(strobe, rotate);
  },
  laserStrobeRotate(strobe = 0, rotate = 0) {
    this._laserStrobeSpeed = strobe;
    this._laserRotateSpeed = rotate;
  }
};

let createWashFx = function(channel) {
  let device = new fivetwelve.DmxDevice(channel, params(channel));
  device = Object.assign(device, washFxMixin);
  device.setOutput(output);

  return device;
};

module.exports = {
  createWashFx,
  washFxMixin
};
