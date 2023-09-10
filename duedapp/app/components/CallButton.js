/**
 * Created by jedrzej on 30/05/2020.
 */


import * as React from 'react';
import {  Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, Button, TouchableOpacity } from 'react-native';

import {Layout} from '../api/API';
import { Link,CommonActions } from '@react-navigation/native';

export default class Input extends React.Component {


    onChangeText = (text)=>{
        "use strict";


    }

    render = ()=>{



        const style = Layout.getElementStyle('input-small-button-',{borderRadius:20,justifyContent:'center',
            flexDirection: 'row', alignItems: 'center',backgroundColor: 'transparent',borderColor:'#E1B625',borderWidth:1});

        const style2 = Layout.getElementStyle('input-small-button-text-',{alignSelf:'center',justifyContent:'center',
            flexDirection: 'row', alignItems: 'center',color: '#FFFFFF',fontSize: 12,
            letterSpacing: 1,padding:6,paddingLeft:0,paddingRight:0,width:60,textAlign:'center'});

        const txt = <Text style={[style2,this.props.subStyle]}>
                {this.props.label}
            </Text>;


        let obj ;
        if(this.props.link){
            obj = <View style={[style,this.props.style]}><Link to={this.props.link} style={[style2,this.props.subStyle]}>{txt}</Link></View>;
        }
        else {
            obj = <TouchableOpacity onPress={this.props.onPress} style={[style,this.props.style]}>{txt}</TouchableOpacity>;
        }



        return (obj);

    }

}