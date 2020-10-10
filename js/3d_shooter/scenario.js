import { VISIBLE_DISTANCE_ENEMIES, VISIBLE_DISTANCE_OBSTACLES } from './constants.js';
import { Model } from './model.js';

/**
 * A 3D shooter game scenario that provides next models with proper timing.
 */
export class Scenario {

  /**
   * @param {ScenarioData} scenarioData - The scenario data.
   */
  constructor(scenarioData) {
    this._scenarioData = scenarioData;
    this._offset = 0.0;
  }

  /**
   * Examines wheather this scenario reached at the end.
   *
   * @returns {boolean} true if reached at the end.
   */
  isEnd() {
    return (
      !this._scenarioData.obstacleModels.length &&
      !this._scenarioData.enemyModels.length
    );
  }

  /**
   * Returns the next models.
   *
   * @param {number} z - The amount of movement in the Z direction.
   * @returns {ScenarioData} The scenario data containing the next models.
   */
  nextData(z) {

    this._offset += z;

    const nextObstacleModels = this._nextModels(
        this._scenarioData.obstacleModels,
        VISIBLE_DISTANCE_OBSTACLES
    );

    const nextEnemyModels = this._nextModels(
        this._scenarioData.enemyModels,
        VISIBLE_DISTANCE_ENEMIES
    );

    return new ScenarioData(nextObstacleModels, nextEnemyModels);
  }

  /**
   * Takes next models from the source models in the visible distance.
   *
   * @param {[Model]} sourceModels - The source models.
   * @param {number} visibleDistance - The visible distance.
   * @returns {[Model]} The next models.
   */
  _nextModels(sourceModels, visibleDistance) {

    const nextModels = [];

    while (true) {

      const nextModel = sourceModels.shift();
      if (nextModel === undefined) {
        break;
      }

      const visible = (nextModel.position.z >= -visibleDistance + this._offset);
      if (visible) {
        nextModel.position.z -= this._offset;
        nextModels.push(nextModel);
      } else {
        sourceModels.unshift(nextModel);
        break;
      }
    }

    return nextModels;
  }

}

/**
 * A 3D shooter game scenario data.
 */
export class ScenarioData {

  /**
   * @param {[Model]} obstacleModels - The obstacle models.
   * @param {[Model]} enemyModels - The enemy models.
   */
  constructor(obstacleModels, enemyModels) {
    const compareDepth = (model1, model2) => model2.position.z - model1.position.z;
    this.obstacleModels = obstacleModels.slice().sort(compareDepth);
    this.enemyModels = enemyModels.slice().sort(compareDepth);
  }

}
