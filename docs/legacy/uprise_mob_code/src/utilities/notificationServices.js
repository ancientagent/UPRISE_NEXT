// Guard Firebase Messaging usage in dev where default app may not be configured
let _messagingModule = null;
try {
  // eslint-disable-next-line global-require,import/no-extraneous-dependencies
  const app = require('@react-native-firebase/app').default;
  // If default app is not available, this throws; we catch and disable messaging
  app().name; // touch to trigger if missing
  // eslint-disable-next-line global-require
  _messagingModule = require('@react-native-firebase/messaging').default;
} catch (e) {
  _messagingModule = null;
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import showAlert from '../state/sagas/AlertUtility';

const hasMessaging = () => !!_messagingModule;

export async function requestUserPermission() {
  if (!hasMessaging()) {
    // eslint-disable-next-line no-console
    console.log('FCM disabled (no default Firebase app)');
    return;
  }
  try {
    await _messagingModule().requestPermission();
    await getFcmToken();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('FCM permission error (ignored in dev):', e?.message || e);
  }
  // const authStatus = await messaging().requestPermission();
  // const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED
  //   || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  // if (enabled) {
  //   console.log('Authorization status:', authStatus);
  //   getFcmToken();
  // }
}

const getFcmToken = async () => {
  if (!hasMessaging()) return;
  const checkToken = await AsyncStorage.getItem('fcmToken');
  console.log('the old token', checkToken);
  if (!checkToken) {
    try {
      const fcmToken = await _messagingModule().getToken();
      if (fcmToken) {
        console.log('the new genrated token', fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    } catch (error) {
      console.log(error, 'error rasied in fcmToken');
      showAlert(error.message);
    }
  }
};

export const notificationListener = async () => {
  if (!hasMessaging()) return;
  _messagingModule().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });
  _messagingModule().onMessage(async remoteMessage => {
    console.log('recived in foreground', remoteMessage);
  });
  _messagingModule()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });
};
