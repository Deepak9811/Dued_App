/**
 * Created by jedrzej on 29/05/2020.
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
  ScrollView,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import AsyncStorage from '@react-native-async-storage/async-storage';


import {Layout} from '../api/API';

export default class Container extends React.Component {
  render =() => {
    const Op = this.props.keyboardAware ? KeyboardAwareScrollView : ScrollView;
    
    // const Op =  ScrollView;

    // console.log("this.props.scrollEnable :------->>>> ",this.props.scrollEnable)

    if (this.props.positioning == 'center' && DeviceInfo.isTablet()) {
      return (
        <View style={{flex: 1}}>
          <Op 
            enableAutomaticScroll={typeof this.props.scrollEnable === 'undefined' ? true : this.props.scrollEnable}
            scrollEnabled={typeof this.props.scrollEnable === 'undefined' ? true : this.props.scrollEnable}
            scrollEventThrottle={22}
            onScroll={a => {
              if (this.props.offsetCall) {
                this.props.offsetCall(a.nativeEvent.contentOffset.y);
              }
            }}
            style={[
              {
                top: '5%',
                left: '15%',
                width: '70%',
                marginTop: this.props.marginTop || 50,
                zIndex: 10,
              },
              this.props.style,
            ]}>
            {this.props.children}
          </Op>
        </View>
      );
    }

    return (
      <Op
        enableAutomaticScroll={typeof this.props.scrollEnable === 'undefined' ? true : this.props.scrollEnable}
        scrollEnabled={typeof this.props.scrollEnable === 'undefined' ? true : this.props.scrollEnable}
        scrollEventThrottle={22}
        onScroll={a => {
          if (this.props.offsetCall) {
            this.props.offsetCall(a.nativeEvent.contentOffset.y);
          }
        }}
        style={[
          {
            marginTop: this.props.marginTop || 50,
            marginLeft: this.props.marginLeft || 30,
            marginRight: this.props.marginRight || 30,
            zIndex: 10,
          },
          this.props.style,
        ]}>
          <ScrollView  
            scrollEnabled={typeof this.props.scrollEnable === 'undefined' ? true : this.props.scrollEnable}
          >

        {this.props.children}
          </ScrollView>
      </Op>
    );
  };
}