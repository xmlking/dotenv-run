import dotenvRunPlugin from '@dotenv-run/rollup';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/main.js',
    format: 'cjs'
  },
  plugins: [
    dotenvRunPlugin({ prefix: 'API', verbose: true, root: '../../..' })
  ]
};