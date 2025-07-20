/**
 * @format
 */
import 'react-native-reanimated'; // this must be FIRST import

// index.js (or App.js, depending on your project setup)
import { AppRegistry } from 'react-native';
import App from './App'; // Your main App component
import { name as appName } from './app.json';

// Import the core Firebase App module
import firebase from '@react-native-firebase/app'; // <--- ADD THIS LINE

// Initialize Firebase App FIRST
// This checks if a default app instance already exists to prevent errors on hot reloads
if (!firebase.apps.length) { // <--- ADD THIS CHECK
  firebase.initializeApp(); // <--- ADD THIS LINE
}

if (!global.WebSocket && Platform.OS !== 'web') {
  global.WebSocket = ws;
}
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

// Register background handler for Firebase messages
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  // Optional: Display a notification from background
  // This is useful for data-only messages where FCM won't auto-display a notification
  await notifee.displayNotification({
    title: remoteMessage.notification?.title || 'Background Message',
    body: remoteMessage.notification?.body || remoteMessage.data?.message,
    android: {
      channelId: 'background_channel', // You might need a specific channel for background messages
      importance: AndroidImportance.HIGH,
      smallIcon: 'ic_launcher',
    },
  });
});

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }
  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);

