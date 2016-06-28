const path = require('path');
const webpack = require('webpack');

let minimize = process.argv.indexOf('--minimize') !== -1;
let pluginArray = [];
if (minimize)
  pluginArray.push(new webpack.optimize.UglifyJsPlugin({
    mangle: {
      except: ['exports', 'require', '$', 'jQuery']
    },
    compress: {
      warnings: false,
      passes: 3
    },
    screwIE8: true
  }));
//pluginArray.push(new ExtractTextPlugin("styles.css"));

module.exports = {
    entry: [ path.join(__dirname, "browser/scripts/index.jsx") ],
    output: {
        path: path.join(__dirname, 'public/assets'),
        filename: "bundle.js",
        publicPath: '/assets/'
    },
    resolve: {
      alias: {'~': path.resolve(__dirname)}
    },
    module: {
        loaders: [
            { test: /\.jsx?$/, loader: "babel-loader", include: path.resolve(__dirname, "browser/scripts") },
            { test: /(\.less$)/, loaders: ['style', 'css', 'less'] },
            { test: /(\.css$)/, loaders: ['style', 'css'] },
            { test: /\.sass$/, loaders: ["style", "css", "sass"] },
            { test: /\.scss$/, loaders: ["style", "css", "sass"] },
            { test: /\.(eot|woff|woff2|ttf|svg|png|jpg|mp4)(\?\S*)?$/, loader: 'file?name=[name].[ext]' },
        ]
    },
    sassLoader: {
      includePaths: [path.resolve(__dirname, "public/assets/"), path.resolve(__dirname, "browser/styles/")]
    },
    plugins: pluginArray
};
