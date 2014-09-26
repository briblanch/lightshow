var Song        = require('../Song');
var Element     = require('../Element');
var Sequence    = require('../Sequence');
var Helpers     = require('../Helpers');
var notes       = require('../notes');

var Hue         = require('../Hue');
var duino       = require('../arduino');

var api         = Hue.api;
var lightState  = Hue.lightState;
var RC          = duino.RC;

var lights = require('../hue.json').lights;

var lightColors = {
    purple: lightState.create().transition(2).hsl(263,100,80).on(),
    red: lightState.create().transition(2).hsl(359, 100, 80).on(),
    blue: lightState.create().transition(2).hsl(250,100,90).on(),
    yellow: lightState.create().xy(.4472, .4879).brightness(80).transition(2).on(),
    fastBlue: lightState.create().transition(0).hsl(250,100,90).on(),
    fastRed: lightState.create().transition(0).hsl(359, 100, 80).on(),
    fastPink: lightState.create().transition(0).hsl(300, 100, 80).on(),
    fastYellow: lightState.create().xy(.4472, .4879).brightness(80).transition(0).on(),
    longRed: lightState.create().transition(5).hsl(359, 100, 80).on(),
    pink: lightState.create().transition(2).hsl(300, 100, 50).on(),
    white: lightState.create().transition(2).hsl(120, 0 , 80).on(),
    off: lightState.create().transition(2).off()
}

// Light helpers
var previousLight;
var flickerTimeStamp;

var randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var flickerFast = function(lights) {
    if (Date.now() - flickerTimeStamp < 150) {
        return;
    }

    if (previousLight) {
        api.setLightState(previousLight, lights.off);
    }

    flickerTimeStamp = Date.now();
    var numLights = randomInt(1, 4);

    var light = randomInt(1, 4);
    Helpers.setLights([light], lights.on);
    previousLight = light;
};

var flicker = function(lights) {
    if (Date.now() - flickerTimeStamp < 400) {
        return;
    }

    if (previousLight) {
        api.setLightState(previousLight, lights.off);
    }

    flickerTimeStamp = Date.now();
    var numLights = randomInt(1, 4);

    var light = randomInt(1, 4);
    Helpers.setLights([light], lights.on);
    previousLight = light;
};

var PianoMan = new Song({
    title: "Piano Man",
    hook: [notes.d3, notes.f3, notes.a3],
    startingElement: 'preintro',
    elements: {
        'preintro': new Element({
            repeats: 1,
            start: new Sequence({
                notes: [notes.d3, notes.f3, notes.a3, notes.c4],
                action: function() {
                    RC.sendOff(duino.channel);
                    Helpers.setLights([lights.right, lights.left], lightColors.pink);
                    Helpers.setLights([lights.desk], lightColors.purple);
                    Helpers.setLights([lights.spotlight], lightColors.blue);
                },
                actionRepeats: 1
            }),
            end: new Sequence({
                notes: [notes.d3, notes.f3, notes.a3b, notes.b3],
                action: function() {
                    Helpers.setLights([lights.spotlight], lightColors.red);
                    Helpers.setLights([lights.right, lights.left], lightColors.purple);
                    Helpers.setLights([lights.desk], lightColors.blue);
                }
            }),
            nextElement: ['intro']
        }),
        'intro': new Element({
            repeats: 1,
            start: new Sequence({
                notes: [notes.c3, notes.c4],
                action: function() {
                    Helpers.allHueOff(0);
                    Helpers.setLights([lights.spotlight], lightColors.fastBlue);
                    RC.sendOn(duino.channel);
                },
                actionRepeats: 1
            }),
            middle: [
                new Sequence({
                    notes:[notes.f1],
                    action: null
                })
            ],
            end: new Sequence({
                notes: [notes.c4, notes.f4],
                action: function() {
                }
            }),
            nextElement:['riff']
        }),
        'riff': new Element({
            repeats: 2,
            start: new Sequence({
                notes: [notes.c3, notes.g3, notes.c4, notes.e4],
                action: function() {
                    RC.sendOff(duino.channel);
                    Helpers.hueOff([lights.left, lights.right, lights.spotlight], 1);
                    Helpers.setLights([lights.desk], lightColors.yellow);
                }
            }),
            middle: [
                new Sequence({
                    notes: [notes.c4, notes.f4],
                    action: function() {
                        Helpers.setLights([lights.left], lightColors.pink);
                    }
                }),
                new Sequence({
                    notes: [notes.b3, notes.g4],
                    action: function() {
                        Helpers.setLights([lights.right], lightColors.red);
                    }
                }),
                new Sequence({
                    notes: [notes.a3, notes.f4],
                    action: function() {
                        Helpers.hueOff([lights.right], 0);
                    }
                }),
                new Sequence({
                    notes: [notes.g3],
                    action: function() {
                        Helpers.hueOff([lights.left], 0);
                    }
                })
            ],
            end: new Sequence({
                notes: [notes.d4],
                action: function() {
                    Helpers.hueOff([lights.desk], 0);
                }
            }),
            nextElement: ['verse1', 'verse2', 'verse4', 'end']
        }),
        'verse1': new Element({
            repeats: 1,
            start: new Sequence({
                notes: [notes.c3, notes.c4],
                action: function() {
                    RC.sendOn(duino.channel);
                    Helpers.setLights([lights.spotlight], lightColors.yellow);
                }
            }),
            middle: [
                new Sequence({
                    notes: [notes.d3],
                    action: null
                }),
                new Sequence({
                    notes: [notes.c2, notes.c3],
                    action: function() {
                        Helpers.setLights([lights.spotlight], lightColors.blue);
                    }
                }),
                new Sequence({
                    notes: [notes.c5],
                    action: null
                }),
                new Sequence({
                    notes: [notes.c2, notes.c3],
                    action: function() {
                        Helpers.setLights([lights.spotlight], lightColors.yellow);
                    }
                }),
                new Sequence({
                    notes: [notes.f4s],
                    action: null
                }),
                new Sequence({
                    notes: [notes.f2],
                    action: null
                })
            ],
            end: new Sequence({
                repeats: 1,
                notes: [notes.c4, notes.e4, notes.g4],
                action: null
            }),
            nextElement: 'prechorus'
        }),
        'prechorus': new Element({
            repeats: 1,
            start: new Sequence({
                notes: [notes.a2],
                action: function(timesPlayed) {
                    RC.sendOff(duino.channel);
                    Helpers.hueOff([lights.left, lights.right]);
                    Helpers.setLights([lights.desk], lightColors.purple);
                }
            }),
            middle: [
                new Sequence({
                    notes: [notes.g2],
                    action: function() {
                        Helpers.setLights([lights.left], lightColors.purple);
                    }
                }),
                new Sequence({
                    notes: [notes.f2s],
                    action: function() {
                        Helpers.setLights([lights.right], lightColors.purple);
                    }
                }),
                new Sequence({
                    notes: [notes.d3],
                    action: function() {
                        api.setGroupLightState(0, lightColors.longRed);
                    }
                }),
                new Sequence({
                    notes: [notes.e3],
                    action: null
                })
            ],
            end: new Sequence({
                notes: [notes.d3],
                action: null
            }),
            nextElement: ['chorus', 'verse3', 'chorus']
        }),
        'verse2': new Element({
            repeats: 1,
            start: new Sequence({
                notes: [notes.c3, notes.c4],
                action: function() {
                    RC.sendOn(duino.channel);
                    Helpers.setLights([lights.spotlight], lightColors.yellow);
                }
            }),
            middle: [
                new Sequence({
                    notes: [notes.d3],
                    action: null
                }),
                new Sequence({
                    notes: [notes.c2, notes.c3],
                    action: function() {

                    }
                }),
                new Sequence({
                    notes: [notes.f4],
                    action: null
                }),
                new Sequence({
                    notes: [notes.c2, notes.c3],
                    action: function() {

                    }
                }),
                new Sequence({
                    notes: [notes.f4s],
                    action: null
                }),
                new Sequence({
                    notes: [notes.f2],
                    action: null
                })
            ],
            end: new Sequence({
                repeats: 1,
                notes: [notes.c4, notes.e4, notes.g4],
                action: null
            }),
            nextElement: 'prechorus'
        }),
        'verse3': new Element({
            repeats: 1,
            start: new Sequence({
                notes: [notes.c3, notes.c4],
                action: function() {
                    RC.sendOff(duino.channel);
                    Helpers.setLights([lights.right], lightColors.white);
                    Helpers.setLights([lights.left], lightColors.red);
                    Helpers.setLights([lights.spotlight], lightColors.blue);
                    Helpers.setLights([lights.desk], lightColors.red);
                }
            }),
            middle: [
                new Sequence({
                    notes: [notes.d3],
                    action: null
                }),
                new Sequence({
                    notes: [notes.c3, notes.c4],
                    action: function() {
                        Helpers.setLights([lights.spotlight, lights.desk], lightColors.yellow);
                        Helpers.setLights([lights.left, lights.right], lightColors.red);
                    }
                }),
                new Sequence({
                    notes: [notes.c2, notes.c3],
                    action: function() {
                        RC.sendOn(duino.channel);
                        Helpers.hueOff([lights.desk, lights.left, lights.right]);
                        Helpers.setLights([lights.spotlight], lightColors.blue);
                    }
                }),
                new Sequence({
                    notes: [notes.c5],
                    action: null
                }),
                new Sequence({
                    notes: [notes.c2, notes.c3],
                    action: function() {
                        Helpers.setLights([lights.spotlight], lightColors.yellow);
                    }
                }),
                new Sequence({
                    notes: [notes.f4s],
                    action: null
                }),
                new Sequence({
                    notes: [notes.f2],
                    action: null
                })
            ],
            end: new Sequence({
                repeats: 1,
                notes: [notes.c4, notes.e4, notes.g4],
                action: null
            }),
            nextElement: 'solo'
        }),
        'solo': new Element({
            repeats: 1,
            start: new Sequence({
                notes:[notes.a2],
                action: function() {
                    RC.sendOff(duino.channel);
                }
            }),
            end: new Sequence({
                notes:[notes.e3],
                action: function() {
                    Helpers.allHueOff();
                    RC.sendOn(duino.channel);
                }
            }),
            catchAll: function() {
                flicker(this.lights());
            },
            lights: function (currentSequence) {
                var lights = {};
                var randomHue = randomInt(214, 359);

                lights.on = lightState.create().transition(0).hsl(randomHue, 100, 100).on();
                lights.off = lightState.create().transition(0).off();

                return lights;
            },
            nextElement: ['chorus']
        }),
        'verse4': new Element({
            repeats: 1,
            start: new Sequence({
                notes: [notes.c3, notes.c4],
                action: function() {
                    RC.sendOn(duino.channel);
                    Helpers.hueOff([lights.desk, lights.right, lights.left]);
                    Helpers.setLights([lights.spotlight], lightColors.yellow);
                }
            }),
            middle: [
                new Sequence({
                    notes: [notes.d3],
                    action: null
                }),
                new Sequence({
                    notes: [notes.c4, notes.e4, notes.g4],
                    action: function() {
                        api.setGroupLightState(1, lightColors.red);
                        Helpers.setLights([lights.spotlight], lightColors.white);
                    }
                }),
                new Sequence({
                    notes: [notes.f4, notes.a4, notes.c5],
                    action: null
                })
            ],
            end: new Sequence({
                notes: [notes.f2],
                action: null
            }),
            nextElement: ['prechorus']
        }),
        'chorus': new Element({
            repeats: 1,
            start: new Sequence({
                notes: [notes.c2, notes.c3],
                action: function() {
                    RC.sendOn(duino.channel);
                    api.setGroupLightState(0, lightColors.yellow);
                }
            }),
            middle: [
                new Sequence({
                    notes: [notes.a4],
                    action: null
                }),
                new Sequence({
                    notes: [notes.c3],
                    action: null
                }),
                new Sequence({
                    notes: [notes.c3],
                    action: function() {
                        api.setGroupLightState(1, lightColors.off);
                        Helpers.setLights([lights.spotlight], lightColors.blue);
                   }
                })
            ],
            end: new Sequence({
                notes: [notes.f2],
                action: null
            }),
            nextElement: ['riff', 'riff', 'riff']
        }),
        'end': new Element({
            repeats: 1,
            start: new Sequence({
                notes:[notes.c4],
                action: null
            }),
            end: new Sequence({
                notes: [notes.a4b],
                action: null
            }),
            catchAll: function() {
                flickerFast(this.lights());
            },
            lights: function (currentSequence) {
                var lights = {};
                var randomHue = randomInt(214, 359);

                lights.on = lightState.create().transition(0).hsl(randomHue, 100, 100).on();
                lights.off = lightState.create().transition(0).off();

                return lights;
            }
        })
    }
});

module.exports = PianoMan;