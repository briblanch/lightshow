'use strict';

let notes   = require('@briblanch/lightman').notes;
let scene   = require('../scene');

let colors  = scene.commonColors;
let lights  = scene.lights;
let washFx  = scene.washFx;

let map = {};
map[lights.left] = [colors.pink];
map[lights.right] = [colors.pink];
map[lights.desk] = [colors.pink];
map[lights.spotlight] = [colors.green];
map[lights.bed] = [colors.green];
map[lights.piano] = [colors.green];

var VivaLaVida = {
  name: 'Viva La Vida',
  hook: [notes.d3b, notes.a3b, notes.d4b],
  startingElement: 'verse',
  backingTrack: __dirname + '/../backing_tracks/vivalavida.mp3',
  onCancel() {
    scene.stop();
  },
  elements: {
    verse: {
      repeats: [10, 6],
      nextElement: 'chorus',
      sequences: [
        {
          notes: [notes.d3b],
          action: function(seqTimesPlayed, elTimesPlayed) {
            if (seqTimesPlayed == 0) {
              scene.allOff()
                .then(() => scene.blkLightsOn())
              scene.washFx.derbyOn(30, 0, 80);
            } else if (seqTimesPlayed == 2) {
              scene.washFx.derbyOn(80, 0, 214);
              scene.blkLightsOff();
              scene.alternate([lights.bed], [lights.spotlight], colors.blue, 420);
            }
          },
        },
        {
          notes: [notes.f2]
        }
      ],
      onEnd() {
        scene.stop()
      }
    },
    chorus: {
      nextElement: ['verse', 'bridge'],
      repeats: 4,
      sequences: [
        {
          notes: [notes.d3b],
          action: function(seqTimesPlayed, elTimesPlayed) {
            scene.washFx.derbyOn(85, 20, 200);

            if (elTimesPlayed <= 1) {
              scene.colorLoop([lights.bed, lights.left, lights.right, lights.spotlight], true,
                  [colors.red, colors.pink, colors.blue], 200, 300);
            } else {
              scene.allOff(0)
                .then(() => scene.flash(lights.allLights, [colors.pink, colors.red], 400));
            }
          },
          actionRepeats: 1
        },
        {
          notes: [notes.f2],
        }
      ],
      onEnd: function() {
        scene.stop();
      }
    },
    bridge: {
      repeats: 1,
      sequences: [
        {
          notes: [notes.d3b],
          actionRepeats: 1,
          action: function() {
            scene.washFxOff();
            scene.strobeOn();
            scene.on(lights.allLights, colors.white);
          },
        },
        {
          notes: [notes.e3b],
        }
      ],
      nextElement: 'chorus'
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

module.exports = VivaLaVida;
