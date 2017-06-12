'use strict';

let notes   = require('@briblanch/lightman').notes;
let scene   = require('../scene');

let colors  = scene.commonColors;
let lights  = scene.lights;
let washFx  = scene.washFx;

let timestamp = 0;
let high = false;

var ASkyFullOfStars = {
  name: 'Clocks',
  hook: [notes.e1b, notes.e2b, notes.e3b],
  startingElement: 'preintro',
  onCancel() {
    scene.stop();
  },
  elements: {
    preintro: {
      repeats: 1,
      nextElement: 'intro',
      sequences: [
        {
          notes: [notes.e4b],
          actionRepeats: 1,
          action: function() {
            scene.allOff();
            scene.washFxOff();
          }
        },
        {
          notes: [notes.e5b]
        }
      ],
      catchAll() {
        let now = Date.now();

        // scene.blkLightsOff();

        if (now - timestamp > 25) {
          if (high) {
            scene.washBlkLightOff();
            scene.pianoBlkLightOn();
          } else{
            scene.pianoBlkLightOff();
            scene.washBlkLightOn();
          }

          high = !high;
        }

        timestamp = now;
      },
    },
    intro: {
      repeats: 4,
      nextElement: 'verse',
      sequences: [
        {
          notes: [notes.e5b],
          action(seqTimesRepeats) {
            switch(seqTimesRepeats) {
              case 0:
                scene.allOff(0)
                  .then(() => scene.greenLaserOn(0, 50))
                  .then(() => scene.blkLightsOff());
                break;
              case 2:
                scene.bothLasersOn(20, 120);
            }
          }
        },
        {
          notes: [notes.c5]
        }
      ]
    },
    verse: {
      repeats: [10, 9],
      nextElement: 'chorus',
      sequences: [
        {
          notes: [notes.e3b],
          action: function(seqTimesPlayed, elTimesPlayed) {
            if ((elTimesPlayed == 0 || elTimesPlayed == 1) && seqTimesPlayed == 0) {
              scene.washFxOff()
                .then(() => { scene.washFx.derbyOn(10, 0, 40)})
                .then(() => scene.blkLightsOn())
                .then(() => scene.on(lights.spotlight, colors.blue));
            }

            if ((seqTimesPlayed == 6 && elTimesPlayed == 0) || (seqTimesPlayed == 4 && elTimesPlayed == 1)) {
              scene.strobeOn()
                .then(() => scene.groupFlash(lights.allLights, colors.white, 1000, 500, 2000))
                .then(() => scene.washFxOff())
                .then(() => {scene.washFx.derbyOn(80, 0, 80)})
                .then(() => scene.flicker([lights.piano, lights.spotlight], colors.blue, 500, 500));
            }
          },
        },
        {
          notes: [notes.b2b]
        }
      ],
      onEnd() {
        scene.stop()
      }
    },
    chorus: {
      nextElement: ['verse', 'bridge'],
      repeats: [3, 4],
      sequences: [
        {
          notes: [notes.e3b],
          action: function() {
            scene.blkLightsOff()
              .then(() => scene.allOff(0))
              .then(() => {scene.washFx.derbyOff()})
              .then(() => scene.blkLightsStrobe(0.95))
              .then(() => scene.greenLaserOn(0, 127))
              .then(() => scene.flash(lights.allLights, [colors.pink, colors.green], 120, map));
            ;
          },
          actionRepeats: 1
        },
        {
          notes: [notes.b2b],
          repeats: 4
        }
      ],
      onEnd: function() {
        scene.stop();
      }
    },
    bridge: {
      repeats: 5,
      sequences: [
        {
          notes: [notes.b2],
          actionRepeats: 1,
          action: function() {
            scene.flicker(lights.allLights, colors.pink, 500, 500);
            scene.blkLightsOn();
          },
        },
        {
          notes: [notes.f3s],
        }
      ],
      onEnd: function(timesPlayed) {
        scene.stop()
          .then(() => scene.allOff(0))
          .then(() => scene.flash(lights.allLights, [colors.pink, colors.green], 700, map))
      },
      nextElement: 'end'
    },
    end: {
      repeats: 15,
      sequences: [
        {
          notes: [notes.f1s],
          action: function(seqTimesPlayed) {
            if (seqTimesPlayed == 0) {
              scene.stop(1000)
                .then(() => scene.allOff(0))
                .then(() => scene.blkLightsStrobe(0.98))
                .then(() => scene.flash(lights.allLights, colors.pink, 120));
            }
          }
        }
      ],
      onEnd() {
        scene.stop()
          .then(() => scene.blkLightsOff())
          .then(() => scene.allOff(2000))
      }
    }
  }
};

module.exports = ASkyFullOfStars;
