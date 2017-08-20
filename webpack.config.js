const path = require('path');
const webpack = require('webpack');

const prod = process.argv.indexOf('-p') !== -1;
let pluginArray = [];

if (prod)
  pluginArray.push(new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
  }));

pluginArray.push(new webpack.LoaderOptionsPlugin({
  options: {
    sassLoader: {
      includePaths: [path.resolve(__dirname, "public/assets/"), path.resolve(__dirname, "browser/styles/")]
    },
    postcss: function () {
        return [require('autoprefixer')];
    },
    context: path.join(__dirname, 'public/assets'),
    output: {
      path: path.join(__dirname, 'public/assets')
    }
  }
}
));

pluginArray.push(new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en|fr)$/));


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
//pluginArray.push(new require('string-replace-webpack-plugin')("styles.css"));

module.exports = {
    entry: [path.join(__dirname, "browser/scripts/index_router.jsx")],
    output: {
        path: path.join(__dirname, 'public/assets'),
        //filename: "bundle_[name].js",
        filename: "bundle.js",
        publicPath: '/assets/'
    },
    resolve: {
      alias: {
        '~': path.resolve(__dirname)
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
            { test: /\.js?$/, loader: "babel-loader" },
            { test: /\.jsx?$/, loader: "babel-loader", include: path.resolve(__dirname, "browser/scripts") },
            { test: /(\.css$)/, loaders: ['style', 'css', 'postcss-loader'] },
            { test: /\.useable\.sass$/, loaders: ["style-loader/useable?singleton", "css", "postcss-loader", "sass"] },
            { test: /\.sass$/, exclude: /\.useable\.sass$/, loaders: ["style", "css", "postcss-loader", "sass"] },
            { test: /\.scss$/, loaders: ["style", "css", "postcss-loader", "sass"] },
            { test: /(\.eot|\.woff|\.woff2|\.ttf|fontawesome-webfont\.svg|slick\.svg|\.gif)(\?\S*)?$/, loader: 'file?name=[name].[ext]' },
            //{ test: /\.svg$/, loader: 'svg-inline' },
        ]
    },
    devtool: prod ? '#source-map' : '#inline-source-map',
    plugins: pluginArray
};
