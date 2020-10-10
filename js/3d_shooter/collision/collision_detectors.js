/**
 * Provides collision detectors.
 */

import { CollisionDetector } from './collision_detector.js';
import { OverlapDetector } from '../../3d/overlap_detector.js';

/**
 * Detects a collision between the obstacle and the player.
 */
export class ObstacleAndPlayerCollisionDetector extends CollisionDetector {

  static INSTANCE = new ObstacleAndPlayerCollisionDetector();

   detect(model1, model2) {

    const obstacleModel = model1;
    const playerModel = model2;

    return OverlapDetector.pointAndCuboid(
      playerModel.position,
      obstacleModel.position,
      obstacleModel.size
    )
  }

}

/**
 * Detects a collision between the shot and the target.
 */
export class ShotAndTargetCollisionDetector extends CollisionDetector {

  static INSTANCE = new ShotAndTargetCollisionDetector();

  detect(model1, model2) {

    const shotModel = model1;
    const targetModel = model2;

    const lineSegmentStart = shotModel.position;
    const lineSegmentEnd = shotModel.position.add(shotModel.velocity);
    const ballCenter = targetModel.position;
    // determine the radius from the target model size for simplicity
    const ballRadius = 1.2 * Math.max(targetModel.size.x, targetModel.size.y, targetModel.size.z);
    return OverlapDetector.lineSegmentAndBall(
      lineSegmentStart, lineSegmentEnd, ballCenter, ballRadius
    ); 
  }

}
