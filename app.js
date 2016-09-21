'use strict';

let os       = require('os');
let lightman = require('lightman');

let scenes   = require('./scenes');
let lights   = require('./hue.json').lights;

let songsDir = __dirname + '/converted_songs';

let afterEach = () => {
  scenes.allOff();
  scenes.setLightsOn([lights.left, lights.right, lights.bed, lights.desk], [41, 31, 50]);
  scenes.allBlackLightsOff();
};

let midiPort = os.platform() == 'darwin' ? 0 : 1;

const options = {
  midiPort
  onConfig: afterEach,
};

let app = lightman.createApp(songsDir, options);
app.start();

process.on('SIGINT', () => {
  afterEach();
});
