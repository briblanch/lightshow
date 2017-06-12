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
    washStrobe: new param.RangeParam(11),
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
    this._lasers = 'bothStrobe';
    this.laserStrobeRotate(strobe, rotate);
  },
  laserStrobeRotate(strobe = 0, rotate = 0) {
    this._laserStrobeSpeed = strobe;
    this._laserRotateSpeed = rotate;
  },
  off() {
    this._mode = 'off';
    this._lasers = 'off';
    this.washesOff();
    this.setWashValue(0);
    this.derbyOff();
    this.strobeOff();
  },
  washesOff() {
    this.setWashValue(0);
  },
  washesOn(value = 0) {
    this.setWashValue(value);
  },
  strobeWash(speed = 0) {
    this.washStrobe = speed;
  },
  setWashValue(value = 0) {
    for (var key in this) {
      if (key.includes('_wash')) {
        this.params[key].setValue(this, value);
      }
    }
  },
  strobeOn(value = 200) {
    this._strobe = value;
  },
  strobeOff() {
    this._strobe = 0;
  },
  derbyOn(color = 0, strobe = 0, speed = 0) {
    this._derbyColor = color;
    this._derbyStrobe = strobe;
    this._derbySpeed = speed;
  },
  derbyOff() {
    this._derbyColor = 0;
    this._derbyStrobe = 0;
    this._derbySpeed = 0;
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
