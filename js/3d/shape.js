import { Vector3 } from './vector.js';

/**
 * A 3D Shape consisting of vertices and faces.
 */
export class Shape {

  /**
   * @param {[Vector3]} vertices - The vertices.
   * @param {[[Vector3]]} faces - The faces.
   */
  constructor(vertices, faces) {
    this.vertices = vertices;
    this.faces = faces;
  }

  /**
   * Joins shapes.
   *
   * @param {[Shape]} shapes - The shapes.
   * @returns {Shape} The joined shape.
   */
  static join(shapes) {
    const vertices = shapes.map(s => s.vertices).reduce((prev, curr) => curr.concat(prev));
    const faces = shapes.map(s => s.faces).reduce((prev, curr) => curr.concat(prev));
    return new Shape(vertices, faces);
  }

}
