/**
 * Created by jedrzej on 29/05/2020.
 */


import * as React from 'react';
import {  Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, Button, Image } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import {Layout} from '../api/API';


export default class BackgroundView extends React.Component {


    render = ()=>{

        if(DeviceInfo.isTablet()){


        }

        return (
            <View style={{justifyContent: 'center',alignItems: 'center',}}><Image style={{marginTop:80,marginBottom:80}} source={Layout.getElementSource(this.props.img)} /></View>
        );

    }

}