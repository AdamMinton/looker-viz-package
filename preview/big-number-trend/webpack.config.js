var path = require("path");

var webpackConfig = {
  mode: "production",
  entry: {
    big_number_trend: "./src/main.js",
  },
  output: {
    filename: "[name].js",
    path: __dirname,
    library: "[name]",
    libraryTarget: "umd",
  },
  stats: {},
};

module.exports = webpackConfig;
