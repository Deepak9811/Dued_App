/**
 * Created by jedrzej on 2/06/2020.
 */

import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TextInput,
  Button,
  Image,
} from 'react-native';

import DeviceInfo from 'react-native-device-info';
import LinearGradient from 'react-native-linear-gradient';

import {Layout} from '../api/API';

import ContainerScrollableView from '../components/ContainerScrollableView';

import setup from '../../settings';

export default class Background extends React.Component {
  render = () => {
    if (DeviceInfo.isTablet()) {
    }


    let image = (
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          resizeMode: 'cover',
          backgroundColor: '#000C2E',
        }}>
        <Image
          source={require('../../assets/bg.png')}
          style={{
            width: '100%',
            height: '100%',
            opacity: 0.11,
            // resizeMode: 'cover',
          }}
          resizeMode={'cover'}
        />
      </View>
    );

    if (this.props.scrolls) {
      return (
        <View
          style={{
            flex: 1,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {image}
          <ContainerScrollableView
            scrollEnable={this.props.scroll}
            keyboardAware={true}
            offsetCall={this.props.offsetCall}
            style={{
              backgroundColor: 'transparent',
              width: '100%',
              marginLeft: 0,
              marginTop: 0,
              marginRight: 0,
              zIndex: 10,
            }}>
            <View style={{flex: 1, width: '100%'}}>{this.props.children}</View>
          </ContainerScrollableView>
        </View>
      );
    }

    return (
      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {image}
        <View style={{flex: 1, width: '100%'}}>{this.props.children}</View>
      </View>
    );
  };
}
