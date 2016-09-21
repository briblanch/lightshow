'use strict';

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
