/**
 * Created by jedrzej on 30/05/2020.
 */

import * as React from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {CommonActions, Link} from '@react-navigation/native';
import {Layout} from '../api/API';

import LinearGradient from 'react-native-linear-gradient';

import FastImage from 'react-native-fast-image';

import Heading from '../components/Heading';

export default class Input extends React.Component {
  render = () => {
    return (
      <TouchableOpacity
        onPress={() => this.props.onPress(this.props.plan)}
        style={{
          backgroundColor: 'rgba(255,255,255,0.18)',
          marginHorizontal: 5,
          marginVertical: 10,
          borderRadius: 8,
          paddingVertical: 20,
          paddingHorizontal: 30,
          overflow: 'hidden',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}>
        <Heading size={4} arrow={true} style={{backgroundColor: 'transparent'}}>
          {/*this.props.ii?<Text style={{fontSize:12,opacity:0.5}}>{this.props.ii}) </Text>:undefined*/}
          {this.props.plan.name}
        </Heading>
      </TouchableOpacity>
    );
  };
}
