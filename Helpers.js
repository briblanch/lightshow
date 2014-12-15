var Hue         = require('./Hue');

var api         = Hue.api;
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
        var transition = fadeOut != undefined ? fadeOut : 2;

        var off = lightState.create().transition(transition).off();

        // Uses group API to turn all lights off
        api.setGroupLightState(0, off);
    },
    hueOff: function(lightsArray, fadeOut) {
        var transition = fadeOut != undefined ? fadeOut : 2;

        var off = lightState.create().transition(transition).off();
        // Turn the lights off
        this.setLights(lightsArray, off);
    },
    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

module.exports = Helpers;
