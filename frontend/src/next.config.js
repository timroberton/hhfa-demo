const withTM = require("next-transpile-modules")(["components-ui"]);

module.exports = withTM({

  target: 'serverless',

  webpack: function (config) {

    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });

    return config;

  },

});
