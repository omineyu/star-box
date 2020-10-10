/**
 * Projection classes.
 */

import { Projection } from './projection.js';
import { Vector2 } from './vector.js';

// Currently only PerspectiveProjection is implemented.

/**
 * Perspective projection.
 */
export class PerspectiveProjection extends Projection {

  /**
   * @param {number} d - The distance between the camera and the plane.
   */
  constructor(d) {
    super();
    this.d = d;
  }

  project(vector) {
    const r = -this.d / vector.z;
    return new Vector2(r * vector.x, r * vector.y);
  }

}
