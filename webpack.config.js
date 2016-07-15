const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

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
            { test: /(\.less$)/, loaders: ['style', 'css', 'postcss-loader', 'less'] },
            { test: /(\.css$)/, loaders: ['style', 'css', 'postcss-loader'] },
            { test: /\.sass$/, loaders: ["style", "css", "postcss-loader", "sass"] },
            { test: /\.scss$/, loaders: ["style", "css", "postcss-loader", "sass"] },
            { test: /\.(eot|woff|woff2|ttf|svg|png|jpg|mp4|svg)(\?\S*)?$/, loader: 'file?name=[name].[ext]' },
        ]
    },
    postcss: function () {
        return [autoprefixer];
    },
    sassLoader: {
      includePaths: [path.resolve(__dirname, "public/assets/"), path.resolve(__dirname, "browser/styles/")]
    },
    plugins: pluginArray
};
