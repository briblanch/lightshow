let scenes = require('./scenes');

let lights = scenes.lights;
let colors = scenes.commonColors;

let scene = scenes.createScene();

let map = {};
map[lights.left] = [colors.pink];
map[lights.right] = [colors.pink];
map[lights.desk] = [colors.pink];

scene.allOff()
  .then(() => scene.groupFlash(lights.allLights, colors.white, 1000, 500, 2000))
  .then(() => scene.delay(2500))
  .then(() => scene.flash(lights.allLights, [colors.pink, colors.green], 120, map))
  .then(() => scene.delay(5000))
  .then(() => scene.stop());
