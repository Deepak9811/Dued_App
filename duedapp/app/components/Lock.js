/**
 * Created by jedrzej on 22/03/2021.
 */

import * as React from 'react';

import {  Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, TouchableOpacity, Image } from 'react-native';

import { _ } from '../api/API';
import AlertText from '../components/AlertText';

module.exports = (props)=>{
    return (<View style={{position:'absolute', left: 0, top: 0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.6)',
                flexDirection:'column',justifyContent:'center',alignItems:'center'}}>


        <View style={{marginTop:4}}>
        {props.costText ? <AlertText size={2} style={{alignItems:'center'}} subText={props.costText}>{_("Unlock")}</AlertText> :
            <AlertText size={2} style={{alignItems:'center',marginTop:10}}>{_("Locked")}</AlertText>}
</View>

    </View>);
}