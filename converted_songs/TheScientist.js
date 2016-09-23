'use strict';

let notes   = require('lightman').notes;
let scenes  = require('../scenes');
let lights  = require('../hue.json').lights;

let theScientist = {
  name: 'The Scientist', // Name of the song
  hook: [notes.f4, notes.b4b, notes.c5], // The song hook. This is how lightman knows what song to play.
  startingElement: 'verse', // The starting element of the song, defaults to 'intro'
  backingTrack: __dirname + '/../backing_tracks/thescientist.mp3',
  elements: { // Object of elements
    verse: {
      repeats: [6, 4], // Number of times this element repeats. Either an int or an array of ints.
      nextElement: 'chorus', // The element after this one. Either a string or an array of strings.
      sequences: [
        {
          notes: [notes.c4, notes.f4, notes.a4], // Notes to recognize this sequence. Array of 'notes'.
          repeats: 1, // The number of times 'notes' has to be repeated before 'action' is called
          action(seqTimesPlayed, elTimesPlayed) { // Called when 'notes' are played 'repeat' number of times
            switch (elTimesPlayed) {              // seqTimesPlayed: How many times this sequence has been repeated within the element
              case 0:                             // elTimesPlayed: How many times this sequence has been played through
                switch(seqTimesPlayed) {
                  case 0:
                    scenes.allOff(1000);
                    scenes.allBlackLightsOn();
                    break;
                  case 2:
                    scenes.redWash([lights.spotlight], 80, 1500);
                    break;
                }
                break;
              case 1:
                switch(seqTimesPlayed) {
                  case 0:
                    scenes.flicker([0, 100, 100], [lights.spotlight, lights.bed, lights.right, lights.left, lights.desk], 2000, 2000);
                    break;
                }
                break;
            }
          },
        },
        {
          notes: [notes.c4, notes.f4, notes.g4]
        }
      ]
    },
    chorus: {
      repeats: 2,
      nextElement: ['verse', 'bridge'],
      sequences: [
        {
          notes: [notes.d4, notes.f4, notes.b4b],
          actionRepeats: 1,
          action(seqTimesPlayed, elTimesPlayed) {
            switch (elTimesPlayed) {
              case 0:
                console.log('Turning spot light blue and bed lights on to blue');
                scenes.blueWash([lights.spotlight, lights.bed], 80, 3000);
                break;
              case 2:
                console.log('All lights go off expect spotlight');
                scenes.allBlackLightsOff();
                scenes.allOff();
                setTimeout(() => {
                  scenes.redWash([lights.piano], 100, 1000);
                }, 500);

                break;
            }
          }
        },
        {
          notes: [[notes.c4, notes.f4, notes.g4], [notes.c4, notes.e4, notes.g4]],
          repeats: [1, 5],
          action(seqTimesPlayed, elTimesPlayed) {
            switch (elTimesPlayed) {
              case 0:
                switch(seqTimesPlayed) {
                  case 1:
                    console.log('turn all lights to white');
                    scenes.setLightsOn([lights.spotlight, lights.bed, lights.desk, lights.left, lights.right], [0, 0, 100], 50)
                    break;
                }
                break;
            }
          }
        }
      ],
      onEnd(timesPlayed) {
        scenes.stopFlicker();

        if (timesPlayed == 2) {
          scenes.allOff();
        }
      }
    },
    bridge: {
      repeats: 3,
      nextElement: 'chorus',
      sequences: [
        {
          notes: [notes.c4, notes.f4, notes.a4],
          actionRepeats: 1,
          action() {
            scenes.colorLoop([lights.left, lights.right, lights.spotlight, lights.desk, lights.bed], 2000, 2000, null);
          }
        },
        {
          notes: [notes.d4, notes.f4, notes.b4b]
        },
        {
          notes: [[notes.c4, notes.f4, notes.a4], [notes.c4, notes.f4, notes.a4], [notes.c5]]
        }
      ],
      onEnd() {
        scenes.stopFlash();
      }
    }
  }
}

module.exports = theScientist;
