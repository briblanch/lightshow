Lightman
=============

### Overview

Lightman is a node.js command line program (for now) that controls the Phillips
Hue lights, radio frequency controlled switches, and professional DMX lights
(in progress) based off MIDI signals from any keyboard.  

Ususally when someone wants to have programmed lights (whether it be at a show,
or in a home) the lights are often cued of the sound the piano makes, not the
actual notes a musician is playing. Lightman is different. Lightman tracks where
you are in a song by using MIDI signals. So, when you are about to hit that big
note in the chorus, Lightman knows and will change the lights to add to the
effect.

### Getting started

1. Clone this repo and cd into the `lightman` directory
* Run `npm install`
* Change the IP address in the `hue.json` file to the IP address of your Phillips
Hue bridge
* Plug in your midi keyboard
* Run `node app.js`
* Rock out!

### How it works

Lightman allows for anyone with little javascript experience
to program lights to songs they play on the keyboard using JSON objects.

The `Song` JSON object has many different properties to enable total creativity.

### Examples
```js
var Song        = require('../Song');
var Element     = require('../Element');
var Sequence    = require('../Sequence');
var notes       = require('../notes');

var Hue         = require('../Hue');
var duino       = require('../arduino');

var api         = Hue.api;
var lightState  = Hue.lightState;
var RC          = duino.RC;

var TheScientist = new Song({
    title: "The Scientist",
    hook: [notes.f4, notes.b4b, notes.c5],
    elements: {
        'intro': new Element({
            repeats: 2,
            start: new Sequence({
                notes: [notes.c4, notes.f4, notes.a4],
                action: function() {
                    api.setGroupLightState(0, this.lights.off)
                    .then(RC.sendOn(duino.channel));
                },
                actionRepeats: 1,
                lights: {
                    off: lightState.create().off()
                }
            }),
            end: new Sequence({
                notes: [notes.c4, notes.f4, notes.g4],
                action: null
            }),
            nextElement: 'verse',

        }),
        'verse': new Element({
            repeats: 4,
            start: new Sequence({
                notes: [notes.c4, notes.f4, notes.a4],
                action: function() {
                    api.setLightState(3, this.lights.on)
                },
                actionRepeats: 1,
                lights: {
                    on: lightState.create().hsl(0, 100, 70).on(),
                }
            }),
            end: new Sequence({
                notes: [notes.c3, notes.f3, notes.g3],
                action: null
            }),
            nextElement: 'chorus'
        }),
        'chorus': new Element({
            repeats: 2,
            start: new Sequence({
                notes: [notes.d4, notes.f4, notes.b4b],
                action: function() {
                    api.setLightState(3, this.lights.on);
                },
                lights: {
                    on: lightState.create().hsl(250,100,70).transition(10).on()
                }
            }),
            end: new Sequence({
                notes: [notes.c4, notes.f4, notes.g4],
                action: null
            }),
            nextElement: ['verse2', 'bridge'],
        }),
        'verse2': new Element({
            repeats: 6,
            start: new Sequence({
                notes: [notes.c4, notes.f4, notes.a4],
                action: function() {
                    var fade = this.lights.fade;
                    api.setGroupLightState(1, this.lights.on);
                    setTimeout(function() {
                        api.setGroupLightState(1, fade);
                    }, 1000);
                },
                actionRepeats: 1,
                lights: {
                    on: lightState.create().hsl(0,100, 0).transition(0).on(),
                    fade: lightState.create().hsl(0,100,70).transition(10).on()
                }
            }),
            end: new Sequence({
                notes: [notes.c4, notes.f4, notes.g4],
                action: null
            }),
            nextElement: 'chorus'
        }),
        'bridge': new Element({
            repeats: 1,
            start: new Sequence({
                notes: [notes.f2, notes.f3],
                action: null
            }),
            end: new Sequence({
                notes: [notes.f4, notes.c5],
                action: null
            }),
            nextElement: 'outro'
        }),
        'outro': new Element({
            repeats: 1,
            start: new Sequence({
                notes: [notes.d4, notes.f4, notes.b4b],
                action: function() {
                    api.setGroupLightState(1, this.lights.off);
                },
                lights: {
                    off: lightState.create().transition(4).off()
                }
            }),
            end: new Sequence({
                notes: [notes.f2],
                action: function () {
                    api.setLightState(3, this.lights.off);
                    setTimeout(function() {
                        RC.sendOff(duino.channel);
                    },3000);
                },
                lights: {
                    off: lightState.create().transition(3).off()
                }
            })
        })
    }
});

module.exports = TheScientist;
```

### Ideas of What's Next
1. Ability to use professional DMX lighting
* Extract the core parts of the project to its own npm module
* General clean up and bug fixes
* A GUI for building `Song` objects
* Ability to start a backing track based off MIDI signals
* An iOS app that allows for easy selection of songs
* Ability to create a set list

Contact
=============

If you want to add a new element to your live shows, or just have general questions
about Lightman, please hit me up!

- Email: <briblanch@gmail.com>
- Twitter: [@briblanch](https://twitter.com/briblanch)
- GitHub: [briblanch](https://github.com/briblanch)

DISCLAIMER
=============

While the Lightman in its current state works and can be fiddled with, it is in
no means ready for the big time. I have had this idea for a while and wanted to
implement a proof of concept that others could use as well. I am currently a
student and also working so I do not have much time to work on this. Once I
graduate I plan to dedicate some more time to this project.

Also, if you want to change something, I accept pull requests!
