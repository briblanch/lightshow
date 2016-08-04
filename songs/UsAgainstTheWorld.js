var Song        = require('../Song');
var Element    	= require('../Element');
var Sequence    = require('../Sequence');
var notes       = require('../notes');

var Hue         = require('../Hue');
var duino       = require('../arduino');

var api         = Hue.api;
var lightState  = Hue.lightState;
var Rf          = duino.Rf;

var lights = require('../hue.json').lights;
var scenes = require('../scenes');

var UsAgainstTheWorld = new Song({
    title: "Us Against The World",
    hook: [notes.c3, notes.g3, notes.c4],
    startingElement: 'bridge',
    elements: {
        'intro': new Element({
            repeats: 6,
            sequences: [
                new Sequence({
                    notes: [notes.c3],
                    action: function() {
                        Rf.off('1');
                        Rf.off('2');
                        scenes.allOff();
                        setTimeout(function() {
                            scenes.setLightsOn([lights.piano], [0, 100, 80]);
                            scenes.setLightsOn([lights.bed], [181, 100, 80]);
                        }, 500);
                    },
                    actionRepeats: 1,
                }),
                new Sequence({
                    notes: [notes.f2]
                }),
                new Sequence({
                    notes: [notes.g2]
                })
            ],
            onEnd: function() {
                scenes.allOff(3500);
            },
            nextElement: 'bridge'
        }),
        'bridge': new Element({
            repeats: 1,
            sequences: [
                new Sequence({
                    notes: [notes.c3],
                    action: function() {
                        scenes.flash([lights.piano, lights.bed, lights.spotlight], 400, [181, 0, 302]);
                    },
                    actionRepeats: 1
                }),
                new Sequence({
                    notes: [notes.f2]
                }),
                new Sequence({
                    notes: [notes.g2]
                }),
            ],
            onEnd: function() {
                setTimeout(function() {
                    scenes.stopFlash();
                    scenes.allOff(1500);
                }, 3500);
            },
            nextElement: 'outro'
        }),
        'outro': new Element({
            repeats: 2,
            sequences: [
                new Sequence({
                    notes: [notes.c3],
                    action: function() {
                        scenes.redWash([lights.piano], 2000);
                    },
                    actionRepeats: 1
                }),
                new Sequence({
                    notes: [notes.g2]
                })
            ],
            onEnd: function() {
                scenes.allOff(3000);
            }
        })
    }
});

module.exports = UsAgainstTheWorld;
