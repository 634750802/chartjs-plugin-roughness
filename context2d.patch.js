import {path, Path} from "d3-path";
import {names} from './path-operation-names.js';

if (typeof CanvasRenderingContext2D !== 'undefined') {
  patchContext2D(CanvasRenderingContext2D, typeof Path2D !== 'undefined' ? Path2D : undefined)
}

export function patchContext2D(CanvasRenderingContext2D, Path2D) {
  const {beginPath, fill, stroke} = CanvasRenderingContext2D.prototype

  CanvasRenderingContext2D.prototype.beginPath = function () {
    beginPath.apply(this, arguments)
    if (!this.canvas._roughEnabled) {
      return
    }
    this._path = path();
    this._hasChanges = false;
  }

  function toSvgString(path2d) {
    if (path2d instanceof Path) {
      return path2d.toString()
    } else if (path2d.toSvgString) {
      // @napi-rs/canvas
      return path2d.toSvgString()
    } else {
      throw new Error('Path2D not available for roughness.')
    }
  }

  CanvasRenderingContext2D.prototype.stroke = function (path) {
    if (Path2D && path instanceof Path2D) {
      this._path = path._path ?? path;
    }
    if (
      // if the rough plugin was not enabled, use raw method
      !this.canvas._roughEnabled

      // if no path passed in and nothing was changed, use raw method. See https://github.com/pingcap/ossinsight-lite/issues/102
      || (!path && !this._hasChanges)
    ) {
      stroke.apply(this, arguments)
      return
    }
    try {
      this.canvas._roughEnabled = false;
      this.canvas._rough.path(toSvgString(this._path), {
        fill: 'none',
        stroke: this.strokeStyle,
        strokeWidth: this.lineWidth,
      })
      this.canvas._roughEnabled = true;
    } catch (e) {
      console.error(e);
      stroke.apply(this, arguments)
    } finally {
      this.canvas._roughEnabled = true;
    }
  }

  CanvasRenderingContext2D.prototype.fill = function (path) {
    if (Path2D && path instanceof Path2D) {
      this._path = path._path ?? path;
    }
    if (!this.canvas._roughEnabled || (!path && !this._hasChanges)) {
      fill.apply(this, arguments)
      return
    }
    try {
      this.canvas._roughEnabled = false;
      this.canvas._rough.path(toSvgString(this._path), {
        fill: this.fillStyle,
        stroke: this.strokeStyle === 'rgba(0, 0, 0, 0)' ? 'none' : this.strokeStyle,
        strokeWidth: this.lineWidth,
      })
      this.canvas._roughEnabled = true;
    } catch (e) {
      console.error(e);
      fill.apply(this, arguments)
    } finally {
      this.canvas._roughEnabled = true;
    }
  };

  names.forEach(name => {
    const origin = CanvasRenderingContext2D.prototype[name];
    CanvasRenderingContext2D.prototype[name] = function () {
      origin.apply(this, arguments);
      if (!this.canvas._roughEnabled) {
        return
      }
      this._path[name](...arguments);
      this._hasChanges = true;
    }
  })
}
