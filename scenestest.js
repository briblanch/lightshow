let scene = require('./scene');
let dmx = require('./scene/dmx/');

let lights = scene.lights;
let colors = scene.commonColors;

let map = {};
map[lights.left] = [colors.pink];
map[lights.right] = [colors.pink];
map[lights.desk] = [colors.pink];

// scene.allOff()
//   .then(() => scene.groupFlash(lights.allLights, colors.white, 1000, 500, 2000))
//   .then(() => scene.delay(2500))
//   .then(() => scene.flash(lights.allLights, [colors.pink, colors.green], 120, map))

scene.blkLightsOn();
dmx.washFx.bothLasers(0, 127);
