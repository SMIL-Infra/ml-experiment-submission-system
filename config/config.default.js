'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1532317838911_4906';

  // add your config here
  config.middleware = [];

  config.multipart = {
    fileSize: '1mb',
  };

  config.view = {
    mapping: {
      '.njk': 'nunjucks',
    },
  };

  return config;
};
