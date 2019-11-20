const path = require("path");
const rules = require("./webpack.rules.js");
const plugins = require("./webpack.plugins.js");

module.exports = {
  entry:{
    index:"./main.js"
  },
  output:{
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist'),
    libraryExport:"default",
    library:"Calendar",
    libraryTarget: "commonjs2",
    globalObject: 'this'
  },
  performance: {
    hints: "warning",
    maxEntrypointSize: 5000000, 
    maxAssetSize: 3000000
  },
  mode: "production",
  ...rules,
  plugins
};
