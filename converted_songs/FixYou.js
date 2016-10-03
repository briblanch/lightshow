'use strict';

let notes   = require('@briblanch/lightman').notes;
let Scene   = require('../scene');

let colors  = Scene.commonColors;
let lights  = Scene.lights;

let scene   = Scene.createScene();

let FixYou = {
  title: "Fix You",
  hook: [notes.g3, notes.b3b, notes.e4b],
  startingElement: 'verse',
  backingTrack: __dirname + '/../backing_tracks/fixyou.mp3',
  elements: {
    verse: {
      repeats: [10, 4],
      sequences: [
        {
          notes: [notes.g3, notes.b3b, notes.e4b],
          action: function() {
              scene.allOff()
                .then(() => scene.blkLightsOn())
                .then(() => scene.on(lights.spotlight, colors.yellow));
          },
          actionRepeats: 1
        },
        {
          notes: [notes.g3, notes.b3b, notes.d4]
        },
        {
          notes: [notes.g3, notes.b3b, notes.e4b]
        },
        {
          notes: [notes.g3, notes.b3b, notes.d4]
        }
      ],
      nextElement: 'chorus'
    },
    chorus: {
      repeats: 3,
      sequences: [
        {
          notes: [notes.a3b],
          action: function(seqTimesPlayed, elTimesPlayed) {
            if (elTimesPlayed == 0) {
              scene.allOff(0)
                .then(() => scene.on([lights.spotlight, lights.bed], colors.red, 1500));
            } else {
              scene.on([lights.spotlight, lights.bed], colors.red, 1500);
            }
          }
        },
        {
          notes: [notes.b3b]
        }
      ],
      nextElement: ['postchorus', 'riff', 'end'],
    },
    postchorus: {
      repeats: 4,
      sequences: [
        {
          notes: [notes.e4b],
          action: function() {
            scene.allOff(0)
              .then(() => scene.blkLightsOff())
              .then(() => scene.on(lights.spotlight, colors.pink, 200));
          }
        },
        {
          notes: [notes.d4],
          action: function() {
            scene.allOff(0)
              .then(() => scene.on(lights.bed, colors.green, 200));
          },
        }
      ],
      nextElement: 'verse'
    },
    riff: {
      repeats: 6,
      nextElement: 'chorus',
      sequences: [
        {
          notes: [notes.e3b],
          action(seqTimesPlayed) {
            if (seqTimesPlayed == 0) {
              scene.allOff(0)
                .then(() => scene.blkLightsOff())
                .then(() => scene.flicker([lights.spotlight, lights.bed], colors.yellow, 300, 300))
            } else if (seqTimesPlayed == 2) {
              scene.colorLoop(lights.allLights, true, [colors.red, colors.blue, colors.green, colors.pink, colors.yellow], 200, 200);
            }
          }
        },
        {
          notes: [notes.d4],
          action(seqTimesPlayed) {
            if (seqTimesPlayed == 2) {
              scene.stop()
                .then(() => scene.allOff());
            }
          }
        }
      ],
      onEnd() {
        scene.stop()
      }
    }
  }
};

module.exports = FixYou;
