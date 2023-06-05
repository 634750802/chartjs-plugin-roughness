import { patchContext2D } from '../../index.js'
import {Canvas, Path2D} from '@napi-rs/canvas'
import * as Utils from '../utils.js'
import {Chart} from "chart.js/auto";
import fsp from 'fs/promises'

const DATA_COUNT = 7;
const NUMBER_CFG = {count: DATA_COUNT, min: -100, max: 100};

const labels = Utils.months({count: 7});
const data = {
  labels: labels,
  datasets: [
    {
      label: 'Fully Rounded',
      data: Utils.numbers(NUMBER_CFG),
      borderColor: Utils.CHART_COLORS.red,
      backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
      borderWidth: 2,
      borderRadius: Number.MAX_VALUE,
      borderSkipped: false,
    },
    {
      label: 'Small Radius',
      data: Utils.numbers(NUMBER_CFG),
      borderColor: Utils.CHART_COLORS.blue,
      backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
      borderWidth: 2,
      borderRadius: 15,
      borderSkipped: false,
    }
  ]
};

const config = {
  type: 'bar',
  data: data,
  options: {
    animation: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Bar Chart'
      }
    }
  },
};

const canvas = new Canvas(640, 480);
const ctx = canvas.getContext('2d');
patchContext2D(ctx.__proto__.constructor, Path2D);
new Chart(ctx, config);

fsp.writeFile('demo/rs-canvas/image.png', canvas.toBuffer('image/png'))