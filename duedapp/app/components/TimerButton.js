/**
 * Created by jedrzej on 30/05/2020.
 */

import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';

import {Layout} from '../api/API';
import {Link, CommonActions} from '@react-navigation/native';

import LinearGradient from 'react-native-linear-gradient';

import FastImage from 'react-native-fast-image';

import Heading from '../components/Heading';

var moment = require('moment');
export default class Input extends React.Component {
  render = () => {
    var a = moment(new Date());
    var b = moment(this.props.plan.fireDate);
    // alert("timer :-> "+b)

    return (
      <TouchableOpacity
        onPress={() => this.props.onPress(this.props.plan)}
        style={styles.timerBtn}>
        <Heading size={4} arrow={true} style={{backgroundColor: 'transparent'}}>
          🕑 {b.diff(a, 'minutes')} min...{' '}
          {this.props.plan.formName || 'form name'}
        </Heading>
      </TouchableOpacity>
    );
  };
}

const styles = StyleSheet.create({
  timerBtn: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginHorizontal: 5,
    marginVertical: 10,
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 30,
    overflow: 'hidden',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
});
