// jshint node:true, esnext:true

const path = require("path");

module.exports = {  
  entry: {
    "external-renderer": "./apps/external-renderer/ui/Ui.tsx"
  },

  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].js",
    libraryTarget: "amd"
  },

  externals: [
    /^esri\/.*/,
    /^app\/.*/
  ],

  resolve: {
    extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
  },

  module: {
    loaders: [{
      test: /\.(ts|tsx)$/,
      loader: "ts"
    }, {
      test: /\.json$/,
      loader: "json"
    }, {
      test: /\.scss$/,
      loader: "style!css!sass"
    }, {
      test: /\.png$/,
      loader: "file-loader"
    }]
  }
};
