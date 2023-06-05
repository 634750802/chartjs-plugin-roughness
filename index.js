import roughjs from 'roughjs'
import {registry} from 'chart.js'
import './bar.element.patch.js'
import './context2d.patch.js'
import './path2d.patch.js'

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
  }
})
