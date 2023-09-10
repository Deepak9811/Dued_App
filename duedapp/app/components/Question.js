/**
 * Created by jedrzej on 04/07/2022.
 */

import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import APIEvents from '../api/APIEvents';
import Para from './Para';
import Checkbox from './Checkbox';
import {Layout} from '../api/API';
import Images from './Images';

export default class Question extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.setData(props);
  }

  setData(props) {
    let data = {};
    if (typeof props.text == 'string') {
      data.text = props.text;
    } else {
      data = props.text || {};
    }
    this.setState(data);
  }



  componentDidUpdate(prevProps, prevState) {


    if (
      this.props.text &&
      JSON.stringify(this.props.text) != JSON.stringify(prevState.text) &&
      JSON.stringify(this.props.text) != JSON.stringify(this.state)
    ) {
      this.setData(this.props);

      // this.setState({text:this.props.text});
    }
  }

  // onFocus= ()=>{APIEvents.call('BlurBlur',this.props.id);}
  // turnOffEditing = ()=>{ if(this.state.editing) {this.setState({editing: false});}}
  // componentWillUnmount () {}

  onChangeText = text => {
    this.setState({text}, () => this.props.onSubmitEditing(this.state));
  };

  onChangeValue = value => {
    this.setState({value}, () => this.props.onSubmitEditing(this.state));
  };

  onChangeImage = image => {
    //console.log('hhhi img',image);
    this.setState({image}, () => this.props.onSubmitEditing(this.state));
  };

  onBlurMethod = blur => {
    if (this.props.onBlur) this.props.onBlur(this.state.text);
  };

  render = () => {
    const style = {
      fontFamily: 'Roboto-Regular',
      fontSize: 17,
      height: this.props.numberOfLines > 1 ? this.props.numberOfLines * 33 : 60,
      marginTop: 0,

      paddingTop: this.props.numberOfLines > 1 ? 20 : 0,

      paddingLeft: 20,
      marginBottom: 20,
      color: 'black',
      borderColor: '#DDD',
      backgroundColor: 'white',
      borderRadius: 10,
      borderBottomWidth: 1,
    };

    const styleText = {
      fontFamily: 'Roboto-Regular',
      fontSize: 17,
      lineHeight: 60,
      color: 'black',
      borderBottomWidth: 1,
    };

    const placeholderColor =
      this.props.placeholderColor || style.placeholderTextColor || undefined;
    if (placeholderColor) {
      delete style.placeholderTextColor;
    }

    let {text, value, image} = this.state; //  || ''

    let images = this.props?.text?.image


    let errorBar = undefined;
    if (this.props.error && this.props.error != 'Please complete') {
      errorBar = (
        <Para
          size={5}
          style={{color: 'red', marginHorizontal: 10, marginBottom: 20}}>
          {this.props.error}
        </Para>
      );
    }

    return (
      <View>
        <Text
          style={Layout.textStyle(this.props.styleSetup, {
            fontFamily: 'Roboto-Regular',
            color: 'white',
            marginBottom: 10,
            fontSize: 17,
          })}>
          {this.props.placeholder}
        </Text>

        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          <View style={{maxWidth: 300, marginRight: 10}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 20,
              }}>
              <Checkbox
                placeholder={'Yes'}
                text={value == 'Yes'}
                styleSetup={this.props.styleSetup}
                onSubmitEditing={val => {
                  if (!val) return this.onChangeValue(null);
                  this.onChangeValue('Yes');
                }}
              />

              <Checkbox
                placeholder={'No'}
                text={value == 'No'}
                styleSetup={this.props.styleSetup}
                onSubmitEditing={val => {
                  if (!val) return this.onChangeValue(null);
                  this.onChangeValue('No');
                }}
              />

              <Checkbox
                placeholder={'N/A'}
                text={value == 'N/A'}
                styleSetup={this.props.styleSetup}
                onSubmitEditing={val => {
                  if (!val) return this.onChangeValue(null);
                  this.onChangeValue('N/A');
                }}
              />
            </View>
          </View>

          <View style={{paddingBottom: 20, marginTop: 0}}>
            <View style={{flexDirection: 'row', maxWidth: 600}}>
                <View style={{width: '40%', marginRight: '5%'}}>
                  <Images
                    navigation={this.props.navigation}
                    type={'text'}
                    id={'image'}
                    placeholder={'Image'}
                    disabled={this.props.disabled}
                    images={this.props?.text?.image}
                    maxLimit={1}
                    styleSetup={this.props.styleSetup}
                    autoCorrect={false}
                    onSubmitEditing={v => this.onChangeImage(v)}
                  />
                </View>
             

              <TextInput
                style={[
                  style,
                  this.props.style,
                  this.props.disabled ? {backgroundColor: '#DDD'} : {},
                  {width: '50%', height: 44},
                ]}
                secureTextEntry={this.props.type == 'password'}
                autoCorrect={this.props.autoCorrect}
                autoCapitalize={this.props.autoCapitalize}
                keyboardType={'default'}
                onChangeText={text => this.onChangeText(text)}
                onBlur={this.onBlurMethod}
                onFocus={this.onFocus}
                editable={!this.props.disabled}
                numberOfLines={1}
                multiline={false}
                placeholder={'Comment'}
                placeholderTextColor={this.props.placeholderColor || '#B5B1B1'}
                value={text || ''}
              />
            </View>
          </View>

          {/*<TextInput
                        style={[style,this.props.style,this.props.disabled?{backgroundColor:'#DDD'}:{}]}
                        secureTextEntry={this.props.type=='password'}

                        autoCorrect={this.props.autoCorrect}
                        autoCapitalize={this.props.autoCapitalize}

                        keyboardType={this.props.keyboardType}
                        onChangeText={text => this.onChangeText(text)}
                        onBlur={this.onBlurMethod}
                        onFocus={this.onFocus}

                        editable={!this.props.disabled}
                        numberOfLines={this.props.numberOfLines}
                        multiline={this.props.numberOfLines>1}
                        placeholder={this.props.placetext}
                        placeholderTextColor={this.props.placeholderColor || '#B5B1B1'}

                        value={text}
                    />*/}
          {errorBar ? (
            <View style={{marginTop: -10}}>{errorBar}</View>
          ) : (
            undefined
          )}
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({});
