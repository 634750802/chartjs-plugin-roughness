import {path} from "d3-path";
import {names} from './path-operation-names.js';

const {beginPath, fill, stroke} = CanvasRenderingContext2D.prototype

CanvasRenderingContext2D.prototype.beginPath = function () {
  beginPath.apply(this, arguments)
  if (!this.canvas._roughEnabled) {
    return
  }
  this._path = path();
}

CanvasRenderingContext2D.prototype.stroke = function (path) {
  if (path instanceof Path2D) {
    this._path = path._path
  }
  if (!this.canvas._roughEnabled) {
    stroke.apply(this, arguments)
    return
  }
  this.canvas._roughEnabled = false;
  this.canvas._rough.path(this._path.toString(), {
    fill: 'none',
    stroke: this.strokeStyle,
    strokeWidth: this.lineWidth,
  })
  this.canvas._roughEnabled = true;
}

CanvasRenderingContext2D.prototype.fill = function (path) {
  if (path instanceof Path2D) {
    this._path = path._path
  }
  if (!this.canvas._roughEnabled) {
    fill.apply(this, arguments)
    return
  }
  this.canvas._roughEnabled = false;
  this.canvas._rough.path(this._path.toString(), {
    fill: this.fillStyle,
    stroke: this.strokeStyle,
    strokeWidth: this.lineWidth,
  })
  this.canvas._roughEnabled = true;
};

names.forEach(name => {
  const origin = CanvasRenderingContext2D.prototype[name];
  CanvasRenderingContext2D.prototype[name] = function () {
    origin.apply(this, arguments);
    if (!this.canvas._roughEnabled) {
      return
    }
    this._path[name](...arguments);
  }
})
