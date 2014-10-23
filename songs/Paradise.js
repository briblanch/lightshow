var Song        = require('../Song');
var Element     = require('../Element');
var Sequence    = require('../Sequence');
var notes       = require('../notes');
var log         = require('../log');

var Hue         = require('../Hue');
var duino       = require('../arduino');

var api         = Hue.api;
var lightState  = Hue.lightState;
var RC          = duino.RC;

var Paradise = new Song({
    title: "Paradise",
    hook: [notes.g4, notes.b4b, notes.d5],
    elements: {
        'intro': new Element({
            repeats: 3,
            start: new Sequence({
                notes: [notes.g3, notes.b3b, notes.d4],
                action: function() {
                    api.setGroupLightState(1, this.lights.off)
                    .then(RC.sendOn(duino.channel));
                },
                actionRepeats: 1,
                lights: {
                    off: lightState.create().off()
                }
            }),
            end: new Sequence({
                notes: [notes.c4, notes.e4, notes.g4],
                action: null
            }),
            nextElement: 'verse',
        }),
    }
});

module.exports = Paradise;
