/**
 * @format
 */

import React from 'react';
import {AppRegistry, LogBox, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import CustomToaster from 'react-native-tiny-toast';
// const PushNotification = require('react-native-push-notification');
// import PushNotificationIOS from '@react-native-community/push-notification-ios';

import {API} from './app/api/API';
import APIEvents from './app/api/APIEvents';

import messaging from '@react-native-firebase/messaging';

// import PushNotification, {Importance} from 'react-native-push-notification';

import notifee, {EventType} from '@notifee/react-native';

notifee.onForegroundEvent(({type, detail}) => {
  console.log('first call method');
  switch (type) {
    case EventType.DISMISSED:
      console.log('User dismissed notification', detail.notification);
      break;
    case EventType.PRESS:
      console.log('User pressed notification , ', detail.notification);
      if (Platform.OS !== 'android') {
        APIEvents.call('openTask', detail.notification.data);
      } else {
        setTimeout(() => {
          APIEvents.call('openTask', detail.notification.data);
          // console.log('check navigation');
        }, 2500);
      }

      break;
  }
});

// notifee.onBackgroundEvent(async ({type, detail}) => {
//   console.log('type check :->>>> 1', type, detail);
//   if (type === EventType.PRESS) {
//     console.log('User pressed the notification.', detail.pressAction.id);
//     if (Platform.OS !== 'android') {
//       APIEvents.call('openTask', detail.notification.data);
//     } else {
//       setTimeout(() => {
//         APIEvents.call('openTask', detail.notification.data);
//         console.log('check navigation');
//       }, 2500);
//     }
//     // APIEvents.call('openTask', detail.notification.data);
//   }
//   const {notification, pressAction} = detail;

//   // Check if the user pressed the "Mark as read" action
//   if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
//     // Update external API

//     await fetch(`https://my-api.com/chat/${notification.data.chatId}/read`, {
//       method: 'POST',
//     }).then(result => {
//       result.json().then(resp => {
//         console.log('resp notification :->> ', resp);
//       });
//     });

//     // Remove the notification
//     await notifee.cancelNotification(notification.id);
//   }
// });

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  if (remoteMessage) {
    API.silentNotification(remoteMessage, null);
  }
});

AppRegistry.registerComponent(appName, () => App);
