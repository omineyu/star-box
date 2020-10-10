import { Vector3 } from './vector.js';

/**
 * Detects overlaps between 3D objects.
 */
export class OverlapDetector {

  /**
   * Detects an overlap between the point and the cuboid.
   *
   * @param {Vector3} point - The point.
   * @param {Vector3} cuboidCenter - The center of the cuboid.
   * @param {Vector3} cuboidSize - The size of the cuboid.
   * @returns {boolean} true if overlapped.
   */
  static pointAndCuboid(point, cuboidCenter, cuboidSize) {

    const p = point.sub(cuboidCenter);
    const d = cuboidSize.scale(0.5);

    return (
      p.x > -d.x && p.x < d.x &&
      p.y > -d.y && p.y < d.y &&
      p.z > -d.z && p.z < d.z
    );
  }

  /**
   * Detects an overlap between the line segment and the ball.
   *
   * @param {Vector3} lineSegmentStart - The start of the line segment.
   * @param {Vector3} lineSegmentEnd - The end of the line segment.
   * @param {Vector3} ballCenter - The ball center.
   * @param {number} ballRadius - The ball radius.
   * @returns {boolean} true if overlapped.
   */
  static lineSegmentAndBall(lineSegmentStart, lineSegmentEnd, ballCenter, ballRadius) {

    const v = lineSegmentEnd.sub(lineSegmentStart);
    const c = ballCenter.sub(lineSegmentStart);

    // calculate the squared distance
    let squaredDistance = NaN;
    const dotProduct = v.dotProduct(c);
    if (dotProduct <= 0.0) {
      // the ball center is in front of the line segment
      squaredDistance = c.squaredLength();
    } else if (dotProduct >= v.squaredLength()) {
      // the ball center is behind the line segment
      squaredDistance = v.squaredDistance(c);
    } else {
      // consider the perpendicular line with the Pythagorean theorem
      squaredDistance = c.squaredLength() - dotProduct / v.length();
    }

    return squaredDistance <= ballRadius ** 2;
  }

}
