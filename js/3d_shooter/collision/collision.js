import { CollisionResult } from './collision_result.js';
import { Model } from '../model.js';

/**
 * Detects and handles collisions.
 */
export class Collision {

  /**
   * @param {CollisionDetector} collisionDetector - The collision detector.
   * @param {function(Model): Model} explosionModelFactory - The factory method of an explosion model.
   */
  constructor(collisionDetector, explosionModelFactory) {
    this.collisionDetector = collisionDetector;
    this.explosionModelFactory = explosionModelFactory;
  }

  /**
   * Detects and handles collisions between models and other models.
   *
   * When a source model collides against a destination model:
   * - Each model disappers.
   * - The destination model is replaced with a explosion model.
   *
   * @param {[Model]} srcModels - The source models.
   * @param {[Model]} dstModels - The destination models.
   * @returns {CollisionResult} The collision result.
   */
  between(srcModels, dstModels) {

    const [srcHitAt, dstHitAt] = this._hitsBetweenModels(srcModels, dstModels);
 
    const srcModelsAfter = srcModels.filter((_, i) => !srcHitAt[i]);
    const dstModelsAfter = dstModels.filter((_, i) => !dstHitAt[i]);
    const newExplosionModels = dstModels.filter(
      (_, i) => dstHitAt[i]
    ).map(
      model => this.explosionModelFactory(model)
    );

    return new CollisionResult(srcModelsAfter, dstModelsAfter, newExplosionModels);
  }

  /**
   * Detects collisions between models and other models.
   *
   * @param {[Model]} models1 - The model group 1.
   * @param {[Model]} models2 - The model group 2.
   * @returns {[[boolean]]} [(models1 hit flags), (models2 hit flags)]
   */
  _hitsBetweenModels(models1, models2) {

    const hit1At = Array(models1.length).fill(false);
    const hit2At = Array(models2.length).fill(false);

    for (let i = 0; i < models1.length; i++) {
      for (let j = 0; j < models2.length; j++) {
        const hit = this.collisionDetector.detect(models1[i], models2[j]);
        if (hit) {
          hit1At[i] = hit2At[j] = true;
        }
      }
    }

    return [hit1At, hit2At];
  }

}
