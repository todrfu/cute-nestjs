import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

/** @type {import('rollup').RollupOptions} */
export default {
  input: 'src/index.ts',
  cache: false,
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
      exports: 'named'
    }
  ],
  plugins: [
    resolve({
      preferBuiltins: true,
      extensions: ['.ts', '.js', '.json']
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
    })
  ],
  external: [
    'reflect-metadata',
    'koa',
    'koa-bodyparser',
    'koa-router'
  ]
};