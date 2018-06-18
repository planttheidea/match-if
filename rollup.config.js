import babel from 'rollup-plugin-babel';
import {uglify} from 'rollup-plugin-uglify';

export default [
  {
    input: 'src/index.js',
    output: {
      exports: 'named',
      name: 'match',
      file: 'dist/match-if.js',
      format: 'umd',
      sourcemap: true
    },
    plugins: [babel({exclude: 'node_modules/**'})]
  },
  {
    input: 'src/index.js',
    output: {
      exports: 'named',
      name: 'match',
      file: 'dist/match-if.min.js',
      format: 'umd'
    },
    plugins: [babel({exclude: 'node_modules/**'}), uglify()]
  }
];
