// TEMP DISABLE: track-player - Commented out to prevent startup crashes
// import TrackPlayer, { Event, State } from 'react-native-track-player';

let wasPausedByDuck = false;

module.exports = async function setup() {
  // TEMP DISABLE: track-player - Fallback implementation
  console.log('TrackPlayer service temporarily disabled');
  
  // TODO: Re-enable when track-player issues are resolved
  /*
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, async e => {
    TrackPlayer.seekTo(e.position);
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
    TrackPlayer.skipToPrevious();
  });

  TrackPlayer.addEventListener(Event.RemoteDuck, async e => {
    if (e.permanent === true) {
      TrackPlayer.stop();
    } else if (e.paused === true) {
      const playerState = await TrackPlayer.getState();
      wasPausedByDuck = playerState !== State.Paused;
      TrackPlayer.pause();
    } else if (wasPausedByDuck === true) {
      TrackPlayer.play();
      wasPausedByDuck = false;
    }
  });
  */
};
