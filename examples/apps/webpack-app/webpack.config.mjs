import { DotenvRunPlugin } from '@dotenv-run/webpack';
import path from 'path';

const __dirname = path.resolve();

export default {
  plugins: [
    new DotenvRunPlugin(
      { prefix: '^API', verbose: true, root: '../..' },
      __dirname
    )
  ],
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  }
}