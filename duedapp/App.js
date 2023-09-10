/**
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Dimensions,
  Image,
  ImageBackground,
  IntentLauncher,
  Linking,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import VersionCheck from 'react-native-version-check'; // old lib
import semver from 'semver';
// import {checkVersion} from 'react-native-check-version'; // new lib
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DefaultTheme,
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import 'react-native-gesture-handler';

import NetInfo from '@react-native-community/netinfo';
import {createStackNavigator} from '@react-navigation/stack';
import {
  notificationListener,
  requestUserPermission,
} from './app/utils/pushNotification_helper';

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';

import {BottomTabBar, createBottomTabNavigator} from './libs/bottom-tabs';

import {ActionSheetProvider} from '@expo/react-native-action-sheet';

import moment from 'moment';

import notifee, {
  AndroidImportance,
  AuthorizationStatus,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';

import VersionNumber from 'react-native-version-number';

import {NotifierWrapper} from 'react-native-notifier';

import FeatherIcon from 'react-native-vector-icons/Feather';

import ScalingDrawer from './libs/react-native-scaling-drawer';

import CustomToaster from 'react-native-tiny-toast';
import Toast from 'react-native-toast-message';

export const IS_ANDROID = Platform.OS === 'android';

import setup from './settings';

import {API, _} from './app/api/API';
import APIEvents from './app/api/APIEvents';

import Login from './app/views/Login';

import Home from './app/views/Home';
import Loader from './app/views/Loader';

import Task from './app/views/Task';
import TaskDetail from './app/views/TaskDetail';

import Contact from './app/views/Contact';

import SuppliesList from './app/views/SuppliesList';

import Photo from './app/views/Photo';

import About from './app/views/About';

import Forgot from './app/views/Forgot';
import Pair from './app/views/Pair';
import Profile from './app/views/Profile';
import Terms from './app/views/Terms';

import Picker from './app/views/Picker';
import Select from './app/views/Select';

import FormsList from './app/views/FormsList';
// -------------------------------------------------------------------------------------

import SupplyOrder from './app/views/SupplyOrder';

import Menu from './app/views/Menu';

// -------------------------------------------------------------------------------------

import StackOptionsNavi from './app/components/StackOptionsNavi';
import StackOptionsNaviPlus from './app/components/StackOptionsNaviPlus';
import StackOptionsNaviReload from './app/components/StackOptionsNaviReload';

import StackOptionsNaviLogo from './app/components/StackOptionsNaviLogo';
import StackOptionsNaviSub from './app/components/StackOptionsNaviSub';
import UpdateScreen from './app/others/UpdateScreen';

// console.log("time check current :=> ",new Date())
const screenX = Dimensions.get('screen');
const windowX = Dimensions.get('window');

console.disableYellowBox = true;

const drawerX = React.createRef();

const defaultScalingDrawerConfig = {
  scalingFactor: 0.7,
  minimizeFactor: 0.7,
  swipeOffset: 30,
};

let current_version = '';
let latest_version = '';

const MyTheme = {
  dark: false,
  colors: {
    background: 'transparent',
    card: 'transparent',
    primary: 'red',
    border: 'red',
    notification: 'red',
  },
};

const Tab = createBottomTabNavigator();

const Drawer = createDrawerNavigator();

const Stack = createStackNavigator();
const Stack2 = createStackNavigator();

const RootStack = createStackNavigator();

// -------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------

let isSetupNotification = false;

APIEvents.addListener('menuOpen', 'app', () => {
  // drawerX.current.open();
});

APIEvents.addListener('menuClose', 'app', () => {
  //drawerX.current.close();
});

// -------------------------------------------------------------------------------------
function RootDrawer(props) {
  return <Root props={props} />;
  /*
    return <ScalingDrawer
        ref={drawerX}
        content={<Menu  navigation={props.navigation} />}
        {...defaultScalingDrawerConfig}
        >
        <Root
            />
    </ScalingDrawer>;*/
}

function HomeNavi() {
  return (
    <Stack2.Navigator screenOptions={StackOptionsNavi}>
      <Stack2.Screen name="Home" component={Home} options={StackOptionsNavi} />

      <Stack2.Screen
        name="FormsList"
        component={FormsList}
        options={StackOptionsNavi}
      />

      <Stack.Screen name="Pair" component={Pair} options={StackOptionsNavi} />

      <Stack2.Screen
        name="Profile"
        component={Profile}
        options={StackOptionsNavi}
      />

      <Stack2.Screen
        name="Contact"
        component={Contact}
        options={StackOptionsNavi}
      />

      <Stack2.Screen
        name="About"
        component={About}
        options={StackOptionsNavi}
      />

      <Stack2.Screen name="Photo" component={Photo} />

      <Stack2.Screen
        name="Task"
        component={Task}
        options={StackOptionsNaviPlus}
      />

      <Stack2.Screen
        name="TaskDetail"
        component={TaskDetail}
        options={StackOptionsNavi}
      />

      <Stack2.Screen
        name="Terms"
        component={Terms}
        options={StackOptionsNavi}
      />
    </Stack2.Navigator>
  );
}

function FormsNavi() {
  return (
    <Stack2.Navigator screenOptions={StackOptionsNavi}>
      <Stack2.Screen
        name="FormsList"
        component={FormsList}
        options={StackOptionsNaviReload}
      />

      <Stack.Screen name="Pair" component={Pair} options={StackOptionsNavi} />

      <Stack2.Screen name="Photo" component={Photo} />

      <Stack2.Screen
        name="Task"
        component={Task}
        options={StackOptionsNaviPlus}
      />

      <Stack2.Screen
        name="TaskDetail"
        component={TaskDetail}
        options={StackOptionsNavi}
      />
      <Stack2.Screen
        name="Terms"
        component={Terms}
        options={StackOptionsNavi}
      />
    </Stack2.Navigator>
  );
}

function FavNavi() {
  return (
    <Stack2.Navigator screenOptions={StackOptionsNavi}>
      <Stack2.Screen
        name="SuppliesList"
        component={SuppliesList}
        options={StackOptionsNavi}
      />

      <Stack2.Screen
        name="FormsList"
        component={FormsList}
        options={StackOptionsNavi}
      />

      <Stack2.Screen
        name="SupplyOrder"
        component={SupplyOrder}
        options={StackOptionsNavi}
      />

      <Stack.Screen name="Pair" component={Pair} options={StackOptionsNavi} />

      <Stack2.Screen name="Photo" component={Photo} />
      <Stack2.Screen
        name="Terms"
        component={Terms}
        options={StackOptionsNavi}
      />
    </Stack2.Navigator>
  );
}

function ContactsNavi() {
  return (
    <Stack2.Navigator screenOptions={StackOptionsNavi}>
      <Stack2.Screen
        name="Contact"
        component={Contact}
        options={StackOptionsNavi}
      />

      <Stack.Screen name="Pair" component={Pair} options={StackOptionsNavi} />
      <Stack2.Screen name="Photo" component={Photo} />
      <Stack2.Screen
        name="Terms"
        component={Terms}
        options={StackOptionsNavi}
      />
    </Stack2.Navigator>
  );
}

let heightX = screenX.height - windowX.height;

const tabMenuOptions = {
  labelPosition: 'beside-icon',
  style: {
    elevation: 0,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0, //Math.min(20,heightX),
    height: 85,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#17254D', //rgba(0,255,255,0.8)'
  },
  iconStyle: {
    width: 24,
  },
  tabStyle: {
    width: 'auto',
    borderRadius: 0,
    height: 50,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginTop: 10,

    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center' /**/,
  },
  indicatorStyle: {
    backgroundColor: 'transparent',
  },
  inactiveTintColor: 'white',
  activeTintColor: 'white',
  activeBackgroundColor: 'transparent',
};
const tabMenuScreenOptions = ({route}) => ({
  tabBarLabel: ({focused, color}) => {
    let name = '';
    switch (route.name) {
      case 'Home':
        name = _('Dashboard');
        break;
      case 'Forms':
        name = _('Forms');
        break;
      case 'Contact':
        name = _('Contact');
        break;
      case 'SuppliesList':
        name = _('Supplies');
        break;
      case 'OffersList':
        name = _('Offers');
        break;
      case 'VoucherScan':
        name = 'Scan voucher';
        break;
    }

    return (
      /*focused ? */ <Text
        style={{
          color: color,
          fontFamily: 'Sen-Bold',
          backgroundColor: 'transparent',
          fontSize: 13,
          lineHeight: 20,
        }}>
        {name}
      </Text>
    ); // : undefined;
  },

  tabBarButton: props => {
    let style = props.style;
    return <TouchableOpacity {...props} style={style} />;
  },
  tabBarIcon: ({focused, color, size}) => {
    let iconName;

    let width = 28;
    let height = 31;
    let marginTop = -3;
    switch (route.name) {
      case 'Home':
        width = 19;
        height = 23;
        marginTop = 10;
        iconName = require('./assets/dashboard.png');
        break;
      case 'Forms':
        width = 19;
        height = 23;
        marginTop = 10;
        iconName = require('./assets/Forms.png');
        break;
      case 'Contact':
        width = 21;
        height = 21;
        marginTop = 10;
        iconName = require('./assets/Contact.png');
        break;
      case 'SuppliesList':
        iconName = require('./assets/Supplies.png');
        break;
    }

    // You can return any component that you like here!
    return (
      <View
        style={{
          backgroundColor: focused ? '#39456A' : 'transparent',
          marginTop: focused ? -20 : marginTop,
          borderRadius: 56,
          width: 56,
          height: 56,
          borderWidth: 6,
          borderColor: focused ? '#17254D' : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={iconName}
          style={{
            marginTop: -3,
            tintColor: color,
            width,
            height,
            backgroundColor: 'transparent',
          }}
        />
      </View>
    );
  },
});

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={tabMenuScreenOptions}
      tabBarOptions={tabMenuOptions}>
      <Tab.Screen name="Home" component={HomeNavi} />
      <Tab.Screen name="Forms" component={FormsNavi} />

      <Tab.Screen name="SuppliesList" component={FavNavi} />
      <Tab.Screen name="Contact" component={ContactsNavi} />
    </Tab.Navigator>
  );
}

function UpdateCheckTab() {
  return (
    <Stack2.Navigator screenOptions={{headerShown: false}}>
      <Stack2.Screen component={UpdateScreen} name="update_screen" />
    </Stack2.Navigator>
  );
}

// const  Root =()=> {
//   const [show_model, setShow_model] = useState(null);
// useEffect(async()=>{
//   const abc = await checkIfUpdateNeeded()
//   setShow_model(abc);

// },[])

// console.log(show_model)

const Root = props => {
  const navigation = useNavigation();
  const [show_model, setShow_model] = React.useState(null);

  const checkIfUpdateNeeded = async () => {
    API.checkVersionForUpdate(getVersion);
  };

  // useEffect(() => {
  //   const runNotificationListener = async () => {
  //     const taskss = (await AsyncStorage.getItem('TASKS'));
  //     // console.log('first round :->> ',taskss)

  //     if(taskss){
  //       const intasks = JSON.parse(taskss)
  //       APIEvents.addListener('openTask', 'App', async formId => {
  //         const ee = intasks.find(task => task.uniqueid == formId.formId);
  //         console.log('hi new task 1121212', ee);
  //         if (ee) {
  //           navigation.navigate('Task', {id: ee.uniqueid, pack: JSON.stringify(ee),redirect:true,notData:formId})
  //         }
  //       });
  //     }
  //   }
  //   runNotificationListener();
  // })

  function getVersion(version) {
    // console.log("version :->>>>>>>>>>>>>>>>>",version );

    const latestVersion = version?.data;
    // console.log('latestVersion type',  latestVersion);
    const currentVersion = VersionCheck.getCurrentVersion();
    // console.log('currentVersion type',  currentVersion);
    if (Platform.OS == 'android') {
      if (parseFloat(currentVersion) < parseFloat(latestVersion)) {
        // console.log('Update Needed');
        setShow_model(true);
        // return true;
      } else {
        // console.log('Update not Needed');
        setShow_model(false);
      }
    } else {
      const remoteVersion = semver.coerce(latestVersion, {loose: true});
      // console.log('validLocalVersio', remoteVersion);
      const localVersion = semver.coerce(currentVersion, {loose: true});
      // console.log('localVersion', localVersion);
      const cmpareVersion = semver.gt(remoteVersion, localVersion);
      // console.log('cmpareVersion check', cmpareVersion);
      // console.log('cmpareVersion', typeof cmpareVersion);
      setShow_model(cmpareVersion);
      // return cmpareVersion;
    }
  }
  // console.log('Platform.OS :-> ', Platform.OS);

  useEffect(() => {
    // runBack()
    async function fetchData() {
      const check = await checkIfUpdateNeeded();
      // console.log("updatedNeeded.isNeeded :- ",check)
      // setShow_model(check);
    }
    fetchData();
  }, []);

  // console.log('show_model ->', show_model);

  if (show_model === null)
    return (
      <ImageBackground
        source={require('./assets/bg.png')}
        resizeMode="cover"
        style={{flex: 1}}>
        <View style={{backgroundColor: '#000C2E', flex: 1, opacity: 0.8}}>
          <View
            style={{
              flex: 1,
              elevation: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size={50} color="#fff" />
            <Text style={{color: '#fff'}}>Loading...</Text>
          </View>
        </View>
      </ImageBackground>
    );

  return (
    <Stack.Navigator screenOptions={StackOptionsNaviSub}>
      <Stack.Screen
        name="Loader"
        component={Loader}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Login"
        component={Login}
        options={StackOptionsNaviLogo}
      />

      <Stack2.Screen
        name="LoginInside"
        component={Login}
        options={StackOptionsNaviLogo}
      />
      <Stack.Screen
        name="Forgot"
        component={Forgot}
        options={StackOptionsNaviLogo}
      />

      <Stack.Screen
        name="Home"
        component={show_model ? UpdateCheckTab : HomeTabs}
        options={StackOptionsNavi}
      />

      <Stack.Screen name="Pair" component={Pair} options={StackOptionsNavi} />

      <Stack.Screen name="Menu" component={Menu} />
    </Stack.Navigator>
  );
};

// -------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetchingAndroidPermission: IS_ANDROID,
      isAndroidPermissionGranted: false,
      activeExample: -1,
      show_model: null,
    };
  }

  // async onDisplayNotification() {
  //   // Request permissions (required for iOS)
  //   const settings = await notifee.requestPermission();

  //   if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
  //     console.log('Permission settings:', settings);
  //   } else {
  //     console.log('User declined permissions');
  //   }

  //   // Create a channel (required for Android)
  //   const channelId = await notifee.createChannel({
  //     id: 'default',
  //     name: 'Default Channel',
  //   });

  //   // Display a notification
  //   await notifee.displayNotification({
  //     title: 'Notification Title',
  //     body: 'Main body content of the notification',
  //     importance: AndroidImportance.HIGH,
  //     vibrate: true,
  //     android: {
  //       channelId,
  //       // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
  //       // pressAction is needed if you want the notification to open the app when pressed
  //       pressAction: {
  //         id: 'default',
  //       },
  //       sound: 'my_sound',

  //       foreground: true,
  //       foregroundPresentationOptions: {
  //         badge: true,
  //         sound: true,
  //         banner: true,
  //         list: true,
  //       },
  //     },
  //     ios: {
  //       channelId,
  //       // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
  //       // pressAction is needed if you want the notification to open the app when pressed
  //       pressAction: {
  //         id: 'default',
  //       },
  //       sound: 'my_sound.wav',

  //       foreground: true,
  //       foregroundPresentationOptions: {
  //         badge: true,
  //         sound: true,
  //         banner: true,
  //         list: true,
  //       },
  //     },
  //   });
  // }

  // async scheduleNotification() {
  //   const channelId = await notifee.createChannel({
  //     id: 'default 1',
  //     name: 'Default Channel',
  //   });

  //   // Create a time-based trigger
  //   const trigger: TimestampTrigger = {
  //     type: TriggerType.TIMESTAMP,
  //     timestamp: Date.now() + 1000 * 15,
  //   };

  //   console.log('time check :->>> ', trigger);

  //   // Create a trigger notification
  //   await notifee.createTriggerNotification(
  //     {
  //       title: 'Meeting with Jane',
  //       body: 'Today at 05:29am',
  //       data: {
  //         name: 'deepak singh',
  //       },
  //       importance: AndroidImportance.HIGH,
  //       vibrate: true,
  //       android: {
  //         channelId,
  //         // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
  //         // pressAction is needed if you want the notification to open the app when pressed
  //         pressAction: {
  //           id: 'default 1',
  //         },
  //         sound: 'my_sound',

  //         foreground: true,
  //         foregroundPresentationOptions: {
  //           badge: true,
  //           sound: true,
  //           banner: true,
  //           list: true,
  //         },
  //       },

  //       ios: {
  //         channelId,
  //         // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
  //         // pressAction is needed if you want the notification to open the app when pressed
  //         pressAction: {
  //           id: 'default',
  //         },
  //         sound: 'my_sound.wav',

  //         foreground: true,
  //         foregroundPresentationOptions: {
  //           badge: true,
  //           sound: true,
  //           banner: true,
  //           list: true,
  //         },
  //       },
  //     },
  //     trigger,
  //   );
  // }

  async componentDidMount() {
    if (Platform.OS === 'android') {
      const settings = await notifee.requestPermission();
    }
    // const settings = await notifee.getNotificationSettings();
    // console.log('setting :', settings);

    // if (settings.authorizationStatus === AuthorizationStatus.NOT_DETERMINED) {
    //   await notifee.requestPermission();
    // } else if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
    //   Alert.alert(
    //     `"Dued" Would Like to Send
    //       You Notifications`,
    //     'Notifications may include alerts,sounds, and also for cut off. Please give the notification access. These can be configured in Settings.',
    //     [
    //       {text: 'Cancel'},
    //       {
    //         text: 'Reset',
    //         onPress: () => this.enableNotification(),
    //         style: 'destructive',
    //       },
    //     ],
    //     {cancelable: true},
    //   );
    // }
    requestUserPermission();
    notificationListener();

    // const value = await AsyncStorage.getItem('TASKS');

    // let tasks = JSON.parse(value);

    // console.log('tasks :->>>> ', tasks);

    // this.onDisplayNotification();
    // this.scheduleNotification();

    // PushNotification.localNotificationSchedule({
    //   title:  ' - Dued',
    //   tag: 'json: data check',
    //   userInfo: {action: 'openform', formId: '130' + '',},
    //   message: 'Time is out for your form!',
    //   // date: fireDate,
    //   date: new Date(Date.now() + 8 * 1000), // convertSecond mint
    //   vibrate: true,
    //   // soundName: soundDefault,
    //   largeIcon: 'ic_launcher',
    // })

    API.postCheckActualVersion();

    setInterval(() => {
      API.postCheckActualVersion();
    }, 1000 * 60 * 60);
  }

  enableNotification() {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  }

  render = () => {
    return (
      <NotifierWrapper>
        <ActionSheetProvider>
          <NavigationContainer theme={MyTheme}>
            <StatusBar translucent barStyle={'light-content'} />
            <RootStack.Navigator
              mode="modal"
              headerMode="none"
              screenOptions={{
                cardStyle: {backgroundColor: 'transparent'},
                cardOverlayEnabled: true,
                cardStyleInterpolator: ({current: {progress}}) => ({
                  cardStyle: {
                    opacity: progress.interpolate({
                      inputRange: [0, 0.5, 0.9, 1],
                      outputRange: [0, 0.25, 0.7, 1],
                    }),
                  },
                  overlayStyle: {
                    opacity: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 0.5],
                      extrapolate: 'clamp',
                    }),
                  },
                }),
              }}
              cardOverlayEnabled={true}
              headerTransparent={true}>
              <RootStack.Screen
                name="Root"
                component={RootDrawer}
                options={{headerShown: false}}
              />

              <RootStack.Screen name="Select" component={Select} />
              <RootStack.Screen name="Picker" component={Picker} />
            </RootStack.Navigator>
            <Toast ref={ref => Toast.setRef(ref)} />
          </NavigationContainer>
        </ActionSheetProvider>
      </NotifierWrapper>
    );
  };
}

export default App;
