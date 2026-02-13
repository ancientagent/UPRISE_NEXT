/**
 * @format
 */

import React, { useEffect, useState } from 'react';
import { AppRegistry, LogBox, Text, View } from 'react-native';
// TEMP DISABLE: track-player - Commented out to prevent startup crashes
// import TrackPlayer from 'react-native-track-player';
import Config from 'react-native-config';
import { name as appName } from './app.json';

// Firebase Messaging (optional): guard via env to avoid early init crashes
(() => {
  const disableFM = ((Config?.DISABLE_FIREBASE_MESSAGING) || '').toString().toLowerCase() === 'true';
  if (disableFM) return;
  try {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    const messaging = require('@react-native-firebase/messaging').default;
    try {
      messaging().setBackgroundMessageHandler(async remoteMessage => {
        // eslint-disable-next-line no-console
        console.log('Message handled in the background!', remoteMessage);
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('Firebase messaging disabled (no default app):', e?.message || e);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('Firebase messaging module not available; continuing without it');
  }
})();

// Reduce noise in development
LogBox.ignoreLogs([
  '`new NativeEventEmitter()` was called with a non-null argument without the required `addListener`',
  '`new NativeEventEmitter()` was called with a non-null argument without the required `removeListeners`',
  'Require cycle:',
]);
// Robust registration: register first, then lazy-load App to avoid sync import crashes
function Root() {
  const [Comp, setComp] = useState(null);
  const [err, setErr] = useState(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const mod = await import('./App');
        if (mounted) setComp(() => mod.default);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Startup error:', e);
        if (mounted) setErr(e);
      }
    })();
    return () => { mounted = false; };
  }, []);
  if (err) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' }}>
        <Text style={{ color: '#fff', padding: 16 }}>
          {`Startup error: ${err?.message || String(err)}`}
        </Text>
      </View>
    );
  }
  if (!Comp) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' }}>
        <Text style={{ color: '#999' }}>Loading…</Text>
      </View>
    );
  }
  return <Comp />;
}

AppRegistry.registerComponent(appName, () => Root);
// TEMP DISABLE: track-player - Commented out to prevent startup crashes
// eslint-disable-next-line global-require
// TrackPlayer.registerPlaybackService(() => require('./service'));
