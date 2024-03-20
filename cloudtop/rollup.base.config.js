import path from 'path'
import esbuild from 'rollup-plugin-esbuild'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import size from 'rollup-plugin-sizes'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import terser from '@rollup/plugin-terser'

const dirname = path.resolve(process.cwd())
const name = path.basename(dirname)

/**
 * 下划线转大驼峰
 * @param {String} name
 * @returns String
 */
const transformName = (name) =>
  name
    .split('_')
    .reduce(
      (r, i) => ((r += i.replace(/^[0-9a-zA-Z]/, i[0].toUpperCase())), r),
      ''
    )

const common = {
  input: `${dirname}/src/index.ts`,
  output: {
    name: transformName(name)
  },
  plugins: [
    esbuild({
      // All options are optional
      include: /\.[jt]sx?$/, // default, inferred from `loaders` option
      exclude: /node_modules/, // default
      sourceMap: true, // default
      minify: process.env.NODE_ENV === 'production',
      target: 'es2015', // default, or 'es20XX', 'esnext'
      jsx: 'transform', // default, or 'preserve'
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
      // Like @rollup/plugin-replace
      define: {
        __VERSION__: '"x.y.z"',
      },
      tsconfig: 'tsconfig.json', // default
      // Add extra loaders
      loaders: {
        // Add .json files support
        // require @rollup/plugin-commonjs
        '.json': 'json',
        // Enable JSX in .js files too
        '.js': 'jsx',
      },
    }),
    resolve({
      preferBuiltins: true,
    }),
    commonjs(),
    nodePolyfills(), // 解决第三方依赖引入问题
    json(),
    size(), // 打印文件明细
  ],
}

export const umdConfig = {
  ...common,
  output: {
    ...common.output,
    file: `${dirname}/dist/${name}.umd.js`,
    format: 'umd',
  },
}

export const esmConfig = {
  ...common,
  output: {
    ...common.output,
    dir: `${dirname}/lib`,
    format: 'esm',
  },
  plugins: [terser()],
}

export const iifeConfig = {
  ...common,
  output: {
    ...common.output,
    file: `${dirname}/dist/${name}.iife.js`,
    format: 'iife',
  },
  context: 'window',
  plugins: [...common.plugins, terser()],
}
