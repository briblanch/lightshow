var Song       	= require('../Song');
var Element     = require('../Element');
var Sequence    = require('../Sequence');
var notes       = require('../notes');
var scenes      = require('../scenes');

var Hue         = require('../Hue');
var duino       = require('../arduino');
var lights      = require('../hue.json').lights;

var api         = Hue.api;
var lightState  = Hue.lightState;
var Rf          = duino.Rf;

var Yellow = new Song({
    title: "Yellow",
    hook: [notes.f3s, notes.b3, notes.e4b], // Not sure
    elements: {
        'intro': new Element({
            repeats: 1,
            sequences: [new Sequence({
                notes: [notes.b2],
                action: function() {
                    Rf.off('1');
                    Rf.off('2');
                    scenes.allOff();
                    scenes.colorLoop([lights.left, lights.right, lights.desk], 500, 500, [[195, 0, 1]]);
                },
                actionRepeats: 1,
            }),
            new Sequence({
                    notes: [notes.f2s],
                    action: null
            }),
            new Sequence({
                notes: [notes.d3b],
                action: null
            })],
            nextElement: 'verse1',

        }),
        'verse1': new Element({
            repeats: 1,
            sequences: [new Sequence({
                notes: [notes.b2],
                action: null
            }),
            new Sequence({
                notes: [notes.f2s],
                action: null
            }),
            new Sequence({
                notes: [notes.b2],
                action: function() {
                    scenes.stopFlash();
                    scenes.setLightsOnXy([lights.left, lights.right, lights.desk, lights.bed, lights.spotlight, lights.piano], [.4472, .4879], 80, 500);
                    setTimeout(function() {
                        scenes.colorLoopXy([lights.left, lights.right, lights.desk, lights.bed, lights.spotlight, lights.piano], 500, 500, [.4472, .4879]);
                    }, 700);
                },
                actionRepeats: 1
            }),
            new Sequence({
                notes: [notes.d3b],
                action: null
            })],
            nextElement: 'verse2'
        }),
        'verse2' : new Element({
            repeats: 1,
            sequences: [new Sequence({
                notes: [notes.b2],
                action: null
            }),
            new Sequence({
                notes: [notes.f2s],
                action: null
            }),
            new Sequence({
                notes: [notes.b2],
                action: null
            })],
            nextElement: 'chorus'
        }),
        'chorus': new Element({
            repeats: 4,
            sequences: [new Sequence({
                notes: [notes.e4],
                action: null
            }),
            new Sequence({
                notes: [notes.e4b],
            })],
            nextElement: 'outro',
            onEnd: function() {
                scenes.stopFlash();
            }
        }),
        'outro': new Element({
            repeats: 1,
            sequences: [new Sequence({
                notes: [notes.b2],
                action: function() {
                    scenes.allOff(1);
                    scenes.blueWash([lights.spotlight], 80, 1);
                }
            }),
            new Sequence({
                notes: [notes.g6],
                action: null
            })],
        })
    }
});

module.exports = Yellow;
