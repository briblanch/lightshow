'use strict';

let os        = require('os');
let Lightman  = require('lightman');

let Scene     = require('./scene');

let scene     = Scene.createScene();
let lights    = Scene.lights;
let colors    = Scene.commonColors;

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

let app = Lightman.createApp(songsDir, options);

app.start();
