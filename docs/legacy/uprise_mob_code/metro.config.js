const { getDefaultConfig } = require('metro-config');
const path = require('path');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();
  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg', 'ts',
        'tsx',
        'js'],
      extraNodeModules: {
        'react-native-video': path.resolve(__dirname, 'stubs/react-native-video.js'),
        'react-native-track-player': path.resolve(__dirname, 'stubs/react-native-track-player'),
      },
      // Standard module resolution
      resolverMainFields: ['react-native', 'browser', 'main'],
      platforms: ['native', 'android', 'ios'],
    },
  };
})();

// NOTE: alias react-native-video to stub for CI
// Add under resolver.extraNodeModules: {'react-native-video': path.resolve(__dirname, 'stubs/react-native-video.js')}

