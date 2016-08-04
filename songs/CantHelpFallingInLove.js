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

var CantHelpFallingInLove = new Song({
    title: "Can't help falling in love",
    hook: [notes.e3, notes.g3, notes.c4],
    elements: {
        'intro': new Element({
            repeats: 2,
            sequences: [new Sequence({
                notes: [notes.e3],
                action: function() {
                    Rf.off('1');
                    Rf.off('2');
                    scenes.allOff();
                    scenes.redWash([lights.piano], 50, 2000);
                },
                actionRepeats: 1,
            }),
            new Sequence({
                notes: [notes.d5]
            })],
        })
    }
});

module.exports = CantHelpFallingInLove;
