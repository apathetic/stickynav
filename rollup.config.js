import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve';

export default {
  // entry: 'src/stickynav.js',
  entry: 'src/index.js',
  moduleName: 'window',       // for the iife bundle. Hack: put the exports direclty on the winow for usability
  plugins: [
    resolve({                 // this allows us to pull in other modules as ES6 bundles (ie. scrollify stuffs)
      jsnext: true,
      main: true,
      browser: false
    }),
    buble()
  ],
  targets: [
    { dest: 'dist/stickynav.cjs.js', format: 'cjs' },
    { dest: 'dist/stickynav.es6.js', format: 'es' },
    { dest: 'dist/stickynav.js', format: 'iife' }
  ]
};
