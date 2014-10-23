var Song       	= require('../Song');
var Element     = require('../Element');
var Sequence    = require('../Sequence');
var notes       = require('../notes');

var Hue         = require('../Hue');
var duino       = require('../arduino');

var api         = Hue.api;
var lightState  = Hue.lightState;
var RC          = duino.RC;

var timesPlayed = 0;

var setLights = function(lightsArray, lightConfig) {
    for (var i = 0; i < lightsArray.length; i++) {
        api.setLightState(lightsArray[i], lightConfig);
    }
};

var lights = {
    lowWhite: lightState.create().hsl(319, 0, 10).transition(2).on(),
    highWhite: lightState.create().hsl(319, 0, 30).transition(2).on(),
    initYellow: lightState.create().xy(.4472, .4879).brightness(60).transition(0).on(),
    highYellow: lightState.create().xy(.4472, .4879).brightness(60).transition(2).on(),
    lowYellow: lightState.create().xy(.4472, .4879).brightness(30).transition(2).on(),
    off: lightState.create().transition(0).off(),
    blue: lightState.create().transition(0).hsl(250,100,70).on()
}

var isHigh = false;
var flickerInterval;

var Yellow = new Song({
    title: "Yellow",
    hook: [notes.f3s, notes.b3, notes.e4b], // Not sure
    elements: {
        'intro': new Element({
            repeats: 1,
            start: new Sequence({
                notes: [notes.b2],
                action: function() {
                    RC.sendOff(duino.channel);
                    api.setGroupLightState(0, lights.off);
                    setLights([1, 2, 4], lights.highWhite);
                    isHigh = true;
                    flickerInterval = setInterval(function() {
                        if (isHigh) {
                            setLights([1, 2, 4], lights.lowWhite);
                            isHigh = false;
                        } else {
                            setLights([1, 2, 4], lights.highWhite);
                            isHigh = true;
                        }
                    }, 3000);
                },
                actionRepeats: 1,
            }),
            middle: [
                new Sequence({
                    notes: [notes.f2s],
                    action: null
                })
            ],
            end: new Sequence({
                notes: [notes.d3b],
                action: null
            }),
            nextElement: 'verse1',

        }),
        'verse1': new Element({
            repeats: 1,
            start: new Sequence({
                notes: [notes.b2],
                action: null
            }),
            middle: [
                new Sequence({
                    notes: [notes.f2s],
                    action: null
                }),
                new Sequence({
                notes: [notes.b2],
                action: function() {
                    clearInterval(flickerInterval);
                    flickerInterval = false;
                    setLights([1, 2, 3, 4], lights.initYellow);
                    isHigh = true;
                    flickerInterval = setInterval(function() {
                        if (isHigh) {
                            setLights([1, 2, 4], lights.lowYellow);
                            isHigh = false;
                        } else {
                            setLights([1, 2, 4], lights.highYellow);
                            isHigh = true;
                        }
                    }, 3000);
                },
                actionRepeats: 1
            }),
            ],
            end: new Sequence({
                notes: [notes.d3b],
                action: null
            }),
            nextElement: 'verse2'
        }),
        'verse2' : new Element({
            repeats: 1,
            start: new Sequence({
                notes: [notes.b2],
                action: null
            }),
            middle: [
                new Sequence({
                    notes: [notes.f2s],
                    action: null
                }),
            ],
            end: new Sequence({
                notes: [notes.b2],
                action: null
            }),
            nextElement: 'chorus'
        }),
        'chorus': new Element({
            repeats: 4,
            start: new Sequence({
                notes: [notes.e4],
                action: null
            }),
            end: new Sequence({
                notes: [notes.e4b],
                action: function() {
                    timesPlayed ++;
                    if (timesPlayed == 4) {
                        clearInterval(flickerInterval);
                    }
                },
            }),
            nextElement: 'outro'
        }),
        'outro': new Element({
            repeats: 1,
            start: new Sequence({
                notes: [notes.b2],
                action: function() {
                    api.setGroupLightState(1, lights.off);
                    api.setLightState(3, lights.blue);
                }
            }),
            end: new Sequence({
                notes: [notes.g6],
                action: null
            }),
        })
    }
});

module.exports = Yellow;
