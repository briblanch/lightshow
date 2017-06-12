let scene     = require('./scene');
let exec      = require('child_process').exec;
let Promise   = require('bluebird');
let kill      = require('tree-kill');

let lights    = scene.lights;

let intro = {
  introTrack: null,
  run() {
    var self = this;
    return new Promise((resolve, reject) => {
        self.introTrack = exec('mpg123 ' + __dirname + '/backing_tracks/backtothefuture.mp3', () => {});
        scene.delay(1000 * 29)
          .then(() => scene.off(lights.desk))
          .then(() => scene.delay(2000))
          .then(() => scene.off(lights.left))
          .then(() => scene.delay(2000))
          .then(() => scene.off(lights.right))
          .then(() => scene.delay(2000))
          .then(() => scene.off(lights.bed))
          .then(() => scene.delay(3000))
          .then(() => scene.washBlkLightOn())
          .then(() => scene.delay(6000))
          .then(() => scene.pianoBlkLightOn())
          .then(() => scene.delay(1000))
          .then(() => scene.smokeOn())
          .then(() => scene.delay(1000 * 10))
          .then(() => scene.smokeOff())
          .then(() => scene.delay(8 * 1000))
          .then(() => exec('killall mpg123'))
          .then(() => scene.delay(800))
          .then(resolve);
    });
  }
};

module.exports = intro;
