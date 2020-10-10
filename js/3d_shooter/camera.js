import { World } from './world.js';
import { Vector3 } from '../3d/vector.js';

/**
 * Provides camera parameters about the target world.
 */
export class Camera {

  /**
   * @param {Vector3} positionCoeffs
   *   The coefficients which will be used to calculate the camera position
   *   by the target model position.
   * @param {Vector3} angleCoeffs
   *   The coefficients which will be used to calculate the camera angle
   *   by the target model angle.
   * @param {number} brightnessSpeed
   *   The brightness change speed.
   */
  constructor(positionCoeffs, angleCoeffs, brightnessSpeed) {

    this.positionCoeffs = positionCoeffs;
    this.angleCoeffs = angleCoeffs;
    this.brightnessSpeed = brightnessSpeed;

    this.position = Vector3.zero();
    this.angle = Vector3.zero();
    this.brightness = 0.0;
  }

  /**
   * Adjusts the camera parameters to the world.
   *
   * This method should be called once per frame.
   *
   * @param {World} world - The adjustment target world.
   */
  adjustTo(world) {

    const targetModel = world.cameraTargetModel;

    // position and angle
    if (targetModel) {
      this.position = this.positionCoeffs.hadamardProduct(targetModel.position);
      this.angle = this.angleCoeffs.hadamardProduct(targetModel.angle);
    }

    // brightness
    this.brightness = Math.min(this.brightness + this.brightnessSpeed, 1.0);
  }

}
