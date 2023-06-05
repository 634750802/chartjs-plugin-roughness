import { ChartType } from 'chart.js';
import roughjs from 'roughjs';
import { Options } from 'roughjs/bin/core';

declare global {
  interface HTMLCanvasElement {
    _rough: ReturnType<typeof roughjs['canvas']>;
    _roughEnabled: boolean;
  }
}

declare module 'chart.js' {
  interface PluginOptionsByType<TType extends ChartType> {
    roughness: {
      disabled?: boolean
    } & Options;
  }
}

export function patchContext2D (ctx: typeof CanvasRenderingContext2D, Path2DClass?: typeof Path2D);
