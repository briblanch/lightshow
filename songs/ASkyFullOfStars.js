var Song        = require('../Song');
var Element     = require('../Element');
var Sequence    = require('../Sequence');
var Helpers     = require('../Helpers');
var notes       = require('../notes');
var log         = require('../log');
var exec        = require('shelljs').exec;

var lights      = require('../hue.json').lights;
var scenes      = require('../scenes');

var ASkyFullOfStars = new Song({
    title: "ASkyFullOfStars",
    hook: [notes.b3b, notes.d4b, notes.f4s],
    startingElement: 'intro',
    backingTrack: function() {
        var command = 'mpg123 ' + __dirname + '/../backing_tracks/askyfullofstars.mp3'
        return exec(command, {async: true});
    },
    elements: {
        'intro': new Element({
            repeats: 6,
            sequences: [new Sequence({
                notes: [notes.e3b],
                action: function() {
                    scenes.allOff();
                    scenes.strobeBlackLightOn();
                    setTimeout(function() {
                        scenes.setLightsOn([lights.piano], [250, 100, 80]);
                    }, 800);

                    scenes.steadyBlackLightOn();
                },
                actionRepeats: 1
            }),
            new Sequence({
                notes: [notes.b2b]
            })],
            nextElement: 'verse'
        }),
        'verse': new Element({
            repeats: 4,
            sequences: [new Sequence({
                notes: [notes.e3b],
                action: function() {
                    console.log('flash called');
                    scenes.steadyBlackLightOn();
                    scenes.groupFlash([lights.left, lights.right, lights.desk, lights.spotlight, lights.bed, lights.piano],
                                      800, 2000, [0, 0, 100]);

                    setTimeout(function() {
                        scenes.flicker([250, 100, 80], [lights.piano, lights.spotlight], 400, 500);
                        scenes.steadyBlackLightOn();
                    }, 3000);
                },
                actionRepeats: 1
            }),
            new Sequence({
                notes: [notes.b2b],
            })],
            onEnd: function() {
                // scenes.strobeBlackLightOn();
                scenes.stopFlicker();
                scenes.steadyBlackLightOff();
                scenes.strobeBlackLightOff();
                scenes.allOff();
            },
            nextElement: 'beatDrop'
        }),
        'beatDrop': new Element({
            repeats: 3,
            sequences: [new Sequence({
                notes: [notes.e3b],
                action: function() {
                    scenes.steadyBlackLightOff();
                    scenes.flashASFOS([lights.left, lights.right, lights.desk, lights.spotlight, lights.bed, lights.piano], 120, [305, 130]);
                },
                actionRepeats: 1
            }),
            new Sequence({
                notes: [notes.b2b],
            })],
            onEnd: function() {
                scenes.stopFlash();
                scenes.strobeBlackLightOff();
                setTimeout(function() {
                    scenes.steadyBlackLightOn();
		    scenes.strobeBlackLightOn();
                    scenes.setLightsOff([lights.left, lights.right, lights.desk, lights.spotlight, lights.bed]);
                    scenes.setLightsOn([lights.piano], [250, 100, 80]);
                }, 1000);
            },
            nextElement: 'verse2'
        }),
        'verse2': new Element({
            repeats: 4,
            sequences: [new Sequence({
                notes: [notes.e3b]
            }),
            new Sequence({
                notes: [notes.b2b],
            })],
            nextElement: 'verse2.1'
        }),
        'verse2.1': new Element({
            repeats: 5,
            sequences: [new Sequence({
                notes: [notes.e3b],
                action: function() {
                    console.log('flash called');
                    scenes.steadyBlackLightOff();
                    scenes.groupFlash([lights.left, lights.right, lights.desk, lights.spotlight, lights.bed, lights.piano],
                                      500, 2000, [0, 0, 100]);

                    setTimeout(function() {
                        scenes.flicker([250, 100, 80], [lights.piano, lights.spotlight], 400, 500);
                        scenes.steadyBlackLightOn();
                    }, 3000);
                },
                actionRepeats: 1
            }),
            new Sequence({
                notes: [notes.b2b],
            })],
            onEnd: function() {
                scenes.stopFlicker();
                scenes.steadyBlackLightOff();
                scenes.allOff();
            },
            nextElement: 'beatDrop2'
        }),
        'beatDrop2': new Element({
            repeats: 4,
            sequences: [new Sequence({
                notes: [notes.e3b],
                action: function() {
                    scenes.steadyBlackLightOff();
                    scenes.strobeBlackLightOff();
                    scenes.flashASFOS([lights.left, lights.right, lights.desk, lights.spotlight, lights.bed, lights.piano], 120, [305, 130]);
                },
                actionRepeats: 1
            }),
            new Sequence({
                notes: [notes.b2b],
            })],
            onEnd: function() {
                scenes.stopFlash();
                scenes.strobeBlackLightOff();
            },
            nextElement: 'outroBridge'
        }),
        'outroBridge': new Element({
            repeats: 5,
            sequences: [new Sequence({
                notes: [notes.b2],
                action: function() {
                    scenes.steadyBlackLightOff();
                    scenes.strobeBlackLightOff();
                    scenes.flicker([305, 100, 100], [lights.left, lights.right, lights.desk, lights.spotlight, lights.bed, lights.piano], 150, 1000);
                },
                actionRepeats: 1
            }),
            new Sequence({
                notes: [notes.e3b],
                action: function() {

                }
            })],
            onEnd: function() {
                setTimeout(function() {
                    scenes.stopFlicker();
                    scenes.allOff();
                    setTimeout(function() {
                        scenes.flash([lights.left, lights.right, lights.desk, lights.spotlight, lights.bed, lights.piano], 500, [305, 130]);
                    }, 1000);

                }, 2000);
            },
            nextElement: 'end'
        }),
        'end': new Element({
            repeats: 1,
            sequences: [new Sequence({
                notes: [notes.e1b],
                action: function() {
                    console.log('stoping flash');
                    scenes.stopFlash();
                    scenes.allOff();
                }
            })]
        })
    }
});

module.exports = ASkyFullOfStars;
