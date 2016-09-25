'use strict';

let os        = require('os');
let lightman  = require('lightman');

let scenes    = require('./scenes');

let scene     = scenes.createScene();
let lights    = scenes.lights;
let colors    = scenes.commonColors;

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
};

let app = lightman.createApp(songsDir, options);

app.start();
