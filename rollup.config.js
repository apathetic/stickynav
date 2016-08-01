import buble from 'rollup-plugin-buble';

export default {
  entry: 'src/stickyNav.js',
  moduleName: 'stickyNav',
  plugins: [
    buble()
  ],
  targets: [
    { dest: 'dist/stickyNav.cjs.js', format: 'cjs' },
    { dest: 'dist/stickyNav.es6.js', format: 'es' },
    { dest: 'dist/stickyNav.js', format: 'iife' }
  ]
};
