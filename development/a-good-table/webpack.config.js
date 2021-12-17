const path = require("path");
const { merge } = require("webpack-merge");
const commonConfig = require("../config/webpack.common");

module.exports = (env) => {
  const visSpecific = {
    entry: {
      [env.visualization]: path.join(__dirname, "src", "main.js"),
    },
    output: {
      filename: "[name].js",
      library: "[name]",
      path: path.join(__dirname, "dist"),
    },
    resolve: {
      alias: { markjs: "datatables.mark.js/dist/datatables.mark.js" },
    },
    devServer: {
      port: 8080,
    },
  };
  const config = require("../config/webpack." + env.environment);
  return merge(commonConfig, visSpecific, config);
};
