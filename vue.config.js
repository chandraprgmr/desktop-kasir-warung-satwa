const { defineConfig } = require('@vue/cli-service')
// const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const webpack = require('webpack')

module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      preload: 'public/preload.js',
      outputDir: 'build',
      builderOptions: {
          productName: "Kasir Warung Satwa",
          appId: 'com.warung-satwa.kasir',
          win: {
              "target": [
                  "nsis"
              ],
            icon: 'src/assets/logo.ico'
            // "requestedExecutionLevel": "requireAdministrator"
          },
          "nsis": {
              "installerIcon": "src/assets/logo.ico",
              "uninstallDisplayName": "CPU Monitor",
              "oneClick": false,
              "allowToChangeInstallationDirectory": true
          }
      }
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jquery: 'jquery',
        'window.jQuery': 'jquery',
        jQuery: 'jquery'
      })
    ]
    // plugins: [new NodePolyfillPlugin()],
    // optimization: {
    //   splitChunks: {
    //     chunks: "all",
    //   },
    // },
    // resolve:{
    //   extensions: [".ts", ".js"],
    //   fallback:{
    //     "fs": false,
    //     "path": false,
    //     "child_process": false,
    //   }
    // }
  }
})
