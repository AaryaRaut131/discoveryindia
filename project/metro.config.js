// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});

// Increase the max workers and RAM
config.maxWorkers = 2;
config.transformer.minifierConfig = {
  compress: {
    reduce_funcs: false,
  },
};

// Optimize caching
config.cacheStores = [];
config.resetCache = true;

// Add any file type extensions you're using
config.resolver.sourceExts = [
  'js',
  'jsx',
  'json',
  'ts',
  'tsx',
  'cjs',
  'mjs',
];

module.exports = config;