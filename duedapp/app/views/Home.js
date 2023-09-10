/**
 * Created by jedrzej on 1/06/2020.
 */

import * as React from 'react';

import {
  Alert,
  Animated as AnimatedX,
  AppState,
  Button as ButtonX,
  Dimensions,
  Easing as EasingX,
  Image,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';

import SplashScreen from 'react-native-splash-screen';

var moment = require('moment');

import AsyncStorage from '@react-native-async-storage/async-storage';

import {SearchBar} from 'react-native-elements';
import Carousel, {Pagination} from 'react-native-snap-carousel';

import LinearGradient from 'react-native-linear-gradient';

import settings from '../../settings';

import {API, Layout, _} from '../api/API';
import APIEvents from '../api/APIEvents';

import notifee, {AuthorizationStatus} from '@notifee/react-native';
import Timers from '../api/Timer';
import Background from '../components/Background';
import Button from '../components/Button';
import Heading from '../components/Heading';
import OfferBox from '../components/OfferBox';
import OfferSmallBox from '../components/OfferSmallBox';
import Para from '../components/Para';
import TaskButton from '../components/TaskButton';
import TimerButton from '../components/TimerButton';
import VoucherBox from '../components/VoucherBox';
import Window from '../components/Window';

class CurrentView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSlide: 0,
      tasks: null,
      timers: [{}],
      offers: null,
      submitting: API.submitting,
    };

    APIEvents.addListener('resetHome', 'Home', () => {
      // console.log('reset home!');
      this.componentDidMount();
    });

    APIEvents.addListener('submitting', 'Home', submitting => {
      this.setState({submitting});
    });
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('TASKS');
      // console.log('tastk :==========> ', value);

      if (value !== null) {
        this.setState({tasks: JSON.parse(value)});
      } else {
        this.setState({tasks: []});
      }
      console.log('get task data :-=======>', this.state.tasks);
    } catch (error) {
      CustomToaster.show(`Storage Error`, {
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
        imgSource: require('../api/logo.png'),
        imgStyle: {width: 65, height: 65, position: 'absolute', left: 10},
        mask: true,
        maskStyle: {},
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'Storage Error',
      //   autoHide: false,
      //   text2: error + '',
      // });
    }
  };

  _storeData = async () => {};

  onAppStateChange = state => {
    //console.log('state',state);
    if (state === 'active') {
      this.setState({rand: Math.random()});
    }
  };

  refreshData = async () => {
    const timersNew = await Timers.listActive();
  };

  componentWillUnmount() {
    APIEvents.removeListener('resetHome', 'Home');
    APIEvents.removeListener('currentTask', 'home');
    APIEvents.removeListener('submitting', 'Home');
    // APIEvents.removeListener('openTask', 'Home');
    AppState.removeEventListener('change', this.onAppStateChange);
  }

  enableNotification() {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  }

  componentDidMount = async () => {
    const settings = await notifee.getNotificationSettings();
    // console.log('setting :', settings);

    if (settings.authorizationStatus === AuthorizationStatus.NOT_DETERMINED) {
      await notifee.requestPermission();
    } else if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
      Alert.alert(
        `"Dued" Would Like to Send
          You Notifications`,
        'Notifications may include alerts,sounds, and also for cut off. Please give the notification access. These can be configured in Settings.',
        [
          {text: 'Cancel'},
          {
            text: 'Reset',
            onPress: () => this.enableNotification(),
            style: 'destructive',
          },
        ],
        {cancelable: true},
      );
    }

    this.refreshData();
    const taskss = await AsyncStorage.getItem('TASKS');
    // console.log('hello :-> '+taskss)
    APIEvents.addListener('currentTask', 'Home', async () => {
      const tasks = JSON.parse(await AsyncStorage.getItem('TASKS'));
      // console.log('relrel', tasks.length);
      if (tasks) {
        this.setState({tasks: tasks, random: Math.random()});
      } else {
        this.setState({tasks: [], random: Math.random()});
      }
    });

    AppState.addEventListener('change', this.onAppStateChange);

    APIEvents.addListener('openTask', 'Home', async formId => {
      // console.log('form data check :->>> ', formId);
      const ee = this.state.tasks.find(task => task.uniqueid == formId.formId);
      // console.log('hi new task 1121212', ee);
      if (ee) {
        this.taskRedirect(ee, formId);
      }
    });

    SplashScreen.hide();
    this.props.navigation.setOptions({title: 'Dashboard'});

    this._retrieveData();
  };

  taskRedirect = (e, formId) => {
    this.props.navigation.navigate('Task', {
      id: e.uniqueid,
      pack: JSON.stringify(e),
      redirect: true,
      notData: formId,
    });
  };

  task = e => {
    this.props.navigation.navigate('Task', {id: e.id, pack: JSON.stringify(e)});
  };

  reload = () => {
    if (this.delay) clearTimeout(this.delay);

    this.searchX();
  };

  _renderItem = ({item, index}) => {
    return <View style={[styles.slide, {alignItems: 'center'}]} />;
  };

  get pagination() {
    const {entries, activeSlide} = this.state;
    return (
      <Pagination
        dotsLength={1}
        activeDotIndex={activeSlide}
        containerStyle={{marginTop: -80, backgroundColor: 'transparent'}}
        dotStyle={{
          width: 8,
          height: 8,
          borderRadius: 5,
          marginHorizontal: -10,
          backgroundColor: '#0087CB',
        }}
        inactiveDotStyle={{
          width: 8,
          height: 8,
          backgroundColor: '#161617',
          // Define styles for inactive dots here
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={1}
      />
    );
  }

  render() {
    let backgroundSyncs = API.listBackgroundSyncs();
    let submitted = 0;

    return (
      <Background scrolls={true} style={{flex: 1}}>
        <View style={{marginTop: -20}}>
          <ScrollView style={{paddingBottom: 10}}>
            <Heading
              size={2}
              style={{padding: 30, paddingBottom: 18, paddingLeft: 15}}>
              {_('In Progress') + (this.state.submitting ? '...' : '')}
            </Heading>

            {!this.state.tasks ||
            this.state.tasks.filter(e => !e.submitted).length == 0 ? (
              <Para
                style={{
                  textAlign: 'left',
                  marginTop: 5,
                  marginLeft: 20,
                  flex: 1,
                }}>
                Nothing found. Add more via Forms list.
              </Para>
            ) : (
              undefined
            )}

            {!settings.isProduction && (
              <Button
                style={{marginTop: 20}}
                label={'[DEV TEST] CLEAR TASKS'}
                onPress={async () => {
                  await AsyncStorage.setItem('TASKS', '[]');
                  this.componentDidMount();
                }}
              />
            )}

            {this.state.tasks &&
              this.state.tasks.map((e, i) => {
                if (!e) return;

                if (e.submitted) return;

                return (
                  <TaskButton
                    key={'b' + i}
                    onPress={() => this.task(e)}
                    plan={e}
                    ii={i}
                  />
                );
              })}

            {!settings.isProduction && (
              <Button
                style={{marginTop: 50}}
                label={'[DEV TEST] Submit manual'}
                onPress={async () => {
                  const value = await AsyncStorage.getItem('TASKS');

                  let tasks = JSON.parse(value);

                  for (let i in tasks) {
                    tasks[i].submitted = moment().format('YYYY-MM-DD');
                  }
                  AsyncStorage.setItem('TASKS', JSON.stringify(tasks));
                  this.componentDidMount();
                }}
              />
            )}

            {!settings.isProduction && (
              <Button
                style={{marginTop: 50}}
                label={'[DEV TEST] Send manual'}
                onPress={async () => {
                  const value = await AsyncStorage.getItem('TASKS');

                  let tasks = JSON.parse(value);

                  for (let i in tasks) {
                    tasks[i].submitted = moment().format('YYYY-MM-DD');
                  }
                  AsyncStorage.setItem('TASKS', JSON.stringify(tasks));
                  this.componentDidMount();
                }}
              />
            )}

            {!settings.isProduction && (
              <Button
                style={{marginTop: 50}}
                label={'[DEV TEST] Logout'}
                onPress={async () => {
                  API.postLogout({}, () => {
                    APIEvents.call('resetHome');

                    APIEvents.call('menuClose');
                    this.props.navigation.reset({
                      index: 0,
                      routes: [{name: 'Login'}],
                    });
                  });
                }}
              />
            )}

            <Heading
              size={2}
              style={{padding: 30, paddingBottom: 18, paddingLeft: 15}}>
              {_('Submitted Offline') + (this.state.submitting ? '...' : '')}
              <Text style={{fontSize: 16, lineHeight: 18}}>
                {'\n'}
                {_('(Forms will be sent when back online)')}
              </Text>
            </Heading>
            {!this.state.tasks ||
            this.state.tasks.filter(e => !!e.submitted).length == 0 ? (
              <Para
                style={{
                  textAlign: 'left',
                  marginTop: 5,
                  marginLeft: 20,
                  flex: 1,
                }}>
                Nothing found.
              </Para>
            ) : (
              undefined
            )}

            {this.state.tasks &&
              this.state.tasks.map((e, i) => {
                if (!e) return;

                if (!e.submitted) return;

                if (submitted++ > 20) return;

                return (
                  <TaskButton
                    key={'b' + i}
                    onPress={() => this.task(e)}
                    plan={e}
                  />
                );
              })}

            {/* <TouchableOpacity
              onPress={() =>
                this.setState({revealBackground: !this.state.revealBackground})
              }
              style={{paddingTop: 40, padding: 20}}>
              <Text style={{color: 'gray'}}>
                Last background sync:{' '} 
                {backgroundSyncs && backgroundSyncs.length > 0
                  ? backgroundSyncs[backgroundSyncs.length - 1] + ''
                  : 'unknown'}
              </Text>
            </TouchableOpacity>

            {this.state.revealBackground && backgroundSyncs ? (
              <View style={{paddingHorizontal: 30, paddingBottom: 100}}>
                {backgroundSyncs.length > 0 &&
                  backgroundSyncs.map(bs => {
                    return (
                      <Text key={bs + ''} style={{color: 'gray'}}>
                        {bs + ''}
                      </Text>
                    );
                  })}
                {backgroundSyncs.length == 0 ? (
                  <Text style={{color: 'gray'}}>Nothing found</Text>
                ) : (
                  undefined
                )}
              </View>
            ) : (
              undefined
            )} */}
          </ScrollView>
        </View>

        <View style={{height: 100}} />
      </Background>
    );
  }
}

const styles = StyleSheet.create({});

export default CurrentView;
