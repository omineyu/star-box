/**
 * A keyboard.
 *
 * Examines whether the specified key is down.
 */
export class Keyboard {

  static SPACE = 'Space';

  static ARROW_LEFT  = 'ArrowLeft';
  static ARROW_UP    = 'ArrowUp';
  static ARROW_RIGHT = 'ArrowRight';
  static ARROW_DOWN  = 'ArrowDown';

  constructor() {

    this._inputKeys = new Map();

    document.addEventListener('keydown', (e) => {
      this._inputKeys.set(e.code, true);
    });

    document.addEventListener('keyup', (e) => {
      this._inputKeys.set(e.code, false);
    });
  }

  /**
   * Examines whether the key is down.
   *
   * @param {string} code - The key code string.
   * @return {boolean} true if the key is down.
   */
  isKeyDown(code) {
    if (!this._inputKeys.has(code)) {
      return false;
    }
    return this._inputKeys.get(code);
  }

}
