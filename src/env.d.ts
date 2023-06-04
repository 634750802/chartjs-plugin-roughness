import roughjs from 'roughjs'


declare global {
  interface CanvasRenderingContext2D {
    rough: ReturnType<typeof roughjs['canvas']>
  }
}

export {}
