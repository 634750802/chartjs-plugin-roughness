import {path} from "d3-path";
import {names} from './path-operation-names.js';

if (typeof Path2D !== 'undefined' && typeof window !== 'undefined') {
  patchPath2D(window, Path2D);
}

export function patchPath2D(scope, Path2D) {
  if (Path2D.prototype.toSvgString) {
    // no need to patch
    return;
  }

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

  scope.Path2D = Path2DDelegate;

  names.forEach(name => {
    const pOrigin = Path2D.prototype[name];
    Path2DDelegate.prototype[name] = function () {
      pOrigin.apply(this, arguments)
      this._path[name](...arguments);
    }
  })
}
