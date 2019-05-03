const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    app: './src/app/index'
  },
  output: {
    filename: 'mesh.js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: './'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(jpe?g|png|gif|ico|woff|woff2)$/i,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: './src/static',
        to: '',
        toType: 'dir'
      }
    ])
  ],
  target: 'web'
}
