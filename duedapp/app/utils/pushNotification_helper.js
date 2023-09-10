import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {API} from '../api/API';

// export async function requestUserPermission() {
//     const authStatus = await messaging().requestPermission();
//     const enabled =
//       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//       if(enabled){
//         console.log('Authorization status: ',authStatus)

//         getFCMToke()
//     }
//   }

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission({
    provisional: true,
  });

  const authorizationStatus = await messaging().requestPermission();
  if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
    console.log('User has notification permissions enabled.');
  } else if (
    authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
  ) {
    console.log('User has provisional notification permissions.');
  } else {
    console.log('User has notification permissions disabled');
  }

  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    // console.log('Authorization status: ', authStatus);

    getFCMToke();
  }
}

async function getFCMToke() {
  let fcmToken = await AsyncStorage.getItem('fcmtoken');
  console.log('old fcm token :- ', typeof fcmToken);
  if (!fcmToken) {
    try {
      let checkReg = await messaging().registerDeviceForRemoteMessages();
      // console.log('checkReg :-> ', checkReg);
      let fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log('new generate fcm token :- ', fcmToken);
        await AsyncStorage.setItem('fcmtoken', fcmToken);
      } else {
      }
    } catch (error) {
      console.log('error in fcmtoken :-> ', error);
    }
  }
}

export const notificationListener = () => {
  // Assume a message-notification contains a "type" property in the data payload of the screen to open

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
    // navigation.navigate(remoteMessage.data.type);
  });

  // foreground handling
  messaging().onMessage(async remoteMessage => {
    console.log('A new FCM message arrived!', remoteMessage);
    if (remoteMessage) {
      // let fcmToken = await AsyncStorage.getItem('fcmtoken');

      // let data = remoteMessage.data;
      // let data1 = JSON.parse(data.body);

      // let findFcm1 = data1.find(x => x.fcm_token === fcmToken);
      // console.log('find our fcm :->> ', findFcm1.fcm_token);

      API.silentNotification(remoteMessage, null);
    }
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
        // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
      }
      //   setLoading(false);
    });

  messaging().onMessage(async remoteMessage => {
    console.log('notification on foreground state.....', remoteMessage);
  });
};
