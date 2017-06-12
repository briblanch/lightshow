'use strict';

let os        = require('os');
let Lightman  = require('@briblanch/lightman');

let notes     = Lightman.notes;

let scene     = require('./scene');

let lights    = scene.lights;
let colors    = scene.commonColors;

let songsDir  = __dirname + '/converted_songs';

let intro     = require('./intro');
let exec      = require('child_process').exec;

let onConfig = () => {
  exec('killall mpg123');
  scene.stop();
};

let lightsOn = () => {
  scene.allOff()
    .then(() => scene.delay(500))
    .then(() => scene.on(lights.bulbs, colors.warm))
    .then(() => scene.blkLightsOff())
    .then(() => scene.washFxOff());
};

let smokeCount = 0;
let cancelSmoke = false;

let smokeEm = function() {
  if (cancelSmoke) {
    cancelSmoke = false;
    scene.smokeOff();
    return;
  }

  let timeout;

  if (smokeCount % 2 == 0) {
    if (smokeCount == 0) {
      timeout = 20000;
    } else {
      timeout = 45000;
    }

    scene.smokeOff();
  } else {
    if (smokeCount == 1 || smokeCount == 3) {
      timeout = 12000;
    } else {
      timeout = 8000;
    }

    scene.smokeOn();
  }

  smokeCount++;
  setTimeout(smokeEm, timeout);
};

let cancelSmokeEm = () => {
  console.log('canceling');
  cancelSmoke = !cancelSmoke;
  if (cancelSmoke) {
    smokeCount = 0;
  }
};

let vivaLaVida = () => {
  for (var song of app.songs) {
    if (song.name == 'Viva La Vida') {
      return song
    }
  }

  return null;
};

let introSequence = () => {
  app.setCurrentSong(vivaLaVida());
  intro.run()
    .then(() => app.state.currentSong.startBackingTrack())
    .then(() => smokeEm());
};

let midiPort = os.platform() == 'darwin' ? 0 : 1;

var controlMapping = {};
controlMapping[notes.a7] = smokeEm;
controlMapping[notes.b7] = cancelSmokeEm;
controlMapping[notes.g7] = introSequence;
controlMapping[notes.f7s] = lightsOn;

const options = {
  midiPort,
  onConfig: onConfig,
  controlMapping
};

let app = Lightman.createApp(songsDir, options);

app.start();
