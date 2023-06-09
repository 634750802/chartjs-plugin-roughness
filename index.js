import roughjs from 'roughjs'
import {registry, defaults} from 'chart.js'
import './bar.element.patch.js'
import './context2d.patch.js'
import './path2d.patch.js'
import './filler.patch.js'
import './tooltip.patch.js'

registry.add({
  id: 'roughness',
  install(chart, args, {disabled, ...options}) {
    if (disabled) {
      return;
    }
    chart.canvas._rough = roughjs.canvas(chart.canvas, {options});
    chart.canvas._roughEnabled = true;
  },
  defaults: {
    disabled: false,
    strokeWidth: 0,
    stroke: 'none',
  }
})

export { patchContext2D } from './context2d.patch.js';
