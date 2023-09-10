/**
 * Created by jedrzej on 15/06/2020.
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
  TouchableOpacity,
} from 'react-native';
import {Link} from '@react-navigation/native';

import {Layout} from '../api/API';

export default class Input extends React.Component {
  onChangeText = text => {
    'use strict';

  };

  render = () => {
    'use strict';


    const {size} = this.props;

    let fontFamily = 'Overpass-Regular';
    let fontSize = size;
    let lineHeight = size;

    let colorRight = '#2DB1F2';
    switch (size + '') {
      case '1':
        fontFamily = 'Poppins-SemiBold';
        break;
      case '2':
        fontFamily = 'Poppins-SemiBold';
        fontSize = 23;
        lineHeight = 27;
        break;
      case '3':
        fontFamily = 'Poppins-Medium';
        fontSize = 19;
        lineHeight = 22;
        break;
      case '5':
        fontSize = 15;
        lineHeight = 22.5;
        break;
      case '6':
        fontFamily = 'Overpass-Light';
        fontSize = 15;
        lineHeight = 22;
        break;
    }

    if (typeof this.props.children !== 'object') {
        return (
            <Text
              style={[
                Layout.textStyle(this.props.styleSetup, {
                  fontFamily,
                  color: 'white',
                  fontSize: fontSize,
                  lineHeight: lineHeight,
                }),
                this.props.style,
              ]}>
              {this.props.children}
            </Text>
          );
    }
    return null
  };
}
