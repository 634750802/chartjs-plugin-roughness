import roughjs from 'roughjs';
import { Options } from 'roughjs/bin/core';

declare global {
  interface HTMLCanvasElement {
    _rough: ReturnType<typeof roughjs['canvas']>;
    _roughEnabled: boolean;
  }
}

declare module 'chart.js' {
  interface PluginOptionsByType {
    roughness: {
      disabled?: boolean
    } & Options;
  }
}

