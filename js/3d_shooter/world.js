import { Collision } from './collision/collision.js';
import { CollisionDetector } from './collision/collision_detector.js';
import { ObstacleAndPlayerCollisionDetector, ShotAndTargetCollisionDetector } from './collision/collision_detectors.js';
import { SOUND_EXPLOSION_ENEMY, SOUND_EXPLOSION_PLAYER, SOUND_SHOT_ENEMY, SOUND_SHOT_PLAYER, Z_LIMIT} from './constants.js';
import { Model } from './model.js';
import { Scenario } from './scenario.js';
import { Vector3 } from '../3d/vector.js';

/**
 * A 3D shooter game world that contains and updates the game data.
 */
export class World {

  /**
   * @param {Model} playerModel - The player model.
   * @param {Model} groundModel - The ground model.
   * @param {function(Model): Model} explosionModelFactory - The factory method of an explosion model.
   * @param {Scenario} scenario - The scenario.
   * @param {Map<string, HTMLAudioElement>} sounds - The sounds.
   */
  constructor(playerModel, groundModel, explosionModelFactory, scenario, sounds) {

    this._explosionModelFactory = explosionModelFactory;
    this._scenario = scenario;
    this._sounds = sounds;

    this.optionalPlayerModel = [playerModel];  // empty if exploded
    this.enemyModels = [];
    this.playerShotModels = [];
    this.enemyShotModels = [];
    this.explosionModels = [];
    this.obstacleModels = [];
    this.backgroundModels = [groundModel];
  }

  /**
   * All models in this world.
   *
   * @type {[Model]}
   */
  get allModels() {
    return [].concat(
      this.optionalPlayerModel,
      this.enemyModels,
      this.playerShotModels,
      this.enemyShotModels,
      this.explosionModels,
      this.obstacleModels,
      this.backgroundModels
    );
  }

  /**
   * The camera target model in this world (if exists).
   *
   * @type {Model?}
   */
  get cameraTargetModel() {
    if (this.optionalPlayerModel.length) {
      return this.optionalPlayerModel[0];
    } else {
      return null;
    }
  }

  /**
   * The message for user.
   *
   * @type {string?}
   */
  get message() {
    if (!this.optionalPlayerModel.length) {
      return 'GAME OVER';
    } else if (this._scenario.isEnd() && !this.enemyModels.length) {
      return 'YOU WIN!'
    } else {
      return null;
    }
  }

  /**
   * Proceeds to the next frame.
   *
   * @param {number} z - The amount of movement in the Z direction.
   */
  proceed(z) {
    this._readScenario(z);
    this._move();
    this._shoot();
    this._collision();
  }

  /**
   * Reads scenario and take next models.
   *
   * @param {number} z - The amount of movement in the Z direction.
   */
  _readScenario(z) {
    const nextData = this._scenario.nextData(z);
    this.obstacleModels.push(...nextData.obstacleModels);
    this.enemyModels.push(...nextData.enemyModels);
  }

  /**
   * Moves all models.
   */
  _move() {

    // move all models
    for (const model of this.allModels) {
      model.move();
    }

    // remove all out of range models
    const isInRange = model => (model.position.z < 0.0 && model.position.z >= Z_LIMIT);
    this.obstacleModels = this.obstacleModels.filter(isInRange);
    this.enemyModels = this.enemyModels.filter(isInRange);
    this.playerShotModels = this.playerShotModels.filter(isInRange);
    this.enemyShotModels = this.enemyShotModels.filter(isInRange);
 
    // remove all faded out models
    this.explosionModels = this.explosionModels.filter(model => !model.isFadedOut());
  }

  /**
   * Shoots shots from all models.
   */
  _shoot() {
    if (this.optionalPlayerModel.length) {
      // player
      this.playerShotModels.push(...this._do_shoot(
        this.optionalPlayerModel,
        undefined,
        this._sounds.get(SOUND_SHOT_PLAYER)
      ));
      // enemies
      this.enemyShotModels.push(...this._do_shoot(
        this.enemyModels,
        this.optionalPlayerModel[0].position,
        this._sounds.get(SOUND_SHOT_ENEMY)
      ));
    }
  }

  /**
   * Shoots shots from the models.
   *
   * @param {[Model]} shooterModels - The shooter models.
   * @param {Vector3} target - The shooting target.
   * @param {HTMLAudioElement} shotSound - The shot sound.
   * @returns {[Model]} The shot models.
   */
  _do_shoot(shooterModels, target, shotSound) {

    const shots = shooterModels.map(
      shooter => shooter.shoot(target)
    ).filter(
      shot => shot !== null
    );

    if (shots.length) {
      shotSound.play();
    }

    return shots;
  }

  /**
   * Detects and handles collisions.
   */
  _collision() {

    // obstacles to player
    this._do_collision(
      this.obstacleModels.slice(0), // don't remove when collision
      this.optionalPlayerModel,
      ObstacleAndPlayerCollisionDetector.INSTANCE,
      this._sounds.get(SOUND_EXPLOSION_PLAYER)
    );

    // player shots to enemies
    this._do_collision(
      this.playerShotModels,
      this.enemyModels,
      ShotAndTargetCollisionDetector.INSTANCE,
      this._sounds.get(SOUND_EXPLOSION_ENEMY)
    );

    // enemy shots to player
    this._do_collision(
      this.enemyShotModels,
      this.optionalPlayerModel,
      ShotAndTargetCollisionDetector.INSTANCE,
      this._sounds.get(SOUND_EXPLOSION_PLAYER)
    );
  }

  /**
   * Detects and handles collisions between models and other models.
   *
   * @param {[Model]} srcModels - The source models.
   * @param {[Model]} dstModels - The destination models.
   * @param {CollisionDetector} collisionDetector - The collision detector.
   * @param {HTMLAudioElement} explosionSound - The explosion sound.
   */
  _do_collision(srcModels, dstModels, collisionDetector, explosionSound) {

    const collision = new Collision(collisionDetector, this._explosionModelFactory);
    const result = collision.between(srcModels, dstModels);

    srcModels.splice(0);
    dstModels.splice(0);
    srcModels.push(...result.srcModelsAfter);
    dstModels.push(...result.dstModelsAfter);

    this.explosionModels.push(...result.explosionModels);

    if (result.explosionModels.length) {
      explosionSound.play();
    }
  }

}
