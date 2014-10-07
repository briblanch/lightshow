var Hue = require('./Hue');
var HueConfig = require('./hue.json')
var api = Hue.api;
var lightState  = Hue.lightState;

var Helpers = {
  setLights: function(lightsArray, lightConfig) {
    for (var i = 0; i < lightsArray.length; i++) {
        api.setLightState(lightsArray[i], lightConfig);
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
  }
}

module.exports = Helpers;
