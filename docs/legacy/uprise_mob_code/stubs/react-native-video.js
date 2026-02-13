const React = require('react');
const { View } = require('react-native');

const VideoStub = (props) => {
  return React.createElement(View, props);
};

// Add minimal propTypes to prevent crashes when react-native-video-player tries to access them
VideoStub.propTypes = {
  source: {},
  // Add other common video props that might be accessed
  resizeMode: {},
  repeat: {},
  paused: {},
  muted: {},
  volume: {},
  rate: {},
  playInBackground: {},
  playWhenInactive: {},
  ignoreSilentSwitch: {},
  progressUpdateInterval: {},
  onLoad: {},
  onLoadStart: {},
  onProgress: {},
  onEnd: {},
  onError: {},
  onBuffer: {},
  onTimedMetadata: {},
  onSeek: {},
  onPlaybackRateChange: {},
  onExternalPlaybackChange: {},
  onFullscreenPlayerWillPresent: {},
  onFullscreenPlayerDidPresent: {},
  onFullscreenPlayerWillDismiss: {},
  onFullscreenPlayerDidDismiss: {},
};

module.exports = VideoStub;