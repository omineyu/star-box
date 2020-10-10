/**
 * A 2D Vector.
 */
export class Vector2 {

  /**
   * @param {number} x - The x-axis component.
   * @param {number} y - The y-axis component.
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

}

/**
 * A 3D Vector.
 */
export class Vector3 {

  /**
   * @param {number} x - The x-axis component.
   * @param {number} y - The y-axis component.
   * @param {number} z - The z-axis component.
   */
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * Creates a zero vector.
   *
   * @returns {Vector3} The zero vector.
   */
  static zero() {
    return new Vector3(0.0, 0.0, 0.0);
  }

  /**
   * Creates a random vector.
   *
   * @returns {Vector3} The random vector.
   */
  static random() {
    return new Vector3(Math.random(), Math.random(), Math.random());
  }

  /**
   * Creates a copy of this vector.
   *
   * @returns {Vector3} The copy of this vector.
   */
  copy() {
    return new Vector3(this.x, this.y, this.z);
  }
 
  /**
   * Adds this vector and another vector.
   *
   * @param {Vector3} vector - Another vector.
   * @returns {Vector3} The result vector.
   */
  add(vector) {
    const that = vector;
    return new Vector3(
      this.x + that.x,
      this.y + that.y,
      this.z + that.z
    );
  }

  /**
   * Subtracts another vector from this vector.
   *
   * @param {Vector3} vector - Another vector.
   * @returns {Vector3} The result vector.
   */
  sub(vector) {
    const that = vector;
    return new Vector3(
      this.x - that.x,
      this.y - that.y,
      this.z - that.z
    );
  }

  /**
   * Calculates the Hadamard product of this vector and another vector.
   *
   * @param {Vector3} vector - Another vector.
   * @returns {Vector3} The Hadamard product.
   */
  hadamardProduct(vector) {
    const that = vector;
    return new Vector3(
      this.x * that.x,
      this.y * that.y,
      this.z * that.z
    );
  }

  /**
   * Calculates the scalar multiplication of this vector.
   *
   * @param {Vector3} scalar - The scalar.
   * @returns {Vector3} The scalar multiplication.
   */
  scale(scalar) {
    return new Vector3(
      scalar * this.x,
      scalar * this.y,
      scalar * this.z
    );
  }

  /**
   * Returns the inverse of this vector.
   *
   * @returns {Vector3} The inverse of this vector.
   */
  inverse() {
    return this.scale(-1.0);
  }

  /**
   * Calculates the dot product of this vector and another vector.
   *
   * @param {Vector3} vector - Another vector.
   * @returns {number} The dot product.
   */
  dotProduct(vector) {
    const that = vector;
    return this.x * that.x + this.y * that.y + this.z * that.z;
  }

  /**
   * Calculates the squared length of this vector.
   */
  squaredLength() {
    return this.dotProduct(this);
  }

  /**
   * Calculates the length of this vector.
   *
   * CAUTION:
   * This method uses the square root calculation which is known to be heavy.
   * You should use squaredLength() instead of length() if possible.
   *
   * @returns {number} The length of this vector.
   */
  length() {
    return Math.sqrt(this.squaredLength());
  }

  /**
   * Calculates the squared distance of this vector and another vector.
   *
   * @param {Vector3} vector - Another vector.
   * @returns {number} The squared distance.
   */
  squaredDistance(vector) {
    const that = vector;
    return (that.x - this.x) ** 2 + (that.y - this.y) ** 2 + (that.z - this.z) ** 2;
  }

}
