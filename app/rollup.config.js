import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
import copy from 'rollup-plugin-copy';
import scss from 'rollup-plugin-scss';
import livereload from 'rollup-plugin-livereload';


export default {
	input: 'src/js/index.js',
	output: {
		file: 'dist/scripts/bundle.js',
		format: 'iife',
		name: 'bundle',
	},
	plugins: [
		babel({
			exclude: 'node_modules/**'
		}),
		resolve({
			main: true,
			browser: true
		}),
		json(),
		commonjs(),
		terser(),
		copy({
			targets: [
				{
					src: 'src/*.html', dest: 'dist'
				},
				{
					src: 'src/images/*', dest: 'dist/images'
				}
			]
		}),
		serve({
			open: true,
			contentBase: 'dist',
			host: 'localhost',
			port: 5000
		}),
		scss(),
		livereload(),
	]
}
