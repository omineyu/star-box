import { Vector3 } from './vector.js';

/**
 * A matrix.
 */
export class Matrix {

  /**
   * @param {[[number]]} data - The matrix elements.
   */
  constructor(data) {
    this.data = data;
  }

  /**
   * The number of rows.
   *
   * @type {number}
   */
  get numRows() {
    return this.data.length;
  }

  /**
   * The number of columns.
   *
   * @type {number}
   */
  get numCols() {
    return this.data[0].length;
  }

  /**
   * Returns the transpose of this matrix.
   *
   * @returns {Matrix} The transpose of this matrix.
   */
  transpose() {

    const data = [];

    for (let i = 0; i < this.numCols; i++) {
      const row = [];
      for (let j = 0; j < this.numRows; j++) {
        row.push(this.data[j][i]);
      }
      data.push(row);
    }

    return new Matrix(data);
  }

  /**
   * Multiplies this matrix by another matrix.
   *
   * @param {Matrix} matrix - Another matrix.
   * @returns {Matrix} The result matrix.
   */
  mul(matrix) {

    const that = matrix;

    if (this.numCols != that.numRows) {
      throw new Error(
        `Cannot multiply ` +
        `${this.numRows} x ${this.numCols} matrix and ` +
        `${that.numRows} x ${that.numCols} matrix`
      );
    }

    const data = [];

    for (let i = 0; i < this.numRows; i++) {
      const row = [];
      for (let j = 0; j < that.numCols; j++) {
        let entry = 0.0;
        for (let k = 0; k < this.numCols; k++) {
          entry += this.data[i][k] * that.data[k][j];
        }
        row.push(entry);
      }
      data.push(row);
    }

    return new Matrix(data);
  }

  /**
   * Multiplies this matrix by the vector.
   *
   * The matrix size is assumed to be 4 x 4 (homogeneous coordinates).
   *
   * @param {Vector3} vector - The vector.
   * @returns {Vector3} The result vector.
   */
  apply(vector) {

    const columnVector = new Matrix([
      [vector.x],
      [vector.y],
      [vector.z],
      [1.0],
    ]);

    const resultColumnVector = this.mul(columnVector);

    // division by w is omitted
    const resultVector = new Vector3(
      resultColumnVector.data[0][0],
      resultColumnVector.data[1][0],
      resultColumnVector.data[2][0]
    );

    return resultVector;
  }

}
