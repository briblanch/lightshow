'use strict';

let scenes   = require('./scenes');
let lightman = require('lightman');
let lights   = require('./hue.json').lights;


let songsDir = __dirname + '/converted_songs';

let afterEach = () => {
  scenes.allOff();
  scenes.setLightsOn([lights.left, lights.right, lights.bed, lights.desk], [41, 31, 50]);
  scenes.allBlackLightsOff();
};

const options = {
  afterEach,
  onConfig: afterEach
};

let app = lightman.createApp(songsDir, options);
app.start();

process.on('SIGINT', () => {
  afterEach();
});
