import { Matrices } from './matrices.js';
import { Shape } from './shape.js';
import { Vector3 } from './vector.js';

/**
 * Provides commonly used shapes.
 */
export class Shapes {

  /**
   * Creates a cube.
   *
   * @param {Vector3} position - The position.
   * @param {number} size - The size.
   * @returns {Shape} The cube.
   */
  static cube(position, size) {
    const sizeVector = new Vector3(size, size, size);
    return Shapes.cuboid(position, sizeVector);
  }

  /**
   * Creates a cuboid.
   *
   * @param {Vector3} position - The position.
   * @param {Vector3} size - The size.
   * @returns {Shape} The cuboid.
   */
  static cuboid(position, size) {

    const d = size.scale(0.5);

    const vertices = [
      new Vector3(-d.x, -d.y,  d.z),
      new Vector3(-d.x, -d.y, -d.z),
      new Vector3( d.x, -d.y, -d.z),
      new Vector3( d.x, -d.y,  d.z),
      new Vector3( d.x,  d.y,  d.z),
      new Vector3( d.x,  d.y, -d.z),
      new Vector3(-d.x,  d.y, -d.z),
      new Vector3(-d.x,  d.y,  d.z),
    ].map(v => v.add(position));

    const faces = [
      [vertices[0], vertices[1], vertices[2], vertices[3]],
      [vertices[2], vertices[3], vertices[4], vertices[5]],
      [vertices[4], vertices[5], vertices[6], vertices[7]],
      [vertices[7], vertices[6], vertices[1], vertices[0]],
      [vertices[0], vertices[3], vertices[4], vertices[7]],
      [vertices[1], vertices[2], vertices[5], vertices[6]],
    ];

    return new Shape(vertices, faces);
  }

  /**
   * Creates a line segment.
   *
   * @param {Vector3} start - The start of the line segment.
   * @param {Vector3} end - The end of the line segment.
   * @returns {Shape} The line segment.
   */
  static lineSegment(start, end) {
    const vertices = [start.copy(), end.copy()];
    const faces = [[vertices[0], vertices[1]]];
    return new Shape(vertices, faces);
  }

  /**
   * Creates a plane.
   *
   * @param {Vector3} position - The position.
   * @param {Vector3} angle - The angle.
   * @param {number} width - The width.
   * @param {number} height - The height.
   * @returns {Shape} The plane.
   */
  static plane(position, angle, width, height) {

    const dx = width / 2;
    const dy = height / 2;
    const transformationMatrix = Matrices.transformationMatrix(position, angle);

    const vertices = [
      new Vector3(-dx,  dy, 0.0),
      new Vector3(-dx, -dy, 0.0),
      new Vector3( dx, -dy, 0.0),
      new Vector3( dx,  dy, 0.0),
    ].map(v => transformationMatrix.apply(v));

    const faces = [
      [vertices[0], vertices[1], vertices[2], vertices[3]],
    ];

    return new Shape(vertices, faces);
  }

}
