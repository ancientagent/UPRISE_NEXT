// Stub for react-native-track-player
// This is a placeholder to prevent build failures when the module is not available

const TrackPlayer = {
  // Basic methods that might be called
  setupPlayer: () => Promise.resolve(),
  add: () => Promise.resolve(),
  play: () => Promise.resolve(),
  pause: () => Promise.resolve(),
  stop: () => Promise.resolve(),
  skipToNext: () => Promise.resolve(),
  skipToPrevious: () => Promise.resolve(),
  seekTo: () => Promise.resolve(),
  setVolume: () => Promise.resolve(),
  getVolume: () => Promise.resolve(1.0),
  getDuration: () => Promise.resolve(0),
  getPosition: () => Promise.resolve(0),
  getState: () => Promise.resolve('STOPPED'),
  getCurrentTrack: () => Promise.resolve(null),
  getQueue: () => Promise.resolve([]),
  remove: () => Promise.resolve(),
  clear: () => Promise.resolve(),
  updateOptions: () => Promise.resolve(),
  registerPlaybackService: () => {},
  // Event constants
  STATE_NONE: 'STATE_NONE',
  STATE_PLAYING: 'STATE_PLAYING',
  STATE_PAUSED: 'STATE_PAUSED',
  STATE_STOPPED: 'STATE_STOPPED',
  STATE_BUFFERING: 'STATE_BUFFERING',
  STATE_READY: 'STATE_READY',
  STATE_CONNECTING: 'STATE_CONNECTING',
  // Capability constants
  CAPABILITY_PLAY: 'CAPABILITY_PLAY',
  CAPABILITY_PAUSE: 'CAPABILITY_PAUSE',
  CAPABILITY_STOP: 'CAPABILITY_STOP',
  CAPABILITY_SKIP_TO_NEXT: 'CAPABILITY_SKIP_TO_NEXT',
  CAPABILITY_SKIP_TO_PREVIOUS: 'CAPABILITY_SKIP_TO_PREVIOUS',
  CAPABILITY_SEEK_TO: 'CAPABILITY_SEEK_TO',
  CAPABILITY_SET_RATING: 'CAPABILITY_SET_RATING',
  CAPABILITY_PLAY_FROM_ID: 'CAPABILITY_PLAY_FROM_ID',
  CAPABILITY_PLAY_FROM_SEARCH: 'CAPABILITY_PLAY_FROM_SEARCH',
  // Rating types
  RATING_HEART: 'RATING_HEART',
  RATING_THUMBS_UP_DOWN: 'RATING_THUMBS_UP_DOWN',
  RATING_3_STARS: 'RATING_3_STARS',
  RATING_4_STARS: 'RATING_4_STARS',
  RATING_5_STARS: 'RATING_5_STARS',
  RATING_PERCENTAGE: 'RATING_PERCENTAGE',
  // Repeat modes
  REPEAT_OFF: 'REPEAT_OFF',
  REPEAT_TRACK: 'REPEAT_TRACK',
  REPEAT_QUEUE: 'REPEAT_QUEUE',
};

export default TrackPlayer;
