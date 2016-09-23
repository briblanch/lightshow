'use strict';

let notes   = require('lightman').notes;
let lights  = require('../hue.json').lights;
let scenes  = require('../scenes');

var ASkyFullOfStars = {
  name: 'A Sky Full Of Stars',
  hook: [notes.b3b, notes.d4b, notes.f4s],
  startingElement: 'verse',
  backingTrack: __dirname + '/../backing_tracks/askyfullofstars.mp3',
  elements: {
    verse: {
      repeats: [10, 9],
      nextElement: 'chorus',
      sequences: [
        {
          notes: [notes.e3b],
          action: function(seqTimesPlayed, elTimesPlayed) {
            if ((elTimesPlayed == 0 || elTimesPlayed == 1) && seqTimesPlayed == 0) {
              scenes.allOff();
              scenes.allBlackLightsOn();
              setTimeout(() => {
                scenes.setLightsOn([lights.piano], [250, 100, 80]);
              }, 500);
            }

            if ((seqTimesPlayed == 6 && elTimesPlayed == 0) || (seqTimesPlayed == 4 && elTimesPlayed == 1)) {
              scenes.groupFlash([lights.left, lights.right, lights.desk, lights.spotlight, lights.bed, lights.piano],
                                800, 2000, [0, 0, 100]);

              setTimeout(() => {
                scenes.flicker([250, 100, 80], [lights.piano, lights.spotlight], 800, 500);
              }, 3000);
            }
          },
        },
        {
          notes: [notes.b2b]
        }
      ],
      onEnd() {
        scenes.stopFlicker();
        scenes.steadyBlackLightOff();
        scenes.strobeBlackLightOff();
        scenes.allOff();
      }
    },
    chorus: {
      nextElement: ['verse', 'bridge'],
      repeats: [3, 4],
      sequences: [
        {
          notes: [notes.e3b],
          action: function() {
            scenes.steadyBlackLightOff();
            scenes.flashASFOS([lights.left, lights.right, lights.desk, lights.spotlight, lights.bed, lights.piano], 120, [305, 130]);
          },
          actionRepeats: 1
        },
        {
          notes: [notes.b2b],
        }
      ],
      onEnd: function() {
        scenes.stopFlash();
      }
    },
    bridge: {
      repeats: 5,
      sequences: [
        {
          notes: [notes.b2],
          actionRepeats: 1,
          action: function() {
            scenes.steadyBlackLightOff();
            scenes.strobeBlackLightOff();
            scenes.flicker([305, 100, 100], [lights.left, lights.right, lights.desk, lights.spotlight, lights.bed, lights.piano], 150, 1000);
          },

        },
        {
          notes: [notes.e3b],
        }
      ],
      onEnd: function(timesPlayed) {
        setTimeout(() => {
          scenes.stopFlicker();
          scenes.allOff();
          setTimeout(() => {
            scenes.flashASFOS([lights.left, lights.right, lights.desk, lights.spotlight, lights.bed, lights.piano], 700, [305, 130]);
          }, 1000);
        }, 2000);
      },
      nextElement: 'end'
    },
    end: {
      repeats: 1,
      sequences: [
        {
          notes: [notes.f1s],
          action: function() {
            console.log('stoping flash');
            scenes.stopFlash();
            scenes.allOff();
          }
        }
      ]
    }
  }
};

module.exports = ASkyFullOfStars;
