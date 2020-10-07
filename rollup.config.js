import typescript from '@rollup/plugin-typescript';

export default {

  input: 'src/index.ts',

  preserveModules: true,

  treeshake: false,

  output: {
    dir: 'dist',
    format: 'cjs'
  },

  external: [
    'tslib',
    'react',
    'react-dom'
  ],

  plugins: [
    typescript()
  ]
};