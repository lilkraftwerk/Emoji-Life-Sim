var HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/main.js",
    selector: "./src/selector/selector.js",
  },
  watch: true,
  output: {
    filename: "[name].bundle.js",
    sourceMapFilename: "[name].bundle.js.map",
    path: path.resolve(__dirname, "build"),
  },
  devtool: "source-map",
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
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html",
      filename: "index.html",
      chunks: ["main"],
    }),
    new HtmlWebpackPlugin({
      template: "public/selector.html",
      filename: "selector.html",
      chunks: ["selector"],
    }),
  ],
};
