import { Model } from '../model.js';

/**
 * A result of collisions.
 */
export class CollisionResult {

  /**
   * @param {[Model]} srcModelsAfter - The source models after collisions.
   * @param {[Model]} dstModelsAfter - The destination models after collisions.
   * @param {[Model]} explosionModels - The new explosion models.
   */
  constructor(srcModelsAfter, dstModelsAfter, explosionModels) {
    this.srcModelsAfter = srcModelsAfter;
    this.dstModelsAfter = dstModelsAfter;
    this.explosionModels = explosionModels;
  }

}
