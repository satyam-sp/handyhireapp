// src/components/NotificationListener.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType, AndroidImportance } from '@notifee/react-native';
import { getStorageData, setStorageData } from '../utils/storage-helper';
import { useDispatch } from 'react-redux';
import { sendFcmToken } from '../slices/userAuth.slice';

const NotificationListener: React.FC = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    async function setupNotifications() {
      // 1. Request User Permissions (iOS)
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
          Alert.alert(
            'Notification Permission',
            'Please enable notifications in settings to receive updates.',
          );
        }
      }

      // 2. Get FCM Token
      // Register the device for remote messages (required for iOS to get a token)
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      const user =  await getStorageData('user')
      dispatch(sendFcmToken(token) as any)
      setStorageData('token', token)

      // Save token to your backend if needed for sending targeted notifications
      // saveTokenToYourBackend(token);

      // 3. Create Notification Channel (Android)
      // This is crucial for Android 8.0+
      await notifee.createChannel({
        id: 'foreground',
        name: 'Foreground Notifications',
        importance: AndroidImportance.HIGH,
        sound: 'default',
      });
    //   await notifee.createChannel({
    //     id: 'background_channel', // Channel for background messages
    //     name: 'Background Notifications',
    //     importance: AndroidImportance.HIGH,
    //     sound: 'default',
    //   });

      // 4. Listen for Foreground Messages (when app is open)
      const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
        console.log('Message received in foreground:', remoteMessage);
        // Use Notifee to display the notification as FCM won't auto-display in foreground
        await notifee.displayNotification({
          title: remoteMessage.notification?.title,
          body: remoteMessage.notification?.body,
          android: {
            channelId: 'foreground',
            smallIcon: 'ic_launcher',
            color: '#007BFF',
            pressAction: {
              id: 'default',
            },
          },
          ios: {
            // iOS specific options
          },
        });
      });

      // 5. Handle Notifications when app is in Background/Quit state
      // When app is opened from a quit state by tapping a notification
      const initialNotification = await messaging().getInitialNotification();
      if (initialNotification) {
        console.log(
          'Notification caused app to open from quit state:',
          initialNotification,
        );
        Alert.alert(
          'App Opened (Quit State)',
          `Title: ${initialNotification.notification?.title}\nBody: ${initialNotification.notification?.body}`,
        );
        // You can navigate to a specific screen here based on initialNotification.data
      }

      // When app is opened from background state by tapping a notification
      const unsubscribeOnNotificationOpenedApp = messaging().onNotificationOpenedApp(
        remoteMessage => {
          console.log(
            'Notification caused app to open from background state:',
            remoteMessage,
          );
          Alert.alert(
            'App Opened (Background State)',
            `Title: ${remoteMessage.notification?.title}\nBody: ${remoteMessage.notification?.body}`,
          );
          // You can navigate to a specific screen here based on remoteMessage.data
        },
      );

      // 6. Notifee Event Listeners (for user interaction with displayed notifications)
      const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
        switch (type) {
          case EventType.DISMISSED:
            console.log('User dismissed notification:', detail.notification);
            break;
          case EventType.PRESS:
            console.log('User pressed notification:', detail.notification);
            Alert.alert(
              'Notification Pressed!',
              `ID: ${detail.notification?.id}\nTitle: ${detail.notification?.title}\nAction: ${detail.pressAction?.id}`,
            );
            // You can navigate or perform actions based on detail.notification and detail.pressAction
            break;
          // Add other event types like ACTION_PRESS if you have actions
        }
      });

      return () => {
        unsubscribeOnMessage();
        unsubscribeOnNotificationOpenedApp();
        unsubscribeNotifee();
      };
    }

    setupNotifications();
  }, []);

  return (
    <>
      
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    marginTop: 15,
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
  },
});

export default NotificationListener;