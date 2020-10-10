import { ExplosionModel, GroundModel, PlayerModel } from './star_box_models.js';
import { STAR_BOX_SCENARIO_DATA } from './star_box_scenario.js';
import { PerspectiveProjection } from '../3d/projections.js';
import { Vector3 } from '../3d/vector.js';
import { Camera } from '../3d_shooter/camera.js';
import { SOUND_EXPLOSION_ENEMY, SOUND_EXPLOSION_PLAYER, SOUND_SHOT_ENEMY, SOUND_SHOT_PLAYER } from '../3d_shooter/constants.js';
import { Renderer } from '../3d_shooter/renderer.js';
import { Scenario } from '../3d_shooter/scenario.js';
import { World } from '../3d_shooter/world.js';

/**
 * The entry point.
 */
function main() {

  const FPS = 15;
  const SPEED = 15.0;

  const world = createWorld();
  const renderer = createRenderer();

  // main loop
  window.setInterval(() => {
    world.proceed(-SPEED);
    renderer.render(world);
  }, 1000.0 / FPS);
}

/**
 * Creates the Star Box world.
 *
 * @returns {World} The world.
 */
function createWorld() {

  const audioOf = fileName => new Audio(`resources/sounds/${fileName}`);
  const sounds = new Map([
    [SOUND_SHOT_PLAYER, audioOf('se_pyuun.mp3')],
    [SOUND_SHOT_ENEMY, audioOf('se_pow_1.mp3')],
    [SOUND_EXPLOSION_PLAYER, audioOf('se_zugyan.mp3')],
    [SOUND_EXPLOSION_ENEMY, audioOf('se_breakout_2.mp3')],
  ]);

  return new World(
    new PlayerModel(),
    new GroundModel(),
    ExplosionModel.forModel,
    new Scenario(STAR_BOX_SCENARIO_DATA),
    sounds
  );
}

/**
 * Creates the Star Box renderer.
 *
 * @returns {Renderer} The renderer.
 */
function createRenderer() {

  // canvas
  const canvas = document.getElementById('canvas');

  // camera
  const positionCoeffs = new Vector3(0.5, 0.5, 0.0);
  const angleCoeffs = new Vector3(0.0, 0.0, -0.25);
  const brightnessSpeed = 0.03;
  const camera = new Camera(positionCoeffs, angleCoeffs, brightnessSpeed);

  // projection
  const projection = new PerspectiveProjection(300.0);

  return new Renderer(
    canvas.getContext('2d'), canvas.width, canvas.height, camera, projection);
}

main();
