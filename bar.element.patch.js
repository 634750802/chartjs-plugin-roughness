import {BarElement} from "chart.js";
import {_limitValue, addRoundedRectPath, isObject, toTRBL, toTRBLCorners} from "chart.js/helpers";

const originalDraw = BarElement.prototype.draw;

/**
 * Original draw method uses clip to draw borders, overriding with stroke instead.
 */
BarElement.prototype.draw = function (ctx, area) {
  if (!ctx.canvas._roughEnabled) {
    originalDraw.apply(this, arguments);
    return;
  }
  const {inflateAmount, options: {borderColor, backgroundColor}} = this;
  const {inner, outer, border} = boundingRects(this);
  const addRectPath = hasRadius(outer.radius) ? addRoundedRectPath : addNormalRectPath;
  ctx.save();
  ctx.beginPath();
  addRectPath(ctx, inflateRect(inner, inflateAmount));
  ctx.fillStyle = backgroundColor;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = border;
  ctx.fill();
  ctx.restore();
}

function addNormalRectPath(ctx, rect) {
  ctx.rect(rect.x, rect.y, rect.w, rect.h);
}

function hasRadius(radius) {
  return radius.topLeft || radius.topRight || radius.bottomLeft || radius.bottomRight;
}

function boundingRects(bar) {
  const bounds = getBarBounds(bar);
  const width = bounds.right - bounds.left;
  const height = bounds.bottom - bounds.top;
  const border = parseBorderWidth(bar, width / 2, height / 2);
  const radius = parseBorderRadius(bar, width / 2, height / 2);
  return {
    outer: {
      x: bounds.left,
      y: bounds.top,
      w: width,
      h: height,
      radius
    },
    inner: {
      x: bounds.left + border,
      y: bounds.top + border,
      w: width - 2 * border,
      h: height - 2 * border,
      radius: {
        topLeft: Math.max(0, radius.topLeft - border),
        topRight: Math.max(0, radius.topRight - border),
        bottomLeft: Math.max(0, radius.bottomLeft - border),
        bottomRight: Math.max(0, radius.bottomRight - border)
      }
    },
    border,
  };
}

function parseBorderWidth(bar, maxW, maxH) {
  const value = bar.options.borderWidth;
  const o = toTRBL(value);
  const skip = bar.borderSkipped;
  if (o.left !== o.top || o.top !== o.bottom || o.left !== o.bottom) {
    warn('Bar border width need to be same in roughness mode. Left border will take affect.')
  }
  return _limitValue(o.left, 0, Math.min(maxW, maxH));
}

function parseBorderRadius(bar, maxW, maxH) {
  const {enableBorderRadius} = bar.getProps([
    'enableBorderRadius'
  ]);
  const value = bar.options.borderRadius;
  const o = toTRBLCorners(value);
  const maxR = Math.min(maxW, maxH);
  const skip = bar.borderSkipped;
  const enableBorder = enableBorderRadius || isObject(value);
  return {
    topLeft: skipOrLimit(!enableBorder || skip.top || skip.left, o.topLeft, 0, maxR),
    topRight: skipOrLimit(!enableBorder || skip.top || skip.right, o.topRight, 0, maxR),
    bottomLeft: skipOrLimit(!enableBorder || skip.bottom || skip.left, o.bottomLeft, 0, maxR),
    bottomRight: skipOrLimit(!enableBorder || skip.bottom || skip.right, o.bottomRight, 0, maxR)
  };
}

function skipOrLimit(skip, value, min, max) {
  return skip ? 0 : _limitValue(value, min, max);
}

function getBarBounds(bar, useFinalPosition) {
  const {x, y, base, width, height} = bar.getProps([
    'x',
    'y',
    'base',
    'width',
    'height'
  ], useFinalPosition);
  let left, right, top, bottom, half;
  if (bar.horizontal) {
    half = height / 2;
    left = Math.min(x, base);
    right = Math.max(x, base);
    top = y - half;
    bottom = y + half;
  } else {
    half = width / 2;
    left = x - half;
    right = x + half;
    top = Math.min(y, base);
    bottom = Math.max(y, base);
  }
  return {
    left,
    top,
    right,
    bottom
  };
}

function inflateRect(rect, amount, refRect = {}) {
  const x = rect.x !== refRect.x ? -amount : 0;
  const y = rect.y !== refRect.y ? -amount : 0;
  const w = (rect.x + rect.w !== refRect.x + refRect.w ? amount : 0) - x;
  const h = (rect.y + rect.h !== refRect.y + refRect.h ? amount : 0) - y;
  return {
    x: rect.x + x,
    y: rect.y + y,
    w: rect.w + w,
    h: rect.h + h,
    radius: rect.radius
  };
}

let warningLogged = {};

function warn(msg) {
  if (warningLogged[msg]) {
    return;
  }
  console.warn(msg);
  warningLogged[msg] = true;
}
