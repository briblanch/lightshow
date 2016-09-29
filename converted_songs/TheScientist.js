'use strict';

let notes   = require('lightman').notes;
let Scene   = require('../scene')

let lights  = scenes.lights;
let Color   = scenes.color;
let colors  = scenes.commonColors;

let Scene   = scene.createScene();

let theScientist = {
  name: 'The Scientist', // Name of the song
  hook: [notes.f4, notes.b4b, notes.c5], // The song hook. This is how lightman knows what song to play.
  startingElement: 'verse', // The starting element of the song, defaults to 'intro'
  backingTrack: __dirname + '/../backing_tracks/thescientist.mp3',
  onCancel() {
    scene.stop()
  },
  elements: { // Object of elements
    verse: {
      repeats: 6, // Number of times this element repeats. Either an int or an array of ints.
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
                    scene.allOff(1000)
                      .then(() => scene.blkLightsOn());
                    break;
                  case 2:
                    scene.redWash(lights.spotlight, 80, 1500);
                    break;
                }
                break;
              case 1:
                switch(seqTimesPlayed) {
                  case 0:
                    scene.blkLightsOn()
                      .then(() => scene.flicker(lights.allLights, colors.red, 1800, 2000));
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
                scene.blueWash([lights.spotlight, lights.bed], 80, 3000);
                break;
              case 2:
                scene.blkLightsOff()
                  .then(() => scene.allOff(0))
                  .then(() => scene.redWash(lights.piano, 100, 0));
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
                    scene.blkLightsOff().
                      then(() => scene.on(lights.notPiano, colors.white, 0));
                    break;
                }
                break;
            }
          }
        }
      ],
      onEnd(timesPlayed) {
        if (timesPlayed == 1) {
          scene.stop()
            .then(() => scene.blkLightsOff());
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
            scene.colorLoop(lights.allLights, true, 2000, 2000);
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
        scene.stop();
      }
    }
  }
}

module.exports = theScientist;
