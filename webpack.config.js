const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const StringReplacePlugin = require('string-replace-webpack-plugin');

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
pluginArray.push(new webpack.LoaderOptionsPlugin({
  options: {
    sassLoader: {
      includePaths: [path.resolve(__dirname, "public/assets/"), path.resolve(__dirname, "browser/styles/")]
    },
    postcss: function () {
        return [autoprefixer];
    },
    context: path.join(__dirname, 'public/assets'),
    output: {
      path: path.join(__dirname, 'public/assets')
    }
  }
}
));

/*pluginArray.push(new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery",
    "window.jQuery": "jquery",
    Tether: "tether",
    "window.Tether": "tether",
    Tooltip: "exports?Tooltip!bootstrap/js/dist/tooltip",
    Alert: "exports?Alert!bootstrap/js/dist/alert",
    Button: "exports?Button!bootstrap/js/dist/button",
    Carousel: "exports?Carousel!bootstrap/js/dist/carousel",
    Collapse: "exports?Collapse!bootstrap/js/dist/collapse",
    Dropdown: "exports?Dropdown!bootstrap/js/dist/dropdown",
    Modal: "exports?Modal!bootstrap/js/dist/modal",
    Popover: "exports?Popover!bootstrap/js/dist/popover",
    Scrollspy: "exports?Scrollspy!bootstrap/js/dist/scrollspy",
    Tab: "exports?Tab!bootstrap/js/dist/tab",
    Tooltip: "exports?Tooltip!bootstrap/js/dist/tooltip",
    Util: "exports?Util!bootstrap/js/dist/util",
}));*/
//pluginArray.push(new ExtractTextPlugin("styles.css"));

module.exports = {
    entry: //{
        //react: path.join(__dirname, "browser/scripts/index.jsx"),
        //router: path.join(__dirname, "browser/scripts/index_router.jsx")
      [path.join(__dirname, "browser/scripts/index_router.jsx")]
    //}
    ,
    output: {
        path: path.join(__dirname, 'public/assets'),
        //filename: "bundle_[name].js",
        filename: "bundle.js",
        publicPath: '/assets/'
    },
    resolve: {
      alias: {
        '~': path.resolve(__dirname),
        //"react": "preact-compat",
        //"react-dom": "preact-compat"
      }
    },
    resolveLoader: {
      modules: [path.join(__dirname, 'node_modules')],
      enforceExtension: false,
      moduleExtensions: ['-loader'],
      enforceModuleExtension: false
    },
    module: {
        loaders: [
            { test: /\.jsx?$/, loader: "babel-loader", include: path.resolve(__dirname, "browser/scripts") },
            { test: /(\.less$)/, loaders: ['style', 'css', 'postcss-loader', 'less'] },
            { test: /(\.css$)/, loaders: ['style', 'css', 'postcss-loader'] },
            { test: /\.useable\.sass$/, loaders: ["style-loader/useable?singleton", "css", "postcss-loader", "sass"] },
            { test: /\.sass$/, exclude: /\.useable\.sass$/, loaders: ["style", "css", "postcss-loader", "sass"] },
            { test: /\.scss$/, loaders: ["style", "css", "postcss-loader", "sass"] },
            { test: /(\.eot|\.woff|\.woff2|\.ttf|fontawesome-webfont\.svg)(\?\S*)?$/, loader: 'file?name=[name].[ext]' },
            //{ test: /\.svg$/, loader: 'svg-inline' },
        ]
    },
    devtool: '#inline-source-map',
    plugins: pluginArray
};
