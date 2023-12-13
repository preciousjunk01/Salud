const Dotenv = require('dotenv-webpack')
const path = require('path');

module.exports = {
    plugins: [
        new Dotenv()
    ],
  entry: {
    content: './src/contentScript.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  mode: 'production' // 'production' for production
};
