

import React from 'react';

import {
    SafeAreaView,
    StyleSheet,
    ScrollView,TouchableOpacity,
    View,
    Text,Image,
    StatusBar,
} from 'react-native';

import APIEvents from '../api/APIEvents';
import {API} from '../api/API';

export default   ({ navigation }) => ({
    headerTransparent: true,
    headerBackTitleVisible: false,
    headerShown: true,
    headerTitleAlign: 'center',

    headerStyle: {
        shadowRadius: 0,
        shadowOffset: {
            height: 0,
        },
    },
    cardStyle: {
        backgroundColor:'transparent',
        shadowRadius: 0,
        shadowOffset: {
            height: 0,
        },
    },
    headerTitle: ()=>{
        return <TouchableOpacity onPress={()=>APIEvents.call('menuOpen')} style={{
        width:164,marginTop:30,height:80,backgroundColor:'transparent',zIndex:22}}>
        </TouchableOpacity>
    },
    headerLeft: () => {

        if(navigation.canGoBack()){

            return (<TouchableOpacity onPress={()=>navigation.goBack()} style={{padding:14,paddingTop:32,backgroundColor:'transparent'}}>
                    <Image source={require('../../assets/Back.png')} style={{backgroundColor:'transparent',width:24, height:24}} /></TouchableOpacity>
            );

        }
        return null;
    },

});