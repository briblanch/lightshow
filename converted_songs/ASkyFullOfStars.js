'use strict';

let notes   = require('@briblanch/lightman').notes;
let Scene   = require('../scene');

let colors  = Scene.commonColors;
let lights  = Scene.lights;

let scene   = Scene.createScene();

let map = {};
map[lights.left] = [colors.pink];
map[lights.right] = [colors.pink];
map[lights.desk] = [colors.pink];

var ASkyFullOfStars = {
  name: 'A Sky Full Of Stars',
  hook: [notes.b3b, notes.d4b, notes.f4s],
  startingElement: 'verse',
  backingTrack: __dirname + '/../backing_tracks/askyfullofstars.mp3',
  onCancel() {
    scene.stop();
  },
  elements: {
    verse: {
      repeats: [10, 9],
      nextElement: 'chorus',
      sequences: [
        {
          notes: [notes.e3b],
          action: function(seqTimesPlayed, elTimesPlayed) {
            if ((elTimesPlayed == 0 || elTimesPlayed == 1) && seqTimesPlayed == 0) {
              scene.allOff()
                .then(() => scene.blkLightsOn())
                .then(() => scene.on(lights.piano, colors.blue));
            }

            if ((seqTimesPlayed == 6 && elTimesPlayed == 0) || (seqTimesPlayed == 4 && elTimesPlayed == 1)) {
              scene.groupFlash(lights.allLights, colors.white, 1000, 500, 2000)
                .then(() => scene.flicker([lights.piano, lights.spotlight], colors.blue, 500, 500));
            }
          },
        },
        {
          notes: [notes.b2b]
        }
      ],
      onEnd() {
        scene.delay(1000)
          .then(() => scene.stop())
          .then(() => scene.blkLightsOff())
          .then(() => scene.allOff());
      }
    },
    chorus: {
      nextElement: ['verse', 'bridge'],
      repeats: [3, 4],
      sequences: [
        {
          notes: [notes.e3b],
          action: function() {
            scene.flash(lights.allLights, [colors.pink, colors.green], 120, map);
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
                .then(() => scene.flash(lights.allLights, colors.pink, 120));
            }
          }
        }
      ],
      onEnd() {
        scene.stop()
          .then(() => scene.allOff(2000))
      }
    }
  }
};

module.exports = ASkyFullOfStars;
