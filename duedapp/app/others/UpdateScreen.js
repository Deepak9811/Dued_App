import React, {useEffect} from 'react';
import {
  Image,
  Linking,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import SplashScreen from 'react-native-splash-screen';

const URL =
  Platform.OS === 'ios'
    ? 'https://apps.apple.com/us/app/dued-app/id1554995017?platform=iphone'
    : 'https://play.google.com/store/apps/details?id=co.uk.dued';

const UpdateScreen = () => {
  const onPressUpdateHandler = async () => {
    await Linking.openURL(URL);
  };

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Modal visible={true} animationType="slide">
      <View style={styles.root}>
        <View style={styles.image_container}>
          <Image
            source={require('../../icon/dued_logo.png')}
            style={styles.image}
          />
        </View>
        <View style={styles.information_container}>
          <Text style={styles.info_text_title}>Time to update !</Text>
          <Text style={styles.info_text_description}>
            We have added lots of new features and fixed some bugs to make your
            experience as smooth as possible
          </Text>
        </View>
        <View style={styles.button_outer_container}>
          <TouchableOpacity
            style={styles.btn_container}
            onPress={onPressUpdateHandler}>
            <Text style={styles.btn_text}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default UpdateScreen;

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#000c2f',
    flex: 1,
  },
  image_container: {
    flex: 0.5,
    justifyContent: 'center',
    overflow: 'hidden',
    alignItems: 'center',
    paddingTop: 8,
  },
  image: {
    // marginTop: 10,
    width: 320,
    height: 320,
    overflow: 'hidden',
  },
  information_container: {
    flex: 0.2,
    justifyContent: 'center',
    // backgroundColor: 'orangered',
    alignItems: 'center',
  },
  info_text_title: {
    color: '#f7f7f7',
    fontWeight: 'bold',
    fontSize: 22,
  },
  info_text_description: {
    color: '#f7f7f7',
    fontWeight: '400',
    fontSize: 15,
    paddingHorizontal: 8.5,
    marginTop: 8,
  },
  button_outer_container: {
    flex: 0.3,
    // backgroundColor: 'pink',
    alignItems: 'center',
  },
  btn_container: {
    backgroundColor: '#0087CB',
    alignItems: 'center',
    width: 250,
    padding: 10,
    marginTop: 15,
    borderRadius: 10,
  },
  btn_text: {
    fontWeight: '800',
    fontSize: 19,
    color: '#f7f7f7',
    textTransform: 'uppercase',
  },
});
