import * as React from 'react';
import {
  Alert,
  Image,
  Modal,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import TextBox from 'react-native-password-eye';
import SignatureCapture from 'react-native-signature-capture';
import FeatherIcon from 'react-native-vector-icons/Feather';

import DateTimePicker from '@react-native-community/datetimepicker';
import RNFS from 'react-native-fs';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import ImageResizer from 'react-native-image-resizer';
const moment = require('moment');

import {Layout} from '../api/API';

import Button from '../components/Button';
import Heading from './Heading';
import Para from './Para';

export default class Images extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: this.props.images || [],
      showOption: false,
    };
  }

  componentDidMount() {
    console.log('image check :-> 1 ', this.state.images);
  }

  onChangeText = text => {
    'use strict';
    this.setState({text});

    this.props.onSubmitEditing(text);
  };

  componentDidUpdate(prevProps, prevState) {
    /*if (this.props.text && this.props.text !== prevState.text) {
            this.setState({text:this.props.text});
        }*/
  }

  saveSignature = () => {
    this.sign.saveImage();
  };

  selectOption = () => {
    // this.props.mediaOption(true);

    this.setState({
      showOption: true,
    });

    // return (
    //   <View>
    //     <View
    //       style={{position: 'absolute', elevation: 1, backgroundColor: 'black'}}
    //     />
    //     <View
    //       style={{
    //         position: 'absolute',
    //         elevation: 5,
    //         backgroundColor: 'white',
    //         width: '10%',
    //       }}>
    //       <View>
    //         <TouchableOpacity>
    //           <Text>Take Photo...</Text>
    //         </TouchableOpacity>
    //       </View>

    //       <View>
    //         <TouchableOpacity>
    //           <Text>Choose from Library...</Text>
    //         </TouchableOpacity>
    //       </View>
    //     </View>

    //     <View>
    //       <TouchableOpacity>
    //         <Text>Choose from Library</Text>
    //       </TouchableOpacity>
    //     </View>
    //   </View>
    // );
  };

  showImagePicker = async value => {
    this.setState({
      showOption: false,
    });

    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'App Camera Permission',
            message: 'App needs access to your camera ',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permission given');
        } else {
          console.log('Camera permission denied');

          if (value === 1) {
            Alert.alert(
              'Alert!',
              `We're unable to connect to your camera. Please provide the camera access.`,
              [{text: 'Ok'}],
              {cancelable: true},
            );
            return;
          }
        }
      } catch (err) {
        console.warn(err);
      }
    }

    const options = {
      mediaType: 'photo',
      includeBase64: true,
      quality: 0.4,
      maxWidth: 800,
      maxHeight: 800,
    };
    if (value === 1) {
      launchCamera(options, response => {
        console.log('response :->>>>> ', response);
        if (response.didCancel) {
          console.log('showImagePicker User cancelled image picker');
        } else if (response.error) {
          console.log('showImagePicker ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log(
            'showImagePicker User tapped custom button: ',
            response.customButton,
          );
        } else {
          let urix = (response.uri + '').split('/');
          delete urix[urix.length - 1];

          console.log('showImagePicker hi resp', response.uri, urix.join('/'));
          this.state.images.push(response.base64);
          this.setState({random: Math.random()});

          this.props.onSubmitEditing(this.state.images);
        }
      });
    } else if (value === 2) {
      launchImageLibrary(options, response => {
        console.log('response :->>>>> ', response);
        if (response.didCancel) {
          console.log('showImagePicker User cancelled image picker');
        } else if (response.error) {
          console.log('showImagePicker ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log(
            'showImagePicker User tapped custom button: ',
            response.customButton,
          );
        } else {
          let urix = (response.uri + '').split('/');
          delete urix[urix.length - 1];

          console.log('showImagePicker hi resp', response.uri, urix.join('/'));
          this.state.images.push(response.base64);
          this.setState({random: Math.random()});
          // // console.log('ssx',this.state.images.length,'ggg',b64);

          this.props.onSubmitEditing(this.state.images);
          // this.resizeData(response, urix);
        }
      });
    }
  };

  resizeData = (response, urix) => {
    // console.log('showImagePicker hi resp', response, urix.join('/'));
    ImageResizer.createResizedImage(
      response.base64,
      800,
      800,
      'JPEG',
      50,
      undefined,
      Platform.OS == 'android' ? undefined : urix.join('/'),
      true,
      {onlyScaleDown: true},
    )
      .then(async response => {
        console.log('showImagePicker hi resp 2 ;->>> ', response.uri);
        // return;

        const b64 = await RNFS.readFile(response.uri, 'base64');
        console.log('base 64 :->> ', b64);

        // response.uri is the URI of the new image that can now be displayed, uploaded...
        // response.path is the path of the new image
        // response.name is the name of the new image with the extension
        // response.size is the size of the new image

        this.state.images.push(b64);
        this.setState({random: Math.random()});
        // console.log('ssx',this.state.images.length,'ggg',b64);

        this.props.onSubmitEditing(this.state.images);
      })
      .catch(err => {
        console.log('showImagePicker err', err);
        // Oops, something went wrong. Check that the filename is correct and
        // inspect err to get more details.
      });
  };

  removeImage = i => {
    this.state.images.splice(i, 1);
    this.setState({random: Math.random()});

    this.props.onSubmitEditing(this.state.images);
  };

  render = () => {
    'use strict';

    const {maxLimit} = this.props;

    let errorBar = undefined;

    if (this.props.error) {
      errorBar = (
        <Para
          size={5}
          style={Layout.textStyle(this.props.styleSetup, {
            color: 'red',
            marginHorizontal: 10,
            marginBottom: 20,
          })}>
          {this.props.error}
        </Para>
      );
    }

    const style = {
      fontFamily: 'Roboto-Regular',
      fontSize: 17,
      height: this.props.numberOfLines > 1 ? this.props.numberOfLines * 33 : 60,
      marginTop: 0,

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

    let images = [];
    // alert(this.state.images)

    for (let i in this.state.images) {
      images.push(
        <TouchableOpacity
          onPress={() => this.removeImage(i)}
          style={{width: 100, height: 100, backgroundColor: 'transparent'}}
          key={'img' + i}>
          <Image
            source={{
              uri: `data:image/jpg;base64,${this.state.images[i]}`,
            }}
            resizeMode="contain"
            style={{
              width: 100,
              height: 100,
              backgroundColor: 'white',
              borderRadius: 15,
            }}
          />
        </TouchableOpacity>,
      );
    }
    // console.log(maxLimit, 'maxLimit')
    // console.log(images, 'images')

    if (maxLimit == 1) {
      return (
        <>
          {/*  */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.showOption}
            onRequestClose={() => {
              this.setState({
                showOption: false,
              });
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 22,
                backgroundColor: 'rgba(0,0,0,0.4)',
              }}>
              <View
                style={{
                  margin: 30,
                  marginBottom: 1,
                  width: '100%',
                  padding: 20,
                  paddingBottom: 10,
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: '#fff',
                    width: '90%',
                    borderRadius: 5,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5,
                  }}>
                  <View
                    style={{
                      paddingVertical: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: '#ddd',
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{color: '#AEAEAE'}}>Select</Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      paddingVertical: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: '#ddd',
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      // alert('camera');
                      this.setState({
                        showOption: false,
                      });
                      setTimeout(() => {
                        this.showImagePicker(1);
                      }, 500);
                    }}>
                    <Text style={{fontSize: 18, color: '#1376dc'}}>
                      Take Photo...
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      paddingVertical: 10,
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 5,
                    }}
                    onPress={() => {
                      // alert('gallery');
                      this.setState({
                        showOption: false,
                      });
                      setTimeout(() => {
                        this.showImagePicker(2);
                      }, 500);
                    }}>
                    <Text style={{fontSize: 18, color: '#1376dc'}}>
                      Choose from Library...
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  margin: 20,
                  width: '90%',
                  padding: 20,
                  alignItems: 'center',

                  marginTop: 0,
                  paddingTop: 1,
                }}>
                <TouchableOpacity
                  style={{
                    paddingVertical: 10,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5,
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    this.setState({
                      showOption: false,
                    });
                  }}>
                  <Text style={{fontWeight: 'bold', color: '#1376dc'}}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View style={{marginTop: 0, marginBottom: 0}}>
            <View style={{flexDirection: 'row', marginBottom: 0}}>
              {images}
            </View>

            {images.length < 1 ? (
              <Button
                disabled={this.state.images.length > 5}
                type={'black-wide'}
                onPress={() => {
                  this.selectOption();
                }}
                label={'Add image'}
              />
            ) : (
              undefined
            )}

            {errorBar}
          </View>
        </>
      );
    }

    return (
      <View style={{marginTop: 10, marginBottom: 30}}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showOption}
          onRequestClose={() => {
            this.setState({
              showOption: false,
            });
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 22,
              backgroundColor: 'rgba(0,0,0,0.4)',
            }}>
            <View
              style={{
                margin: 30,
                marginBottom: 1,
                width: '100%',
                padding: 20,
                paddingBottom: 10,
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: '#fff',
                  width: '90%',
                  borderRadius: 5,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5,
                }}>
                <View
                  style={{
                    paddingVertical: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: '#ddd',
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{color: '#AEAEAE'}}>Select</Text>
                </View>
                <TouchableOpacity
                  style={{
                    paddingVertical: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: '#ddd',
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    // alert('camera');
                    this.setState({
                      showOption: false,
                    });
                    setTimeout(() => {
                      this.showImagePicker(1);
                    }, 500);
                  }}>
                  <Text style={{fontSize: 18, color: '#1376dc'}}>
                    Take Photo...
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    paddingVertical: 10,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 5,
                  }}
                  onPress={() => {
                    // alert('gallery');
                    this.setState({
                      showOption: false,
                    });
                    setTimeout(() => {
                      this.showImagePicker(2);
                    }, 500);
                  }}>
                  <Text style={{fontSize: 18, color: '#1376dc'}}>
                    Choose from Library...
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                margin: 20,
                width: '90%',
                padding: 20,
                alignItems: 'center',

                marginTop: 0,
                paddingTop: 1,
              }}>
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5,
                  borderRadius: 5,
                }}
                onPress={() => {
                  this.setState({
                    showOption: false,
                  });
                }}>
                <Text style={{fontWeight: 'bold', color: '#1376dc'}}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Text
          style={Layout.textStyle(this.props.styleSetup, {
            fontFamily: 'Roboto-Regular',
            color: 'white',
            marginBottom: 10,
            fontSize: 17,
          })}>
          {this.props.placeholder}
        </Text>

        {images && images.length > 0 ? (
          <View style={{flexDirection: 'row', marginTop: 10, marginBottom: 30}}>
            {images}
          </View>
        ) : (
          undefined
        )}

        {!maxLimit || !images || images.length < maxLimit ? (
          <Button
            disabled={this.state.images.length > 5}
            type={'black-wide'}
            onPress={() => {
              this.selectOption();
            }}
            label={'Add image'}
          />
        ) : (
          undefined
        )}

        {errorBar}
      </View>
    );
  };
}

const styles = StyleSheet.create({});
