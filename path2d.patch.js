import {path} from "d3-path";
import {names} from './path-operation-names.js';

if (typeof Path2D !== 'undefined') {

  /**
   * Use d3-path to mock a svg path string builder.
   */
  class Path2DDelegate extends Path2D {
    _path

    constructor(p) {
      super(p);
      this._path = path()
    }
  }

  window.Path2D = Path2DDelegate;

  names.forEach(name => {
    const pOrigin = Path2D.prototype[name];
    Path2DDelegate.prototype[name] = function () {
      pOrigin.apply(this, arguments)
      this._path[name](...arguments);
    }
  })
}
