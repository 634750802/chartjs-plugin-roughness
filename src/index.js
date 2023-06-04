import roughjs from 'roughjs'
import {path} from 'd3-path'
import * as Chartjs from 'chart.js'

Chartjs.registry.add({
  id: 'rough',

})

const {
  getContext
} = HTMLCanvasElement.prototype

const {beginPath, fill, stroke,} = CanvasRenderingContext2D.prototype

let escape = false;

HTMLCanvasElement.prototype.getContext = function (type) {
  const ctx = getContext.apply(this, arguments)
  this._enabled = true;
  if (!escape && this._enabled) {
    if (type === '2d') {
      escape = true;
      ctx.rough = roughjs.canvas(this);
      escape = false;
    }
  }

  return ctx;
}

CanvasRenderingContext2D.prototype.beginPath = function () {
  beginPath.apply(this, arguments)
  if (!this.canvas._enabled) {
    return
  }
  this._path = path();
}

CanvasRenderingContext2D.prototype.stroke = function (path) {
  if (path instanceof Path2D) {
    this._path = path._path
  }
  if (!this.canvas._enabled) {
    stroke.apply(this, arguments)
    return
  }
  this.canvas._enabled = false;
  this.rough.path(this._path.toString(), {
    fill: 'none',
    stroke: this.strokeStyle,
    strokeWidth: this.lineWidth,
  })
  this.canvas._enabled = true;
}

CanvasRenderingContext2D.prototype.fill = function (path) {
  if (path instanceof Path2D) {
    this._path = path._path
  }
  if (!this.canvas._enabled) {
    fill.apply(this, arguments)
    return
  }
  this.canvas._enabled = false;
  this.rough.path(this._path.toString(), {
    fill: this.fillStyle,
    stroke: this.strokeStyle === '#000000' ? '#00000060' : this.strokeStyle,
    strokeWidth: this.lineWidth,
  })
  this.canvas._enabled = true;
};

const OriginalPath2D = Path2D;

class Path2DDelegate extends Path2D {
  _path

  constructor(p) {
    super(p);
    this._path = path()
  }
}

window.Path2D = Path2DDelegate;

['closePath', 'moveTo', 'lineTo', 'arcTo', 'arc', 'quadraticCurveTo', 'rect', 'ellipse', 'bezierCurveTo'].forEach(name => {
  const origin = CanvasRenderingContext2D.prototype[name];
  CanvasRenderingContext2D.prototype[name] = function () {
    origin.apply(this, arguments);
    if (!this.canvas._enabled) {
      return
    }
    this._path[name](...arguments);
  }

  const pOrigin = Path2D.prototype[name];
  Path2DDelegate.prototype[name] = function () {
    pOrigin.apply(this, arguments)
    this._path[name](...arguments);
  }
})
