const CracoLessPlugin = require("craco-less");
const path = require("path");
const resolve = (dir) => path.resolve(__dirname, dir);
module.exports = function (env) {
  return {
    webpack: {
      alias: {
        "@": resolve("src"),
        components: resolve("src/components"),
        utils: resolve("src/utils"),
      },
      configure: (webpackConfig, { env, paths }) => {
        return webpackConfig;
      },
    },
    plugins: [
      {
        plugin: CracoLessPlugin,
        options: {
          lessLoaderOptions: { lessOptions: { javascriptEnabled: true } },
        },
      },
    ],
  };
};
