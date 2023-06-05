import {Filler} from 'chart.js'

const hooks = ['beforeDraw', 'beforeDatasetDraw', 'beforeDatasetsDraw']

hooks.forEach(hook => {
  const original = Filler[hook];
  Filler[hook] = function (chart) {
    if (!chart.canvas._roughEnabled) {
      return original.apply(this, arguments);
    }
    chart.ctx.save();
    chart.ctx.strokeStyle = 'transparent';
    const res = original.apply(this, arguments);
    chart.ctx.restore();
    return res;
  }
})
