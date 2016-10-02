let Scene = require('./scene');

let lights = Scene.lights;
let colors = Scene.commonColors;

let scene = Scene.createScene();

let map = {};
map[lights.left] = [colors.pink];
map[lights.right] = [colors.pink];
map[lights.desk] = [colors.pink];

scene.allOff()
  .then(() => scene.groupFlash(lights.allLights, colors.white, 1000, 500, 2000))
  .then(() => scene.delay(2500))
  .then(() => scene.flash(lights.allLights, [colors.pink, colors.green], 120, map))
