/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable global-require */
import React, { Component } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import Config from 'react-native-config';
import RNSplashScreen from 'react-native-splash-screen';
import { Alert } from 'react-native';
import { logger } from 'react-native-flipper';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Avoid importing app modules at top-level to isolate init crashes.

let store, storePersistor;
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navState: null,
      appNavigator: null,
      importsError: null,
    };
  }

  async componentDidMount() {
    // Lazy load heavy modules to pinpoint failing import
    try {
      const [{ default: mgr }, { default: AppNavigatorCmp }] = await Promise.all([
        import('./src/state/store'),
        import('./src/navigators/AppNavigator'),
      ]);
      store = mgr.store; storePersistor = mgr.storePersistor;
      this.setState({ appNavigator: AppNavigatorCmp });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Import failure during startup:', e);
      this.setState({ importsError: e });
      return;
    }

    // Debug Config values with Flipper
    try {
      logger.info('=== CONFIG DEBUG (Flipper) ===');
      logger.info('Full Config object:', Config);
      logger.info('Config.API_BASE_URL:', Config.API_BASE_URL);
      logger.info('Config.BASE_URL:', Config.BASE_URL);
      logger.info('All Config keys:', Object.keys(Config));
      logger.info('============================');
    } catch (e) {
      console.log('Flipper debug failed:', e);
    }

    await AsyncStorage.setItem('playerState', 'pause');
    await AsyncStorage.setItem('onDemandPlayer', 'inactive');
    const checkToken = await AsyncStorage.getItem('fcmToken');
    try {
      // Defer notification setup
      const { requestUserPermission, notificationListener } = await import('./src/utilities/notificationServices');
      if (checkToken === null) { requestUserPermission(); }
      notificationListener();
    } catch (_) { /* noop */ }
    try {
      setTimeout(() => {
        try { RNSplashScreen.hide(); } catch (_) { /* noop */ }
      }, 150);
    } catch (_) { /* noop */ }

    // Guard TrackPlayer to avoid startup crashes during onboarding work
    // Toggle via .env: DISABLE_TRACK_PLAYER=true to fully skip initialization
    const disableTrackPlayer = (Config?.DISABLE_TRACK_PLAYER || '').toString().toLowerCase() === 'true';
    if (!disableTrackPlayer) {
      try {
        // dynamic import to avoid native module resolution at app start when not built
        const TP = (await import('react-native-track-player')).default;
        await TP.setupPlayer({
          minBuffer: 300,
          playBuffer: 20,
          maxBuffer: 300,
          maxCacheFiles: 100,
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('TrackPlayer disabled due to init error:', e?.message || e);
      }
    }

    // Derive community_key from persisted location/genre if available (non-blocking)
    try {
      const [{ reduxHelpers }, { toCommunityKey }, { setCommunityKey }] = await Promise.all([
        import('./src/state/store/reduxHelpers'),
        import('./src/contracts/community'),
        import('./src/state/actions/community/community.actions'),
      ]);
      const state = reduxHelpers.getState && reduxHelpers.getState();
      const loc = state && state.userLocation && state.userLocation.result && state.userLocation.result.data;
      const genres = state && state.userGenres && state.userGenres.result && state.userGenres.result.data;
      const primaryGenreName = Array.isArray(genres) && genres.length > 0 && (genres[0].name || genres[0].title);
      const key = toCommunityKey({ city: loc && (loc.city || loc.cityName), state: loc && (loc.state || loc.stateName), genre: primaryGenreName });
      if (key) reduxHelpers.dispatch(setCommunityKey(key));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('community_key hydrate skipped:', e?.message || e);
    }

    // Revolutionary summon: if user's original local community becomes active, invite them back.
    try {
      const [{ reduxHelpers }, { setCommunityKey, clearRevolutionary }, { default: validateCommunityRequest }] = await Promise.all([
        import('./src/state/store/reduxHelpers'),
        import('./src/state/actions/community/community.actions'),
        import('./src/services/onboarding/validateCommunity.service'),
      ]);
      const state2 = reduxHelpers.getState && reduxHelpers.getState();
      const rev = state2 && state2.community && state2.community.revolutionary;
      const auth = state2 && state2.userAuth && state2.userAuth.accessToken;
      if (rev && rev.active && rev.original && rev.original.city && rev.original.state && rev.original.superGenre) {
        validateCommunityRequest({ city: rev.original.city, state: rev.original.state, superGenre: rev.original.superGenre, accessToken: auth })
          .then(resp => {
            if (resp && resp.active) {
              Alert.alert('Community Activated', `Your ${rev.original.city}, ${rev.original.state} ${rev.original.superGenre} community is now active. Return to your local community?`, [
                { text: 'Not now', style: 'cancel' },
                { text: 'Return', onPress: () => { if (rev.original.community_key) reduxHelpers.dispatch(setCommunityKey(rev.original.community_key)); reduxHelpers.dispatch(clearRevolutionary()); } },
              ]);
            }
          })
          .catch(() => {});
      }
    } catch (_) { /* noop */ }
  }

  render() {
    const { navState, appNavigator: AppNavigatorCmp, importsError } = this.state;
    if (importsError) {
      return (
        <NavigationContainer theme={ DarkTheme }>
          <></>
        </NavigationContainer>
      );
    }
    if (!store || !storePersistor || !AppNavigatorCmp) {
      return (
        <NavigationContainer theme={ DarkTheme }>
          <></>
        </NavigationContainer>
      );
    }
    return (
      <Provider store={ store }>
        <PersistGate loading={ null } persistor={ storePersistor }>
          { /* we used onStateChange to know the state of current nav e.g:
            onStateChange={ state => console.log('New state is', state) } */ }
          <NavigationContainer
            // ref={ navigationRef }
            onStateChange={ state => this.setState({ navState: state }) }
            theme={ DarkTheme }
          >
            <AppNavigatorCmp navState={ navState } />
          </NavigationContainer>
        </PersistGate>
      </Provider>
    );
  }
}
export default App;
