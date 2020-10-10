import { Shape } from '../3d/shape.js';
import { Vector3 } from '../3d/vector.js';

/**
 * A 3D object in the shooter game world.
 */
export class Model {

  /**
   * @param {Vector3} position - The position of this model.
   */
  constructor(position) {
    this._position = position;
  }

  /**
   * The position of this model.
   *
   * @type {Vector3}
   */
  get position() {
    return this._position;
  }

  /**
   * The size of this model.
   *
   * The size is represented as Vector3,
   * typically meaning the bounding box of the model,
   * and used when the collision detection.
   *
   * @type {Vector3}
   */
  get size() {
    throw 'not implemented';
  }

  /**
   * The angle of this model.
   *
   * @type {Vector3}
   */
  get angle() {
    throw 'not implemented';
  }

  /**
   * The velocity of this model (per frame).
   *
   * @type {Vector3}
   */
  get velocity() {
    throw 'not implemented';
  }

  /**
   * The shape of this model.
   *
   * @type {Shape}
   */
  get shape() {
    throw 'not implemented';
  }

  /**
   * The color of this model (rgba).
   *
   * @type {[number]}
   */
  get color() {
    throw 'not implemented';
  }

  /**
   * Moves this model.
   *
   * This method is called once per frame.
   */
  move() {
    throw 'not implemented';
  }

  /**
   * Shoots a model, typically a shot, or nothing.
   *
   * This method is called once per frame.
   *
   * @param {Vector3} [target] - The target.
   * @returns {Model?} The shot model.
   */
  shoot(target) {
    throw 'not implemented';
  }

}
