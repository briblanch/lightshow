var Song        = require('../Song');
var Element     = require('../Element');
var Sequence    = require('../Sequence');
var notes       = require('../notes');

var Hue         = require('../Hue');
var duino       = require('../arduino');

var api         = Hue.api;
var lightState  = Hue.lightState;
var RC          = duino.RC;

var PianoMan = new Song({
    title: "Piano Man",
    hook: [notes.d3, notes.f3, notes.a3],
    elements: {
        'intro': new Element({
            repeats: 1,
            start: new Sequence({
                notes: [notes.a4b],
                action: function() {
                    RC.sendOn(duino.channel);
                    api.setLightState(1, this.lights.pink);
                    api.setLightState(2, this.lights.pink);
                    api.setLightState(3, this.lights.blue);
                    api.setLightState(4, this.lights.purple);
                },
                actionRepeats: 1,
                lights: {
                    purple: lightState.create().transition(5).hsl(263,100,80).on(),
                    blue: lightState.create().transition(5).hsl(250,100,90).on(),
                    pink: lightState.create().transition(5).hsl(300, 100, 50).on()
                }
            }),
            end: new Sequence({
                notes: [notes.c4],
                action: null
            })
        })
    }
});

module.exports = PianoMan;