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
var RC          = duino.RC;

var exec        = require('shelljs').exec;

var lights = require('../hue.json').lights;

var lightColors = {
    purple: lightState.create().transition(2).hsl(263,100,80).on(),
    red: lightState.create().transition(6).hsl(359, 100, 80).on(),
    blue: lightState.create().transition(2).hsl(250,100,90).on(),
    yellow: lightState.create().xy(.4472, .4879).brightness(80).transition(2).on(),
    fastBlue: lightState.create().transition(0).hsl(250,100,90).on(),
    fastRed: lightState.create().transition(0).hsl(359, 100, 80).on(),
    fastPink: lightState.create().transition(1).hsl(300, 100, 80).on(),
    fastYellow: lightState.create().xy(.4472, .4879).brightness(80).transition(1).on(),
    fastYellowLow: lightState.create().xy(.4472, .4879).brightness(1).transition(1).on(),
    longRed: lightState.create().transition(5).hsl(359, 100, 80).on(),
    pink: lightState.create().transition(2).hsl(300, 100, 50).on(),
    off: lightState.create().transition(2).off(),
}

var setLights = Helpers.setLights;

// used for preriff
var riffInterval;
var high = false;
var riffColors = [lightColors.fastPink, lightColors.fastRed, lightColors.fastYellow,
                 lightColors.blue, lightColors.purple];
var duration;

var FixYou = new Song({
    title: "Fix You",
    hook: [notes.g3, notes.b3b, notes.e4b],
    startingElement: 'end',
    backingTrack: function() {
        var command = 'afplay ' + __dirname + '/../backing_tracks/fixyou.mp3'
        return exec(command, {async: true});
    },
    elements: {
        'intro': new Element({
            repeats: 2,
            start: new Sequence({
                notes: [notes.g3, notes.b3b, notes.e4b],
                action: function() {
                    Helpers.allHueOff();
                    setLights(lights.spotlight, lightColors.yellow);
                    RC.sendOn(duino.channel);
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
                    setLights(lights.spotlight, lightColors.red);
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
                    setLights(lights.spotlight, lightColors.off);
                    setLights([lights.left, lights.right], lightColors.fastPink);
                }
            }),
            end: new Sequence({
                notes: [notes.d4],
                action: function() {
                    Helpers.allHueOff(0);
                    setLights(lights.desk, lightColors.fastYellow);
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
                    RC.sendOn(duino.channel);
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
                    RC.sendOff(duino.channel);
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
                    }, 800)
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
                    setLights([lights.spotlight, lights.right, lights.left], lightColors.blue);

                    riffInterval = setInterval(function() {
                        for (var key in lights) {
                            var light = lights[key];
                            var lightColor = riffColors[Helpers.randomInt(0, riffColors.length - 1)];

                            lightColor.brightness(Helpers.randomInt(1, 100));
                            lightColor.transition(.3);

                            setLights(light, lightColor);
                        }
                    }, 400);
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
                        clearInterval(riffInterval);
                        setLights([lights.left, lights.right, lights.desk], lightColors.off);
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
