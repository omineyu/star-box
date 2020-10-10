import { Matrix } from './matrix.js';
import { Vector3 } from './vector.js';

/**
 * Provides commonly used matrices.
 *
 * The coordinate system is right-handed:
 *
 *     y
 *     |
 *     *-- x
 *    /
 *   z
 *
 */
export class Matrices {

  /**
   * Creates a general rotation matrix:
   *
   * R = Ry Rx Rz.
   *
   * @param {Vector3} angle - The vector of angles.
   * @returns {Matrix} The rotation matrix.
   */
  static rotationMatrix(angle) {
    const rX = this.rotationMatrixX(angle.x);
    const rY = this.rotationMatrixY(angle.y);
    const rZ = this.rotationMatrixZ(angle.z);
    return rY.mul(rX).mul(rZ);
  }

  /**
   * Creates a rotation matrix about x-axis.
   *
   * @param {number} angle - The rotation angle.
   * @returns {Matrix} The rotation matrix.
   */
  static rotationMatrixX(angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return new Matrix([
      [ 1.0, 0.0, 0.0, 0.0],
      [ 0.0,   c,  -s, 0.0],
      [ 0.0,   s,   c, 0.0],
      [ 0.0, 0.0, 0.0, 1.0],
    ]);
  }

  /**
   * Creates a rotation matrix about y-axis.
   *
   * @param {number} angle - The rotation angle.
   * @returns {Matrix} The rotation matrix.
   */
  static rotationMatrixY(angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return new Matrix([
      [   c, 0.0,   s, 0.0],
      [ 0.0, 1.0, 0.0, 0.0],
      [  -s, 0.0,   c, 0.0],
      [ 0.0, 0.0, 0.0, 1.0],
    ]);
  }

  /**
   * Creates a rotation matrix about z-axis.
   *
   * @param {number} angle - The rotation angle.
   * @returns {Matrix} The rotation matrix.
   */
  static rotationMatrixZ(angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return new Matrix([
      [  c,  -s, 0.0, 0.0],
      [  s,   c, 0.0, 0.0],
      [0.0, 0.0, 1.0, 0.0],
      [0.0, 0.0, 0.0, 1.0],
    ]);
  }

  /**
   * Creates a translation matrix.
   *
   * @param {Vector3} vector - The vector that represents the translation.
   * @returns {Matrix} The translation matrix.
   */
  static translationMatrix(vector) {
    return new Matrix([
      [1.0, 0.0, 0.0, vector.x],
      [0.0, 1.0, 0.0, vector.y],
      [0.0, 0.0, 1.0, vector.z],
      [0.0, 0.0, 0.0,      1.0],
    ]);
  }

  /**
   * Creates a transformation matrix about the position and the angle.
   *
   * @param {Vector3} position - The position.
   * @param {Vector3} angle - The angle.
   * @returns {Matrix} The transformation matrix.
   */
  static transformationMatrix(position, angle) {
    const rotationMatrix = Matrices.rotationMatrix(angle);
    const translationMatrix = Matrices.translationMatrix(position);
    return translationMatrix.mul(rotationMatrix);
  }

  /**
   * Creates the inverse of the transformation matrix about the position and the angle.
   *
   * @param {Vector3} position - The position.
   * @param {Vector3} angle - The angle.
   * @returns {Matrix} The inverse of the transformation matrix.
   */
  static transformationMatrixInverse(position, angle) {
    const rotationMatrixInverse = Matrices.rotationMatrix(angle.inverse());
    const translationMatrixInverse = Matrices.translationMatrix(position.inverse());
    return rotationMatrixInverse.mul(translationMatrixInverse);
  }

}
