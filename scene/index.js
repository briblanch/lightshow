'use strict';

let Color       = require('color');
let Promise     = require('bluebird');
let Bottleneck  = require('bottleneck');

// let Rf          = require('../arduino').Rf;
let hue         = require('./hue/hue');

let api         = hue.api;
let lights      = hue.lights;
let lightState  = hue.lightState;

Promise.config({cancellation: true});

let limiter = new Bottleneck(1, 2); // Allow unlimited concurent requests firing no less than 2 ms apart

let randomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let intervalPromise;

let commonColors = {
  red: Color('#FF0000'),
  blue: Color('#0033FF'),
  green: Color('#00FF00'),
  yellow: Color('#15FF00'),
  pink: Color('#FF00CE'),
  white: Color('#FFFFFF'),
  warm: Color('#E3F4B7')
};

let proto = {
  api: null,
  stopLoop: false,
  stop(time = 500) {
    this.stopLoop = true;
    limiter.stopAll();
    limiter = new Bottleneck(1 , 2);

    return this.delay(time);
  },
  reset() {
    this.stopLoop = false;
  },
  delay(time) {
    return Promise.delay(time);
  },
  randomHsb() {
    let hsb = [];

    hsb.push(randomInt(0, 359)); // h
    hsb.push(randomInt(0, 100)); // s
    hsb.push(randomInt(20, 100)); // b

    return hsb
  },
  hsbForColor(color) {
    if (color) {
      return color.hsvArray();
    } else {
      return this.randomHsb();
    }
  },
  repeat(func, speed) {
    if (!this.stopLoop) {
      Promise.delay(speed).then(func);
    } else {
      this.reset();
    }
  },
  setLightState(lights = [], state = null) {
    let lightResults = [];

    if (!(lights instanceof Array)) {
      lights = [lights];
    }

    for (let light of lights) {
      lightResults.push(limiter.schedule(this._setLightState, light, state));
    }

    return Promise.all(lightResults);
  },
  _setLightState(light, state) {
    return new Promise((resolve, reject) => {
      api.setLightState(light, state)
        .then(resolve, reject);
    });
  },
  off(lights, transition = 500) {
    let state = lightState.create().transition(transition).off();
    return this.setLightState(lights, state);
  },
  on(lights, color, transition = 500) {
    let state = lightState.create().transition(transition).on();

    if (color) {
      state.hsb.apply(state, this.hsbForColor(color));
    }

    return this.setLightState(lights, state);
  },
  redWash(lights = [], brightness = 80, transition = 1000) {
    let red = lightState.create().hsb(0, 100, brightness).transition(transition).on();
    return this.setLightState(lights, red)
  },
  blueWash(lights = [], brightness = 80, transition = 1000) {
    let blue = lightState.create().hsb(240, 100, brightness).transition(transition).on();
    return this.setLightState(lights, blue);
  },
  flicker(lights, color, transition = 1000, speed = 1000) {
    this.reset();

    let isHigh = false;

    let stateHigh = lightState.create().transition(transition).on();
    stateHigh.hsb(color.hue(), color.saturation(), 100);

    let stateLow = lightState.create().transition(transition).on();
    stateLow.hsb(color.hue(), color.saturation(), 10);

    let _flicker = () => {
      let promise;

      if (isHigh) {
        promise = this.setLightState(lights, stateLow)
      } else {
        promise = this.setLightState(lights, stateHigh);
      }

      promise.finally(() => {
        isHigh = !isHigh;
        this.repeat(_flicker, speed);
      });
    };

    _flicker();
  },
  colorLoop(lights, onePerGo, colors = [null], transition = 1000, speed = 1000) {
    this.reset();

    let previousLight;
    let _colorLoop = () => {
      let hsb = this.hsbForColor(colors[randomInt(0, colors.length - 1)]);

      let state = lightState.create().transition(transition).on();
      state.hsb.apply(state, hsb);

      if (onePerGo) {
        let randomLight = lights[randomInt(0, lights.length - 1)];

        while(randomLight == previousLight) {
          randomLight = lights[randomInt(0, lights.length - 1)];
        }

        this.setLightState(randomLight, state)
          .finally(() => this.repeat(_colorLoop, speed));
      } else {
        this.setLightState(lights, state)
          .finally(() => {
            this.repeat(_colorLoop, speed);
          });
      }
    };

    _colorLoop();
  },
  flash(lights, colors = [null], speed = 500, colorMap) {
    this.reset();

    let previousLight = 1;

    if (!(colors instanceof Array)) {
      colors = [colors];
    }

    let _flash = () => {
      let hsb;
      let randomLight = lights[randomInt(0, lights.length - 1)];

      while(randomLight == previousLight) {
        randomLight = lights[randomInt(0, lights.length - 1)];
      }

      if (!colorMap) {
        hsb = this.hsbForColor(colors[randomInt(0, colors.length - 1)]);
      } else {
        let colorsForLight = colorMap[randomLight];

        if (colorsForLight) {
          hsb = this.hsbForColor(colorsForLight[randomInt(0, colorsForLight.length - 1)]);
        } else {
          hsb = this.hsbForColor(colors[randomInt(0, colors.length - 1)]);
        }
      }

      let state = lightState.create().hsb().transition(0).on();
      state.hsb.apply(state, hsb);

      this.off(previousLight, 0)
        .then(() => this.setLightState(randomLight, state))
        .finally(() => this.repeat(_flash, speed));

      previousLight = randomLight;
    };

    _flash();
  },
  groupFlash(lights, color, timeIn, timeOut, timeOn = 500) {
    let stateOn = lightState.create().transition(timeIn).on();
    stateOn.hsb.apply(stateOn, this.hsbForColor(color));
    stateOn.brightness(100);

    return this.setLightState(lights, stateOn)
      .then(() => this.delay(timeOn))
      .then(() => this.off(lights, timeOut));
  },
  allOn(transition = 500) {
    return this.on(lights.allLights, transition);
  },
  allOff(transition = 500) {
    return this.off(lights.allLights, transition);
  },
  blkLightsOn() {
    return new Promise((resolve, reject) => {
      Rf.on(1),
      Rf.on(2)
      resolve();
    });
  },
  blkLightsOff() {
    return new Promise((resolve, reject) => {
      Rf.off(1);
      Rf.off(2);
      resolve();
    });
  }
}

let scene = function() {
  return Object.assign({}, proto);
};

module.exports = {
  createScene: scene,
  lights,
  color: Color,
  commonColors
};
