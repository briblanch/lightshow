'use strict';

let Promise = require('promise');
let Color   = require('color');

let randomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let scene = {
  api: null,
  intervals: [],
  stop() {
    for (let interval of intervals) {
      clearInterval(interval);
    }
  },
  delay(time) {
    return new Promise(fulfill => {
      setTimeout(fulfill, time);
    });
  },
  randomHsb() {
    let hsb = [];

    hsb.push(randomInt(0, 359)); // h
    hsb.push(randomInt(0, 100)); // s
    hsb.push(randomInt(0, 100)); // b

    return hsb
  },
  hsbForColor(color) {
    if (color) {
      return color.hsvArray();
    } else {
      return this.randomHsb();
    }
  },
  setLightState(lights = [], lightState = null) {
    let lightResults = [];

    if (!(lights instanceof Array)) {
      lights = [lights];
    }

    for (let light of lights) {
      lightResults.push(this.api.setLightState(light, lightState));
    }

    return lightResults
  },
  off(lights, transition = 500) {
    return this.setLightState(lights, lightState.create().transition(transition).off());
  },
  on(light, color, transition = 500) {
    let lightState = lightState.create().transition.on();
    lightState.hsb.apply(lightState, this.hsbForColor(color));

    return this.setLightState(light, lightState);
  },
  redWash(lights = [], brightness = 80, transition = 1000) {
    let red = lightState.create().hsb(0, 100, brightness).transition(transition).on();
    return Promise.all(this.setLightState(lights, red))
  },
  blueWash(lights = [], brightness = 80, transition = 1000) {
    let blue = lightState.create().hsb(240, 100, brightness).transition(transition).on();
    return Promise.all(this.setLightState(lights, blue));
  },
  flicker(lights, color, transition = 1000, speed = 1000) {
    let isHigh = false;

    let lightState = lightState.create().transition(transition).on();
    lightState.hsb.apply(lightState, color.hsvArray());

    let _flicker = () => {
      isHigh ? setLightState(lights, low) : setLightState(lights, high);
      isHigh = !isHigh;
    };

    _flicker();

    this.intervals.push(setInterval(_flicker, speed));
  },
  colorLoop(lights, colors, transition = 1000, speed = 100) {

    let _colorLoop = () => {
      let hsb = this.hsbForColor(colors[randomInt(0, color.length - 1)]);

      let lightState = lightState.create().transition(transition).on();
      lightState.hsb.apply(lightState, hsb);
    };

    _colorLoop();

    this.intervals.push(setInterval(_colorLoop, speed));
  },
  flash(lights, colors, speed = 500) {
    let previousLight;

    let _flash = () => {
      let randomLight = lights[randomInt(0, lights.length - 1)];
      let hsb = this.hsbForColor(colors[this.colors.length - 1]);

      while(randomLight == previousLight) {
        randomLight = lights[randomInt(0, lights.length - 1)];
      }

      let lightState = lightState.create().hsb().transition(0).on();
      lightState.hsb.apply(lightState, hsb);

      if (previousLight) {
        this.off(previousLight, 0);
      }

      this.setLightState(randomLight, lightState);

      previousLight = selectedLight;
    };

    _flash();

    this.intervals.push(setInterval(_flash, speed));


  },
  groupFlash(lights, color, timeIn, timeOut, timeOn = 500) {
    let self = this;
    let lightStateOn = lightState.create().transition(timeIn).on();
    lightStateOn.hsb.apply(this.hsbForColor(color));

    return Promise((fulfill, reject) => {
      self.setLightState(lights, color)
        .then(() => {
          return self.delay(timeOn)
        })
        .then(() => {
          return self.off(lights, timeOut);
        })
        .then(() => {
          fulfill();
        });
    });
  }
},

grou

var hue     = require("node-hue-api");
var hueInfo = require('./hue.json');

var duino   = require('./arduino');
var Rf      = duino.Rf;

var HueApi = hue.HueApi;
var lightState = hue.lightState;

var displayResult = function(result) {
  console.log(JSON.stringify(result, null, 2));
};

var hostname = hueInfo.ipaddress,
  username = hueInfo.username,
  api = new HueApi(hostname, username);

var defaultBrightness = 80;
var defaultTransition = 1000;

var h = 0
var s = 1
var b = 2

var x = 0;
var y = 1;

var flickerInterval;
var flashInterval;

var setLightState = function(lights, color) {
  if (lights) {
    for (var i = 0; i < lights.length; i++) {
      api.setLightState(lights[i], color);
    }
  } else {
    api.setGroupLightState(0, color);
  }
};

var getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.blueWash = function(lights, brightness, transition) {
  brightness = brightness || defaultBrightness;
  transition = transition || defaultTransition;
  var blue = lightState.create().hsb(240, 100, brightness).transition(transition).on();

  setLightState(lights, blue);
};

exports.redWash = function(lights, brightness, transition) {
  brightness = brightness || defaultBrightness;
  transition = transition || defaultTransition;
  var red = lightState.create().hsb(0, 100, brightness).transition(transition).on();

  setLightState(lights, red);
};

exports.flicker = function(hsb, lights, transition, duration) {
  transition = transition || 2000;

  var isHigh = false;
  var low = lightState.create().hsb(hsb[h], hsb[s], 10).transition(transition).on();
  var high = lightState.create().hsb(hsb[h], hsb[s], 90).transition(transition).on();

  var _flicker = function() {
    isHigh ? setLightState(lights, low) : setLightState(lights, high);
    isHigh = !isHigh;
  };

  _flicker();

  flickerInterval = setInterval(_flicker, duration);
};

exports.stopFlicker = function() {
  if (flickerInterval) {
    clearInterval(flickerInterval);
    flickerInterval = null;
  }
};

exports.colorLoop = function(lights, transition, duration, colors) {
  transition = transition || 1000;

  var _colorLoop = function() {
    var hsb;

    if (!colors) {
      hsb = []
      hsb[0] = getRandomInt(0, 359);
    } else {
      var randomIndex = getRandomInt(0, colors.length - 1);
      hsb = colors[randomIndex];
    }

    var randomBrightness = getRandomInt(1, 100);

    var color = lightState.create().hsb(hsb[h], 100, randomBrightness).transition(transition).on();
    var randomLight = getRandomInt(0, lights.length - 1);

    setLightState([lights[randomLight]], color);
  };

  _colorLoop();

  flashInterval = setInterval(_colorLoop, duration);
};

exports.colorLoopXy = function(lights, transition, duration, colors) {
  transition = transition || 1000;

  var _colorLoop = function() {
    var randomBrightness = getRandomInt(1, 100);
    var color = lightState.create().xy(colors[x], colors[y]).brightness(randomBrightness).transition(transition).on();
    var randomLight = getRandomInt(0, lights.length - 1);

    setLightState([lights[randomLight]], color);
  };

  _colorLoop();

  flashInterval = setInterval(_colorLoop, duration);
};

exports.flash = function(lights, duration, colors) {
  var previousLight;
  var that = this;

  let _flash = () => {
    var hue;
    var randomLight = getRandomInt(0, lights.length - 1);
    var selectedLight = lights[randomLight];

    while(selectedLight == previousLight) {
      var randomLight = getRandomInt(0, lights.length - 1);
      var selectedLight = lights[randomLight];
    }

    if (!colors) {
      hue = getRandomInt(0, 359);
    } else {
      var randomIndex = getRandomInt(0, colors.length - 1);
      hue = colors[randomIndex];
    }

    var randomBrightness = getRandomInt(1, 100);
    var color = lightState.create().hsb(hue, 100, 75).transition(0).on();

    if (previousLight) {
      that.off(previousLight, 1);
    }

    setLightState([selectedLight], color);

    previousLight = selectedLight;
  };

  _flash();

  flashInterval = setInterval(_flash, duration);
};

exports.flashASFOS = function(lights, duration, colors) {
  var previousLight;
  var that = this;

  var _flash = function() {
    var hue;
    var randomLight = getRandomInt(0, lights.length - 1);
    var selectedLight = lights[randomLight];

    while(selectedLight == previousLight) {
      var randomLight = getRandomInt(0, lights.length - 1);
      var selectedLight = lights[randomLight];
    }

    if (!colors) {
      hue = getRandomInt(0, 359);
    } else {
      if (selectedLight == 1 || selectedLight == 2 || selectedLight == 4) {
        hue = colors[0];
      } else {
        hue = colors[1];
      }
    }

    var randomBrightness = getRandomInt(1, 100);
    var color = lightState.create().hsb(hue, 100, 75).transition(0).on();

    if (previousLight) {
      that.off(previousLight, 1);
    }

    setLightState([selectedLight], color);

    previousLight = selectedLight;
  };

  _flash();

  flashInterval = setInterval(_flash, duration);
};

exports.stopFlash = function() {
  if (flashInterval) {
    clearInterval(flashInterval);
    flashInterval = null;
  }
};

exports.groupFlash = function(lights, transitionOn, transitionOff, hsb) {
  var color = lightState.create().hsb(hsb[h], hsb[s], hsb[b]).transition(transitionOn).on();

  setLightState(lights, color);

  setTimeout(function() {
    setLightState(lights, lightState.create().transition(transitionOff).off());
  }, transitionOn + 500);
};

exports.allOff = function(transition) {
  transition = transition || 500;
  api.setGroupLightState(0, lightState.create().transition(transition).off());
};

exports.off = function(light, transition) {
  transition = transition || 500

  api.setLightState(light, lightState.create().transition(transition).off());
};

exports.allOn = function() {
  api.setGroupLightState(0, lightState.create().on());
};

exports.setLightsOn = function(lights, hsb, transition) {
  transition = transition || 500;
  var color = lightState.create().hsb(hsb[h], hsb[s], hsb[b]).transition(transition).on();

  setLightState(lights, color);
};

exports.setLightsOnXy = function(lights, colors, brightness, transition) {
  transition = transition || 500;
  brightness = brightness || 80;
  var color = lightState.create().xy(colors[x], colors[y]).brightness(brightness).transition(transition).on();

  setLightState(lights, color);
};

exports.setLightsOff = function(lights, transition) {
  transition = transition || 500;
  var off = lightState.create().transition(transition).off();

  setLightState(lights, off);
};

exports.strobeBlackLightOn = function() {
  Rf.on('1');
};

exports.strobeBlackLightOff = function() {
  Rf.off('1');
};

exports.steadyBlackLightOn = function() {
  Rf.on('2');
};

exports.steadyBlackLightOff = function() {
  Rf.off('2');
};

exports.allBlackLightsOff = function() {
  Rf.off('1');
  Rf.off('2');
};

exports.allBlackLightsOn = function() {
  Rf.on('1');
  Rf.on('2');
};
