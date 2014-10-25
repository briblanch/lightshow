var Hue = require('./Hue');
var HueConfig = require('./hue.json')
var api = Hue.api;
var lightState  = Hue.lightState;

var Helpers = {
  setLights: function(lights, lightConfig) {
    if (lights.length) {
        for (var i = 0; i < lights.length; i++) {
            api.setLightState(lights[i], lightConfig);
        }
    } else {
        api.setLightState(lights, lightConfig)
    }

  },
  allHueOff: function(fadeOut) {
    var transition;

    if (fadeOut == undefined) {
      transition = 2;
    } else {
      transition = fadeOut;
    }

    var off = lightState.create().transition(transition).off();
    api.setGroupLightState(0, off);
  },
  hueOff: function(lightsArray, fadeOut) {
    var transition;

    if (fadeOut == undefined) {
        transition = 2;
    } else {
        transition = fadeOut;
    }

        var off = lightState.create().transition(transition).off();
        this.setLights(lightsArray, off);
    },
    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

module.exports = Helpers;
