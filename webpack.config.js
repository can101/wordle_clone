var path = require("path");
var webpack = require("webpack");
module.exports = {
  entry: ["@babel/polyfill", "./index.js"],
  output: {
    path: path.resolve(__dirname, "index"),
    filename: "bundle.js",
  },
  mode: "development",

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
