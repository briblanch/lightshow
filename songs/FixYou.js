var Song        = require('../Song');
var Element     = require('../Element');
var Sequence    = require('../Sequence');
var Helpers     = require('../Helpers');
var notes       = require('../notes');
var log         = require('../log');

var Hue         = require('../Hue');
var duino       = require('../arduino');

var api         = Hue.api;
var lightState  = Hue.lightState;
var Rf          = duino.Rf;

var exec        = require('shelljs').exec;

var cleared = false

var lights = require('../hue.json').lights;

var lightColors = {
    purple: lightState.create().transition(2000).rgb(170, 0, 255).on(),
    red: lightState.create().transition(6000).rgb(255, 0, 0).brightness(80).on(),
    blue: lightState.create().rgb(0, 0, 255).transition(2000).on(),
    yellow: lightState.create().rgb(255, 255, 0).brightness(80).transition(2000).on(),
    fastBlue: lightState.create().transition(300).hsb(250,100,90).on(),
    fastRed: lightState.create().transition(300).rgb(255, 0 ,0).on(),
    fastPink: lightState.create().transition(1000).rgb(255, 0, 238).brightness(100).on(),
    fastYellow: lightState.create().rgb(255, 255, 0).brightness(100).transition(1000).on(),
    fastGreen: lightState.create().rgb(0, 255, 17).brightness(100).transition(1000).on(),
    fastYellowLow: lightState.create().rgb(255, 255, 0).brightness(1).transition(1000).on(),
    longRed: lightState.create().transition(5000).hsb(359, 100, 80).on(),
    pink: lightState.create().transition(2000).hsb(300, 100, 50).on(),
    off: lightState.create().transition(2000).off(),
}

var setLights = Helpers.setLights;

// used for preriff
var riffInterval;
var high = false;
var riffColors = [lightColors.fastPink, lightColors.fastRed, lightColors.fastYellow, lightColors.fastGreen,
                 lightColors.blue, lightColors.purple];
var duration;

var FixYou = new Song({
    title: "Fix You",
    hook: [notes.g3, notes.b3b, notes.e4b],
    startingElement: 'intro',
    backingTrack: function() {
        var command = 'afplay ' + __dirname + '/../backing_tracks/fixyou.m4a'
        // return exec(command, {async: true});
    },
    elements: {
        'intro': new Element({
            repeats: 2,
            start: new Sequence({
                notes: [notes.g3, notes.b3b, notes.e4b],
                action: function() {
                    setLights([lights.left, lights.right, lights.desk, lights.bed], lightColors.off);
                    setLights(lights.spotlight, lightColors.yellow);
                    Rf.on('1');
                    Rf.on('2');
                },
                actionRepeats: 1
            }),
            middle: [
                new Sequence({
                    notes: [notes.g3, notes.b3b, notes.d4]
                }),
                new Sequence({
                    notes: [notes.g3, notes.b3b, notes.e4b]
                })
            ],
            end: new Sequence({
                notes: [notes.g3, notes.b3b, notes.d4]
            }),
            nextElement: 'verse'
        }),
        'verse': new Element({
            repeats: 8,
            start: new Sequence({
                notes: [notes.g3, notes.b3b, notes.e4b],
            }),
            middle: [
                new Sequence({
                    notes: [notes.g3, notes.b3b, notes.d4]
                }),
                new Sequence({
                    notes: [notes.g3, notes.b3b, notes.e4b]
                })
            ],
            end: new Sequence({
                notes: [notes.g3, notes.b3b, notes.d4]
            }),
            nextElement: 'chorus'
        }),
        'chorus': new Element({
            repeats: 3,
            start: new Sequence({
                notes: [notes.a3b],
                action: function() {
                    setLights([lights.spotlight, lights.bed], lightColors.red);
                }
            }),
            end: new Sequence({
                notes: [notes.b3b]
            }),
            nextElement: ['postchorus', 'preriff', 'end']
        }),
        'postchorus': new Element({
            repeats: 4,
            start: new Sequence({
                notes: [notes.e4b],
                action: function() {
                    Helpers.allHueOff(0);
                    Rf.off('1');
                    Rf.off('2');
                    setLights([lights.spotlight, lights.bed], lightColors.off);
                    setLights([lights.spotlight], lightColors.fastPink);
                }
            }),
            end: new Sequence({
                notes: [notes.d4],
                action: function() {
                    Helpers.allHueOff(0);
                    setLights(lights.bed, lightColors.fastGreen);
                },
                actionRepeats: 3
            }),
            nextElement: 'verse2'
        }),
        'verse2': new Element({
            repeats: 4,
            start: new Sequence({
                notes: [notes.g3, notes.b3b, notes.e4b],
                action: function() {
                    setLights([lights.left, lights.right, lights.desk], lightColors.off);
                    setLights(lights.spotlight, lightColors.yellow);
                    Rf.on('1');
                    Rf.on('2');
                },
                actionRepeats: 1
            }),
            middle: [
                new Sequence({
                    notes: [notes.g3, notes.b3b, notes.d4]
                }),
                new Sequence({
                    notes: [notes.g3, notes.b3b, notes.e4b]
                })
            ],
            end: new Sequence({
                notes: [notes.g3, notes.b3b, notes.d4]
            }),
            nextElement: 'chorus',
        }),
        'preriff': new Element({
            repeats: 1,
            start: new Sequence({
                notes: [notes.e2b],
                action: function() {
                    Rf.off('1');
                    Rf.off('2');
                    Helpers.allHueOff(0);
                    setLights(lights.spotlight, lightColors.fastYellowLow);
                    high = false;

                    riffInterval = setInterval(function() {
                        if (high) {
                            setLights(lights.spotlight, lightColors.fastYellowLow);
                            high = false;
                        } else {
                            setLights(lights.spotlight, lightColors.fastYellow.brightness(100));
                            high = true;
                        }
                    }, 300)
                },
                actionRepeats: 1
            }),
            end: new Sequence({
                notes: [notes.b3b, notes.d4, notes.f4],
                action: function() {
                    clearInterval(riffInterval);
                }
            }),
            nextElement: 'riff',
        }),
        'riff': new Element({
            repeats: 1,
            start: new Sequence({
                notes: [notes.g3, notes.b3b, notes.e4b],
                action: function() {
                    Rf.on('1');
                    Rf.on('2');
                    for (var key in lights) {
                        if (!cleared) {
                            var light = lights[key];
                            var lightColor = riffColors[Helpers.randomInt(0, riffColors.length - 1)];

                            lightColor.brightness(Helpers.randomInt(1, 100));
                            lightColor.transition(300);

                            setLights(light, lightColor);
                        }
                    }

                    riffInterval = setInterval(function() {
                        for (var key in lights) {
                            if (!cleared) {
                                var light = lights[key];
                                var lightColor = riffColors[Helpers.randomInt(0, riffColors.length - 1)];

                                lightColor.brightness(Helpers.randomInt(1, 100));
                                lightColor.transition(300);

                                setLights(light, lightColor);
                            }
                        }
                    }, 1000);
                },
                actionRepeats: 1
            }),
            middle: [
                new Sequence({
                    notes: [notes.b3b, notes.d4, notes.f4]
                }),
                new Sequence({
                    notes: [notes.g3, notes.c4, notes.e4b]
                })
            ],
            end: new Sequence({
                notes: [notes.b3b, notes.d4, notes.f4],
            }),
            nextElement: 'singAlong'
        }),
        'singAlong': new Element({
            repeats: 2,
            start: new Sequence({
                notes: [notes.g3, notes.b3b, notes.e4b],
            }),
            middle: [
                new Sequence({
                    notes: [notes.b3b, notes.d4, notes.f4]
                }),
                new Sequence({
                    notes: [notes.g3, notes.c4, notes.e4b]
                })
            ],
            end: new Sequence({
                notes: [notes.b3b, notes.d4, notes.f4],
                action: function(playCount) {
                    this.timesPlayed++;
                    if (this.timesPlayed == 2) {
                        cleared = true;
                        clearInterval(riffInterval);
                        setLights([lights.left, lights.right, lights.desk, lights.spotlight, lights.bed], lightColors.off);
                        Rf.off('1');
                        Rf.off('2');
                    }
                },
                timesPlayed: 0
            }),
            nextElement: 'chorus'
        }),
        'end': new Element({
            repeats: 1,
            start: new Sequence({
                notes:[notes.e2b],
                action: function() {
                    Helpers.allHueOff();
                }
            }),
            end: new Sequence({})
        })
    }
});

module.exports = FixYou;
