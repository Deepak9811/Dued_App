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
    let fontFamilyExtra = 'Overpass-Regular';
    let fontSize = 39 / size;
    let lineHeight = 48 / size;

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

    if (this.props.subText) {
      return (
        <View style={{}}>
          <Text
            style={[
              this.props.style,
              {
                fontFamily,
                color: 'white',
                fontSize: fontSize,
                lineHeight: lineHeight,
                textAlign: 'center',
              },
            ]}>
            {this.props.children}
          </Text>

          <Text
            style={{
              textAlign: 'center',
              marginTop: Math.floor(-lineHeight / 1.5),
              fontSize: Math.floor(fontSize / 1.5),
              color: 'white',
              lineHeight: Math.floor(fontSize / 1.5),
              fontFamily: fontFamilyExtra,
            }}>
            {'\n' + this.props.subText}
          </Text>
        </View>
      );
    }

    return (
      <Text
        style={[
          this.props.style,
          {
            fontFamily,
            color: 'white',
            fontSize: fontSize,
            lineHeight: lineHeight,
            textAlign: 'center',
          },
        ]}>
        {this.props.children}
        {this.props.subText ? (
          <Text
            style={{
              fontSize: fontSize / 1.5,
              lineHeight: fontSize / 1.5,
              fontFamily: fontFamilyExtra,
            }}>
            {'\n' + this.props.subText}
          </Text>
        ) : (
          undefined
        )}
      </Text>
    );
  };
}
