const PushNotification = require('react-native-push-notification');

// import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import CustomToaster from 'react-native-tiny-toast';

import AsyncStorage from '@react-native-async-storage/async-storage';
import APIEvents from '../api/APIEvents';

import notifee, {
  AndroidCategory,
  AndroidImportance,
  AuthorizationStatus,
  cancelDisplayedNotification,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';

export const IS_ANDROID = Platform.OS === 'android';

let notificationsList = null;

module.exports = {
  unscheduleTimer: ({formId, formName, minutes, tracerid, message}) => {
    const uniqueId = formId + ':' + tracerid;

    if (typeof notificationsList[uniqueId] != 'undefined') {
      module.exports.cancelTimer(uniqueId);

      CustomToaster.show(`Timer stopped`, {
        duration: CustomToaster.duration.SHORT,
        position: CustomToaster.position.CENTER,
        containerStyle: {
          backgroundColor: 'rgba(255,179,202,1)',
          width: '95%',
          height: 80,
          borderLeftWidth: 5,
          borderLeftColor: '#ff407b',
        },
        textStyle: {
          color: '#000',
          position: 'absolute',
          left: 90,
          fontSize: 25,
        },
        imgSource: require('./logo.png'),
        imgStyle: {width: 65, height: 65, position: 'absolute', left: 10},
        mask: true,
        maskStyle: {},
      });
    }
  },

  scheduleTimer: async ({formId, formName, minutes, tracerid, message}) => {
    const uniqueId = formId + ':' + tracerid;

    if (typeof notificationsList[uniqueId] != 'undefined') {
      module.exports.cancelTimer(uniqueId);
    }

    const fireDate = new Date();
    fireDate.setMinutes(fireDate.getMinutes() + minutes);

    let convertSecond = minutes * 60;
    let soundDefault;

    if (IS_ANDROID) {
      soundDefault = 'my_sound';
    } else {
      soundDefault = 'my_sound.wav';
    }

    const channelId = await notifee.createChannel({
      id: 'default2',
      name: 'Default Channel2',
      sound: 'my_sound',
      importance: AndroidImportance.HIGH,
    });

    // Create a time-based trigger
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: Date.now() + 1000 * convertSecond,
    };

    // Create a trigger notification
    await notifee.createTriggerNotification(
      {
        title: (formName || '') + ' - Dued',
        body: message || 'Time is out for your form!',
        data: {action: 'openform', formId: formId + '', tracerid, message},
        vibrate: true,
        android: {
          channelId,
          category: AndroidCategory.CALL,
          // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
          // pressAction is needed if you want the notification to open the app when pressed
          pressAction: {
            id: 'default',
          },

          foreground: true,
          foregroundPresentationOptions: {
            badge: true,
            sound: true,
            banner: true,
            list: true,
          },
        },
        ios: {
          channelId,
          // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
          // pressAction is needed if you want the notification to open the app when pressed
          pressAction: {
            id: formId + '',
          },
          sound: 'my_sound.wav',

          foreground: true,
          foregroundPresentationOptions: {
            badge: true,
            sound: true,
            banner: true,
            list: true,
          },
        },
      },
      trigger,
    );

    CustomToaster.show(`New timer set to ${minutes} min`, {
      duration: CustomToaster.duration.SHORT,
      position: CustomToaster.position.CENTER,
      containerStyle: {
        backgroundColor: 'rgba(255,179,202,1)',
        width: '95%',
        height: 80,
        borderLeftWidth: 5,
        borderLeftColor: '#ff407b',
      },
      textStyle: {color: '#000', position: 'absolute', left: 90, fontSize: 25},
      imgSource: require('./logo.png'),
      imgStyle: {width: 65, height: 65, position: 'absolute', left: 10},
      mask: true,
      maskStyle: {},
    });

    const timeout = setTimeout(() => {
      notificationsList[uniqueId] = null;
    }, minutes * 60 * 1000);

    notificationsList[uniqueId] = {
      formId,
      tracerid,
      timeout,
      formName,
      fireDate,
    };

    // console.log("check notification 2:---->>> ",notificationsList)
    // return notificationsList =  {}

    // APIEvents.call('timerset');

    // AsyncStorage.setItem(
    //   'notificationsList',
    //   JSON.stringify(notificationsList),
    // );
  },

  cancelTimer: formId => {
    if (!notificationsList[formId]) return;

    console.log('cancel timer for ', formId);
    if (notificationsList[formId].timeout)
      clearTimeout(notificationsList[formId].timeout);

    cancelDisplayedNotification({notificationId: formId + ''});

    // PushNotification.cancelLocalNotifications({id: formId + ''});

    // Notifications.cancelLocalNotification(notificationsList[formId].localNotification);
    notificationsList[formId] = null;

    AsyncStorage.setItem(
      'notificationsList',
      JSON.stringify(notificationsList),
    );

    APIEvents.call('timerset');
  },

  listActive: async () => {
    // if (!notificationsList) {
    //   notificationsList = JSON.parse(await AsyncStorage.getItem('notificationsList')) || {};
    // //   await AsyncStorage.removeItem('notificationsList')
    //   console.log("check notification :---->>> ",notificationsList)

    //   const currentDate = new Date();

    // //   for (let i in notificationsList) {
    // //     console.log(
    // //       'hi active i',
    // //       notificationsList[i].fireDate,
    // //       currentDate,
    // //       notificationsList[i].fireDate + '' < currentDate + '',
    // //     );
    // //     // if (
    // //     //   !notificationsList[i] ||
    // //     //   !notificationsList[i].formId ||
    // //     //   notificationsList[i].fireDate + '' < currentDate + ''
    // //     // ) {
    // //     //   delete notificationsList[i];
    // //     // }
    // //   }
    // }

    return (notificationsList = {});
  },
};
