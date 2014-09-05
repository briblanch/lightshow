var Song        = require('../Song');
var Element     = require('../Element');
var Sequence    = require('../Sequence');
var notes       = require('../notes');

var Hue         = require('../Hue');
var duino       = require('../arduino');

var api         = Hue.api;
var lightState  = Hue.lightState;
var RC          = duino.RC;

var FightForYourRight = new Song({
    title: "Fight For Your Right",
    hook: [notes.e4b, notes.a4b, notes.c5],
    elements: {
        'intro': new Element({
            repeats: 1,
            start: new Sequence({
                notes: [notes.e4b],
                action: function() {
                    api.setGroupLightState(1, this.lights.off)
                    .then(RC.sendOn(duino.channel));
                    api.setLightState(3, this.lights.on);
                },
                actionRepeats: 1,
                lights: {
                    off: lightState.create().off(),
                    on: lightState.create().transition(5).hsl(63, 93, 91).on()
                }
            }),
            end: new Sequence({
                notes: [notes.e4b],
                action: null
            })
        })
    }
});

module.exports = FightForYourRight;