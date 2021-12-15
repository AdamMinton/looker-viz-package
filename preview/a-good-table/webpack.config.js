var path = require("path");

var webpackConfig = {
  mode: "production",
  entry: {
    a_good_table: "./src/main.js",
  },
  resolve: { alias: { markjs: "datatables.mark.js/dist/datatables.mark.js" } },
  output: {
    filename: "[name].js",
    path: __dirname,
    library: "[name]",
    libraryTarget: "umd",
  },
  stats: {},
};

module.exports = webpackConfig;
