'use strict';

let os        = require('os');
let Lightman  = require('@briblanch/lightman');

let scene     = require('./scene');

let lights    = scene.lights;
let colors    = scene.commonColors;

let songsDir  = __dirname + '/converted_songs';

let onConfig = () => {
  scene.allOff()
    .then(() => scene.on(lights.bulbs, colors.warm))
    .then(() => scene.blkLightsOff());
};

let midiPort = os.platform() == 'darwin' ? 0 : 1;

const options = {
  midiPort,
  onConfig: onConfig,
  testing: true
};

let app = Lightman.createApp(songsDir, options);

app.start();
