var Song        = require('../Song');
var Element     = require('../Element');
var Sequence    = require('../Sequence');
var notes       = require('../notes');
var Helpers     = require('../Helpers');

var Hue         = require('../Hue');
var duino       = require('../arduino');
var lights      = require('../hue.json').lights;

var api         = Hue.api;
var lightState  = Hue.lightState;
var RC          = duino.RC;

var exec        = require('shelljs').exec;

var lightColors = {
    purple: lightState.create().transition(2).hsl(263,100,80).on(),
    red: lightState.create().transition(6).hsl(359, 100, 80).on(),
    blue: lightState.create().transition(2).hsl(250,100,90).on(),
    yellow: lightState.create().xy(.4472, .4879).brightness(80).transition(2).on(),
    fastBlue: lightState.create().transition(0).hsl(250,100,90).on(),
    fastRed: lightState.create().transition(0).hsl(359, 100, 80).on(),
    pink: lightState.create().transition(0).hsl(300, 100, 80).on(),
    fastYellow: lightState.create().xy(.4472, .4879).brightness(80).transition(0).on(),
    fastYellowLow: lightState.create().xy(.4472, .4879).brightness(1).transition(1).on(),
    longRed: lightState.create().transition(5).hsl(359, 100, 80).on(),
    pink: lightState.create().transition(2).hsl(300, 100, 50).on(),
    off: lightState.create().transition(2).off(),
}

var BlankSpace = new Song({
    title: "Blank Space",
    hook: [notes.c4, notes.f4, notes.a4],
    backingTrack: function() {
        var command = 'afplay ' + __dirname + '/../backing_tracks/blankspace.m4a'
        return exec(command, {async: true});
    },
    startingElement: 'verse',
    elements: {
        'verse': new Element({
            repeats: 2,
            start: new Sequence({
                notes: [notes.f3],
                action: function() {
                    Helpers.setLights(lights.spotlight, lightColors.pink);
                    Helpers.hueOff([lights.desk, lights.left, lights.right], 0);
                    RC.sendOn(duino.channel);
                },
                actionRepeats: 1
            }),
            middle: [
                new Sequence({
                    notes: [notes.d3]
                }),
                new Sequence({
                    notes: [notes.b2b]
                }),
            ],
            end: new Sequence({
                notes: [notes.c3],
                action: null
            }),
            nextElement: ['chorus', 'chorus']
        }),
        'chorus': new Element({
            repeats: 2,
            start: new Sequence({
                notes: [notes.f3],
                action: function() {
                    Helpers.setLights(lights.spotlight, lights.pink)
                    Helpers.setLights([lights.desk, lights.right, lights.left], lightColors.fastYellow);
                }
            }),
            middle: [
                new Sequence({
                    notes: [notes.d3]
                }),
                new Sequence({
                    notes: [notes.g3]
                })
            ],
            end: new Sequence({
                notes: [notes.b2b]
            }),
            nextElement: ['verse', 'bridge', 'end']
        }),
        'bridge': new Element({
            repeats: 1,
            start: new Sequence({
                notes: [notes.f3],
                action: function() {
                    Helpers.allHueOff(0);
                    RC.sendOn(duino.channel);
                },
                actionRepeats: 1
            }),
            middle: [
                new Sequence({
                    notes: [notes.d3]
                }),
                new Sequence({
                    notes: [notes.b2b]
                })
            ],
            end: new Sequence({
                notes: [notes.c3],
                action: null
            }),
            nextElement: ['chorus', 'chorus']
        }),
        'end': new Element({
            repeats: 1,
            start: new Sequence({
                notes:[notes.f3],
                action: function() {
                    Helpers.allHueOff(0);
                }
            }),
            end: new Sequence({})
        })
    }
});

module.exports = BlankSpace;
