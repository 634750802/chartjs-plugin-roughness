import {Tooltip} from 'chart.js';

const originalDrawBackground = Tooltip._element.prototype.drawBackground;

Tooltip._element.prototype.drawBackground = function (pt, ctx, ts, op) {
  if (op.preventSkipBackgroundRoughness) {
    originalDrawBackground.apply(this, arguments);
    return;
  }
  ctx.canvas._roughEnabled = false
  originalDrawBackground.apply(this, arguments)
  ctx.canvas._roughEnabled = true
}
