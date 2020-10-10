import { MESSAGE_FONT, MESSAGE_FONT_SIZE_PX } from './constants.js';
import { World } from './world.js';
import { Matrices } from '../3d/matrices.js';
import { Projection } from '../3d/projection.js';
import { Vector2 } from '../3d/vector.js';

/**
 * Renders the world.
 */
export class Renderer {
 
  /**
   * @param {CanvasRenderingContext2D} context - The canvas rendering context.
   * @param {number} width - The canvas width.
   * @param {number} height - The canvas height.
   * @param {Camera} camera - The camera.
   * @param {Projection} projection - How to project faces on the camera.
   */
  constructor(context, width, height, camera, projection) {
    this.context = context;
    this.width = width;
    this.height = height;
    this.camera = camera;
    this.projection = projection;
  }

  /**
   * Renders the world.
   *
   * @param {World} world - The world.
   */
  render(world) {

    // clear the previous frame
    this.context.clearRect(0, 0, this.width, this.height);

    // adjust the camera to the world
    this.camera.adjustTo(world);

    // view transformation matrix
    const viewTransformationMatrix = Matrices.transformationMatrixInverse(
      this.camera.position, this.camera.angle);

    // for each model
    for (const model of world.allModels) {

      // world transformation matrix
      const worldTransformationMatrix = Matrices.transformationMatrix(model.position, model.angle);

      // multiply transformation matrices
      const transformationMatrix = viewTransformationMatrix.mul(worldTransformationMatrix);

      model.shape.faces.map(
        // transform faces
        face => face.map(vertex => transformationMatrix.apply(vertex))
      ).filter(
        // remove faces in front of the camera
        face => face.every(vertex => vertex.z < 0.0)
      ).map(
        // project faces on the camera
        face => face.map(vertex => this.projection.project(vertex))
      ).map(
        // adjust faces to the screen as paths
        face => face.map(vertex => new Vector2(vertex.x + this.width / 2, -vertex.y + this.height / 2))
      ).forEach(
        // draw paths
        path => this._drawPath(path, model.color)
      );
    }

    // adjust the brightness
    this.context.fillStyle = `rgba(0, 0, 0, ${1.0 - this.camera.brightness})`;
    this.context.fillRect(0, 0, this.width, this.height);

    // draw the message
    const message = world.message;
    if (message !== null) {
      this._drawMessage(message);
    }
  }

  /**
   * Draws the path.
   *
   * @param {[Vector2]} path - The path.
   * @param {[number]} color - The color.
   */
  _drawPath(path, color) {

    this.context.fillStyle = this.context.strokeStyle = 'rgba(' + color.join(', ') + ')';

    this.context.beginPath();

    let first = true;
    for (let point of path) {
      if (first) {
        this.context.moveTo(point.x, point.y);
        first = false;
      } else {
        this.context.lineTo(point.x, point.y);
      }
    }

    this.context.closePath();

    this.context.stroke();
    this.context.fill();
  }

  /**
   * Draws the message.
   *
   * @param {string} message - The message.
   */
  _drawMessage(message) {

    this.context.fillStyle = `rgba(0, 0, 0, 0.5)`;
    this.context.font = `${MESSAGE_FONT_SIZE_PX}px "${MESSAGE_FONT}"`;

    const messageMetrics = this.context.measureText(message);
    this.context.fillText(
      message,
      (this.width - messageMetrics.width) / 2,
      (this.height + MESSAGE_FONT_SIZE_PX) / 2
    );
  }

}
