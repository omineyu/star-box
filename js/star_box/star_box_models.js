/**
 * Model classes in Star Box.
 */

import { Keyboard } from './utils/keyboard.js';
import { Matrices } from '../3d/matrices.js';
import { Shape } from '../3d/shape.js';
import { Shapes } from '../3d/shapes.js';
import { Vector3 } from '../3d/vector.js';
import { Model } from '../3d_shooter/model.js';

/**
 * An enemy model.
 */
export class EnemyModel extends Model {

  /**
   * @param {Vector3} position - The position.
   */
  constructor(position) {
    super(position);

    this._size = new Vector3(25.0, 25.0, 25.0);
    this._angle = Vector3.zero();
    this._shape = Shapes.cube(Vector3.zero(), 30.0);
    this._color = [255, 0, 0, 0.1];

    this._frame = 0;
  }

  get size() {
    return this._size;
  }

  get angle() {
    return this._angle;
  }

  get velocity() {
    if (this._frame < 40 || this._frame >= 90) {
      return new Vector3(0.0, 0.0, 15.0);
    } else {
      return Vector3.zero();
    }
  }

  get shape() {
    return this._shape;
  }

  get color() {
    return this._color;
  }

  move() {
    this._angle.y += 0.1;
    this._position = this._position.add(this.velocity);
    this._frame++;
  }

  shoot(target) {

    const willShoot = this._frame >= 50 && this._frame <= 80 && this._frame % 10 === 0;
    if (!willShoot) {
      return null;
    }

    // aim at the target
    const direction = target.sub(this._position);
    const angle = new Vector3(
      Math.atan2(direction.y, Math.sqrt(direction.z ** 2 + direction.x ** 2)),
      -Math.atan2(direction.z, direction.x) - Math.PI / 2,
      0.0);
    return new ShotModel(this._position.copy(), angle, this.color);
  }

}

/**
 * An explosion model that consists of scattering faces of a cube.
 */
export class ExplosionModel extends Model {

  static _EXPIRATION_FRAME = 60;

  // initial face positions
  static _P = 15.0;
  static _INITIAL_FACE_POSITIONS = [
    new Vector3( ExplosionModel._P, 0.0, 0.0),
    new Vector3(-ExplosionModel._P, 0.0, 0.0),
    new Vector3(0.0,  ExplosionModel._P, 0.0),
    new Vector3(0.0, -ExplosionModel._P, 0.0),
    new Vector3(0.0, 0.0,  ExplosionModel._P),
    new Vector3(0.0, 0.0, -ExplosionModel._P),
  ];

  // face velocities
  static _V = 5.0;
  static _FACE_VELOCITIES = [
    new Vector3( ExplosionModel._V, 0.0, 0.0),
    new Vector3(-ExplosionModel._V, 0.0, 0.0),
    new Vector3(0.0,  ExplosionModel._V, 0.0),
    new Vector3(0.0, -ExplosionModel._V, 0.0),
    new Vector3(0.0, 0.0,  ExplosionModel._V),
    new Vector3(0.0, 0.0, -ExplosionModel._V),
  ];

  // initial face angles
  static _A = Math.PI / 2;
  static _INITIAL_FACE_ANGLES = [
    new Vector3(0.0, 0.0, ExplosionModel._A),
    new Vector3(0.0, 0.0, ExplosionModel._A),
    new Vector3(ExplosionModel._A, 0.0, 0.0),
    new Vector3(ExplosionModel._A, 0.0, 0.0),
    new Vector3(0.0, 0.0, 0.0),
    new Vector3(0.0, 0.0, 0.0),
  ];

  /**
   * @param {Vector3} position - The position.
   * @param {Vector3} angle - The angle.
   * @param {Vector3} velocity - The velocity.
   * @param {[number]} color - The color.
   */
  constructor(position, angle, velocity, color) {
    super(position);

    this._angle = angle;
    this._velocity = velocity;
    this._color = color;

    this._frame = 0;
    this._faceAngularVelocities = [...Array(6)].map(_ => Vector3.random().scale(0.2));
  }

  /**
   * Creates an explosion model for the exploded model.
   *
   * @param {Model} model - The exploded model.
   * @returns {ExplosionModel} The explosion model.
   */
  static forModel(model) {
    return new ExplosionModel(
      model.position,
      model.angle,
      model.velocity,
      model.color
    );
  }

  get angle() {
    return this._angle;
  }

  get velocity() {
    return this._velocity;
  }

  get shape() {

    // faces of the exploded cube
    const faces = [...Array(6).keys()].map(i => {

      // position
      const initialPosition = ExplosionModel._INITIAL_FACE_POSITIONS[i];
      const velocity = ExplosionModel._FACE_VELOCITIES[i];
      const position = initialPosition.add(velocity.scale(this._frame));

      // angle
      const initialAngle = ExplosionModel._INITIAL_FACE_ANGLES[i];
      const angularVelocity = this._faceAngularVelocities[i];
      const angle = initialAngle.add(angularVelocity.scale(this._frame));

      return Shapes.plane(position, angle, 30.0, 30.0);
    });

    return Shape.join(faces);
  }

  get color() {

    const EXPIRATION_FRAME = ExplosionModel._EXPIRATION_FRAME;

    // fade out
    const color = this._color.concat();
    const opacity = color[3];
    const framesUntilExpiration = Math.max(EXPIRATION_FRAME - this._frame, 0);
    const fadedOpacity = opacity * framesUntilExpiration / EXPIRATION_FRAME;
    color[3] = fadedOpacity;

    return color;
  }

  move() {
    this._position = this._position.add(this._velocity);
    this._frame++;
  }

  /**
   * Examines wheather this model is completely faded out.
   *
   * @returns {boolean} true if completely faded out.
   */
  isFadedOut() {
    return this._frame >= ExplosionModel._EXPIRATION_FRAME;
  }

}

/**
 * A ground model.
 */
export class GroundModel extends Model {

  constructor() {
    const position = new Vector3(0.0, -200.0, -1000.001);
    super(position);

    this._angle = Vector3.zero();
    this._velocity = Vector3.zero();

    this._frame = 0;
  }

  get angle() {
    return this._angle;
  }

  get velocity() {
    return this._velocity;
  }

  get shape() {

    // plane
    const plane = Shapes.plane(Vector3.zero(), new Vector3(Math.PI / 2, 0.0, 0.0), 1000.0, 2000.0);

    // line segments in the X direction move
    const offset = this._frame * 15 + 125;
    const lineSegmentsX = [...Array(8).keys()].map(i => {
      const z = (i * 250 + offset) % 2000 - 1000;
      return Shapes.lineSegment(new Vector3(-500.0, 0.0, z), new Vector3(500.0, 0.0, z));
    });

    // line segments in the Z direction don't move
    const lineSegmentsZ = [...Array(4).keys()].map(i => {
      const x = i * 250 - 500;
      return Shapes.lineSegment(new Vector3(x, 0.0, -1000.0), new Vector3(x, 0.0, 1000.0));
    });

    const shapes = [plane].concat(lineSegmentsX).concat(lineSegmentsZ);
    return Shape.join(shapes);
  }

  get color() {
    return [0, 0, 0, 0.1];
  }

  move() {
    this._frame++;
  }

}

/**
 * An obstacle model.
 */
export class ObstacleModel extends Model {

  /**
   * @param {Vector3} position - The position.
   * @param {Vector3} size - The size.
   */
  constructor(position, size) {
    super(position);

    this._size = size;
    this._angle = Vector3.zero();
    this._velocity = new Vector3(0.0, 0.0, 15.0);
    this._shape = Shapes.cuboid(Vector3.zero(), size);
    this._color = [0, 0, 0, 0.1];
  }

  /**
   * Creates a building obstacle model.
   *
   * @param {number} positionX - The X position.
   * @param {number} positionZ - The Z position.
   * @param {number} height - The height.
   */
  static building(positionX, positionZ, height) {
    const positionY = height / 2 - 200.0;
    const position = new Vector3(positionX, positionY, positionZ);
    const size = new Vector3(100.0, height, 100.0);
    return new ObstacleModel(position, size);
  }

  get size() {
    return this._size;
  }

  get angle() {
    return this._angle;
  }

  get velocity() {
    return this._velocity;
  }

  get shape() {
    return this._shape;
  }

  get color() {
    return this._color;
  }

  move() {
    this._position = this._position.add(this.velocity);
  }

}

/**
 * A player model.
 */
export class PlayerModel extends Model {

  static _SHAPE = Shape.join([
    // the fighter aircraft
    Shapes.cube(Vector3.zero(), 25.0),
    Shapes.cube(new Vector3(25.0, 0.0, 12.5), 12.5),
    Shapes.cube(new Vector3(-25.0, 0.0, 12.5), 12.5),
    // the reticle
    Shapes.cuboid(new Vector3(0.0, 0.0, -400.0), new Vector3(50.0, 10.0, 10.0)),
    Shapes.cuboid(new Vector3(0.0, 0.0, -400.0), new Vector3(10.0, 50.0, 10.0)),
  ])

  constructor() {
    const position = new Vector3(0.0, 0.0, -180.0);
    super(position);

    this._size = new Vector3(25.0, 25.0, 25.0);
    this._angle = Vector3.zero();
    this._velocity = Vector3.zero();
    this._shape = PlayerModel._SHAPE;
    this._color = [0, 100, 255, 0.2];

    this._frame = 0;
    this._framesUntilNextShot = 0;
    this._keyboard = new Keyboard();
  }

  get size() {
    return this._size;
  }

  get angle() {
    return this._angle;
  }

  get velocity() {
    return this._velocity;
  }

  get shape() {
    return this._shape;
  }

  get color() {
    return this._color;
  }

  move() {

    // accel by keyboard inputs
    const ACCELERATION = 3.0;
    if (this._keyboard.isKeyDown(Keyboard.ARROW_RIGHT)) {
      this._velocity.x += ACCELERATION;
    }
    if (this._keyboard.isKeyDown(Keyboard.ARROW_LEFT)) {
      this._velocity.x -= ACCELERATION;
    }
    if (this._keyboard.isKeyDown(Keyboard.ARROW_UP)) {
      this._velocity.y += ACCELERATION;
    }
    if (this._keyboard.isKeyDown(Keyboard.ARROW_DOWN)) {
      this._velocity.y -= ACCELERATION;
    }
    this._velocity = this._velocity.scale(0.9);

    // add the velocity to the position
    this._position = this._position.add(this._velocity);
    const X_LIMIT = 250.0;
    const Y_LIMIT = 180.0;
    if (this._position.x < -X_LIMIT) { this._position.x = -X_LIMIT; }
    if (this._position.x >  X_LIMIT) { this._position.x =  X_LIMIT; }
    if (this._position.y < -Y_LIMIT) { this._position.y = -Y_LIMIT; }
    if (this._position.y >  Y_LIMIT) { this._position.y =  Y_LIMIT; }

    // the angle depends on the velocity
    const swaying = 0.03 * Math.sin(0.1 * this._frame);
    this._angle.x =  0.016 * this._velocity.y;
    this._angle.y = -0.010 * this._velocity.x;
    this._angle.z = -0.010 * this._velocity.x + swaying;

    // frame count
    this._frame++;
  }

  shoot() {

    if (this._framesUntilNextShot > 0) {
      this._framesUntilNextShot--;
      return null;
    }

    if (this._keyboard.isKeyDown(Keyboard.SPACE)) {
      this._framesUntilNextShot = 10;
      return new ShotModel(this.position.copy(), this.angle.copy(), this.color.concat());
    } else {
      return null;
    }
  }

}

/**
 * A shot model.
 */
export class ShotModel extends Model {

  /**
   * @param {Vector3} position - The position.
   * @param {Vector3} angle - The angle.
   * @param {[number]} color - The color.
   */
  constructor(position, angle, color) {
    super(position);
    this._angle = angle;
    this._velocity = Matrices.rotationMatrix(angle).apply(new Vector3(0.0, 0.0, -50.0));
    this._shape = Shapes.cuboid(Vector3.zero(), new Vector3(10.0, 10.0, 50.0));
    this._color = color;
  }

  get angle() {
    return this._angle;
  }

  get velocity() {
    return this._velocity;
  }

  get shape() {
    return this._shape;
  }

  get color() {
    return this._color;
  }

  move() {
    this._position = this._position.add(this._velocity);
  }

}
