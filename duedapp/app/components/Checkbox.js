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
  TouchableOpacity,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

import {Layout} from '../api/API';
import Para from './Para';

export default class Input extends React.Component {
  onChangeText = text => {};

  render = () => {
    let errorBar = undefined;
    if (this.props.error) {
      errorBar = (
        <View style={{}}>
          <Para
            size={5}
            style={{color: 'red', marginHorizontal: 10, marginBottom: 20}}>
            {this.props.error}
          </Para>
        </View>
      );
    }

    return (
      <View>
        <View
          style={[
            {flexDirection: 'row', marginVertical: 10},
            this.props.style,
          ]}>
          <CheckBox
            style={Layout.getElementStyle('input-checkbox')}
            value={this.props.text}
            boxType={'square'}
            onFillColor={'white'}
            onCheckColor={'gray'}
            onTintColor={'gray'}
            lineWidth={1}
            onValueChange={text => {
              console.log('on change', text);
              this.props.onSubmitEditing(text);
              this.props.onBlur && this.props.onBlur(!this.props.text);
            }}
            tintColors={{true: 'white', false: 'white'}}
          />
          <TouchableOpacity
            onPress={() => {
              (this.props.onSubmitEditing || this.props.onPress)(
                !this.props.text,
              );
              this.props.onBlur && this.props.onBlur(!this.props.text);
            }}
            style={{alignSelf: 'center'}}>
            <Text
              style={[
                this.props.link
                  ? {
                      textDecorationLine: 'underline',
                      color: 'white',
                      marginLeft: 20,
                    }
                  : {},
                Layout.getElementStyle(
                  'input-checkbox-text',
                  Layout.textStyle(this.props.styleSetup, {
                    fontSize: 14,
                    paddingLeft: 10,
                    paddingRight: 30,
                    color: this.props.mode == 'dark' ? '#323231' : 'white',
                  }),
                ),
              ]}>
              {this.props.placeholder}
            </Text>
          </TouchableOpacity>
        </View>
        {errorBar}
      </View>
    );
  };
}
