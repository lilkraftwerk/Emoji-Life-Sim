const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "./build/"),
    filename: "bundle.js",
  },
  optimization: {
    splitChunks: false,
    concatenateModules: true,
    moduleIds: "named",
    chunkIds: "named",
  },
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
  }
};
