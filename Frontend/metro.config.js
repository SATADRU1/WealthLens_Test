const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configure Metro to use your specific IP address
config.server = {
  ...config.server,
  host: '192.168.0.237',
};

module.exports = config;
