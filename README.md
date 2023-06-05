# chartjs-plugin-roughness

```js
import

`chartjs-plugin-roughness`

new Chart(..., {
  ...,
  plugins: {
    roughness: {
      disabled: true // enable by default if imported chartjs-plugin-roughness
      // more rough options
    }
  }
})
```

More options see [rough options](https://github.com/rough-stuff/rough/wiki#options).

### Caution

- This package should be imported before `chart.js`.
- This package [override](./bar.element.patch.js) `BarElement.draw` method if roughness was enabled.
- This package [override](./context2d.patch.js) `beginPath`, `closePath`, `fill`, `stroke`, `moveTo`, `lineTo`, `arcTo`,
  `arc`, `quadraticCurveTo`, `rect`, `ellipse`, `bezierCurveTo` while roughness chart rendering. `ellipse` was **not**
  implemented by `roughjs`, you should provide your own polyfill if you want this feature.
- This package [override](./path2d.patch.js) `window.Path2D` class and should act same as original.
