

import React from 'react';

import {
    SafeAreaView,
    StyleSheet,
    ScrollView,TouchableOpacity,
    View,Button,
    Text,Image,
    StatusBar,
} from 'react-native';

import APIEvents from '../api/APIEvents';
import {API} from '../api/API';


export default  ({ navigation }) => ({
    headerTransparent: false,
    headerBackTitleVisible: false,
    headerShown:false,

    gesturesEnabled: false,

    cardStyle: {
        backgroundColor:'transparent',
        shadowColor: 'transparent',
        shadowRadius: 0,
        opacity: 1,
        shadowOffset: {
            height: 0,
        },
    },
});