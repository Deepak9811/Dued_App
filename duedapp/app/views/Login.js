/**
 * Created by jedrzej on 3/06/2020.
 */

import * as React from 'react';

import {
  Text,
  View,
  StyleSheet,
  SafeViewArea,
  StatusBar,
  SafeAreaView,
  Button as ButtonX,
  Platform,
  TouchableOpacity,
  Animated as AnimatedX,
  Image,
  TextInput,
  Easing as EasingX,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Animated, {Easing} from 'react-native-reanimated';
const {
  Clock,
  Value,
  set,
  cond,
  startClock,
  clockRunning,
  timing,
  debug,
  stopClock,
  block,
} = Animated;

//import { LoginButton, AccessToken } from 'react-native-fbsdk';
import SplashScreen from 'react-native-splash-screen';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import VersionNumber from 'react-native-version-number';
import DeviceInfo from 'react-native-device-info';

//import { getTrackingStatus, requestTrackingPermission } from 'react-native-tracking-transparency';

import setup from '../../settings';
import APIEvents from '../api/APIEvents';

import {Layout, API, _} from '../api/API';

import Background from '../components/Background';
import Input from '../components/Input';
import Button from '../components/Button';
import Link from '../components/Link';
import Heading from '../components/Heading';
import ContainerScrollableView from '../components/ContainerScrollableView';

class CurrentView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      loading: false,
      keep_logged_in: false,
    };
  }

  componentDidMount = async () => {
    this.props.navigation.setOptions({title: 'Login'});
    SplashScreen.hide();
  };

  form = (e, v) => {
    this.state[e] = v;
    this.setState({random: Math.random()});
  };

  callAvatar = url => {
    API.setSessionData('photo_url', url);

    APIEvents.call('avatar');

    this.props.navigation.setParams({newAvatar: Math.random()});
  };

  login = async() => {
    /*
        this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
        });
        return;*/

    if (
      this.state.email &&
      this.state.password &&
      this.state.email.trim().length > 0 &&
      this.state.password.trim().length > 0
    ) {
      this.setState({loading: true});

      let fcmToken = await AsyncStorage.getItem("fcmtoken")
      console.log('token get in login page :- ',fcmToken)
 
      API.postLogin(
        {
          grant_type: 'pin',
          device_token: API.getDeviceToken(),
          device_type: API.getDeviceType(),
          device_model: API.getDeviceModel(),
          email: this.state.email,
          password: this.state.password,
          fcm_token:fcmToken,
        },
        (err, dt) => {
          this.setState({loading: false});

          if (err || !dt.success) {
            if (dt && dt.message) {
              alert(dt.message);
              return;
            }
            alert(err);
            return; // this.setState({error:err});
          }
          if (!dt || !(dt && dt.token)) {
            alert(_(dt.message || 'connection_hang'));
            return; // this.setState({error:dt.message || "connection_hang"});
          } else if (!dt.success) {
            alert(
              _(
                dt.message ||
                  'Sorry, We cannot complete your request at this time! @2 ',
              ),
            );
            return;
          }

          API.ticleToken(); // resend push token to new account

          APIEvents.call('resetHome');

          this.callAvatar(dt.photo_url);

          if (this.props.route.name == 'LoginInside') {
            this.props.navigation.goBack();
            return;
          }

          this.props.navigation.reset({
            index: 0,
            routes: [{name: 'Home'}],
          });
        },
      );
    } else {
      alert('Please enter your email and password');
    }
  };

  pairing = () => {
    this.props.navigation.navigate('Pair');
  };

  render() {
    const buildVersion = VersionNumber.buildVersion || '0';
    const versionVersion = VersionNumber.appVersion || '0';

    return (
      <Background page="Login">
        <ContainerScrollableView
          keyboardAware={true}
          positioning="center"
          style={{
            zIndex: 1,
            marginTop: 0,
            marginLeft: 0,
            marginRight: 0,
            marginBottom: 0,
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 0,
              height: 270,
            }}>
            <Image
              source={require('../../assets/logo.png')}
              style={{width: '28%', resizeMode: 'contain'}}
            />
            <View style={{width: '100%'}}>
              <Heading
                style={{
                  marginTop: 0,
                  marginBottom: 40,
                  textAlign: 'center',
                  width: '100%',
                }}
                size={3}>
                Welcome to Dued App
              </Heading>
            </View>
          </View>

          <View style={{marginLeft: 20, marginRight: 20, zIndex: 2}}>
            {this.state.error && (
              <TouchableOpacity
                onPress={this.componentDidMount}
                style={{marginBottom: 20}}>
                <Text style={{color: 'red'}}>{this.state.error + ''}</Text>
              </TouchableOpacity>
            )}

            <Input
              type={'email'}
              placeholder={_('User')}
              placetext={"Device's email"}
              autoCorrect={false}
              text={this.state.email}
              onSubmitEditing={v => this.form('email', v)}
            />

            <Input
              placeholder={_('Pin')}
              autoCapitalize={'none'}
              keyboardType={'number-pad'}
              autoCorrect={false}
              placetext={'Enter your pin'}
              onSubmitEditing={v => this.form('password', v)}
            />

            <Button
              label={_(this.state.loading ? 'Loading...' : 'Login')}
              style={{marginTop: 40}}
              onPress={this.login}
            />

            <View
              style={{
                paddingTop: 10,
                paddingBottom: 10,
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={this.pairing}
                style={[
                  {
                    paddingTop: 30,
                    paddingBottom: 20,
                    justifyContent: 'space-between',
                    alignSelf: 'center',
                  },
                ]}>
                <Text
                  style={{
                    fontFamily: 'Overpass-Regular',
                    alignSelf: 'center',
                    color: 'white',
                    fontSize: 16,
                  }}>
                  {'Pairing details'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{height: 20}} />
            <Text
              style={{
                color: '#FFF',
                fontFamily: 'Overpass-Regular',
                letterSpacing: 1,
                fontSize: 12,
                textAlign: 'center',
                opacity: 0.2,
              }}>
              App build{' '}
              <Text style={{fontFamily: 'Poppins-SemiBold'}}>
                {buildVersion}
              </Text>
              , version{' '}
              <Text style={{fontFamily: 'Poppins-SemiBold'}}>
                {versionVersion} {setup.isProduction ? 'PROD' : 'TEST'}
              </Text>
            </Text>
          </View>
        </ContainerScrollableView>
      </Background>
    );
  }
}

const styles = StyleSheet.create({});

export default CurrentView;
