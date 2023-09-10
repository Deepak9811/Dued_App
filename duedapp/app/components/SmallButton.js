/**
 * Created by jedrzej on 30/05/2020.
 */


import * as React from 'react';
import {  Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, Button, TouchableOpacity, Image } from 'react-native';

import {Layout} from '../api/API';
import { Link,CommonActions } from '@react-navigation/native';

export default class Input extends React.Component {


    onChangeText = (text)=>{
        "use strict";


    }

    render = ()=>{
        let {type, selected, disabled} = this.props;

        let opacity = 1;
        let defaultBorderRadius = 20;
        let defaultBgColor = 'transparent';
        let defaultTextColor = 'white';
        let defaultBorderColor = '#E1B625';
        switch(type){
            case 'red-border':
                defaultTextColor = '#FFF';
                break;
            case 'red-small':
                defaultTextColor = 'white';
                defaultBgColor = 'darkred';
                defaultBorderColor = 'darkred';
                defaultTextColor = '#FFFFFF';
                break;
            case 'green-rounded':
                defaultTextColor = 'white';
                break;
            case 'green':
                defaultTextColor = 'white';
                defaultBorderRadius = 0;
                break;
            case 'dark':
                defaultTextColor = 'white';
                break;
            case 'dark-borderless':
                defaultTextColor = 'white';
                break;
            case 'black':
                defaultTextColor = 'black';
                break;
        }

        if(this.props.selected){
            defaultBgColor = '#96A825';
            defaultBorderColor = '#96A825';
        }


        const style = Layout.getElementStyle('input-small-button-',{borderRadius:10,justifyContent:'center',
            flexDirection: 'row', alignItems: 'center',backgroundColor: defaultBgColor,borderColor:defaultBorderColor,borderWidth:1});

        const style2 = Layout.getElementStyle('input-small-button-text-',{alignSelf:'center',justifyContent:'center',
            flexDirection: 'row', alignItems: 'center',color: defaultTextColor,fontSize: 12,fontFamily:'Poppins-Regular',
            letterSpacing: 1,padding:8});

        let txt = <Text style={[style2,this.props.subStyle]}>
            {this.props.label}
            </Text>;

        let obj ;

        if(this.props.selected){

            return <TouchableOpacity onPress={this.props.onPress} style={[style,this.props.style,{height:40,backgroundColor:defaultBgColor}]}>
                {/*<Image source={require('../../assets/bird2.png')} style={{width:20,height:20,tintColor:"white"}}  />*/}
            </TouchableOpacity>;
        }
        else if(this.props.icon){


            return <TouchableOpacity onPress={this.props.onPress} style={[style,this.props.style,{backgroundColor:'#E12525'}]}>
                {/*<Image source={require('../../assets/cancel.png')} style={{width:24,height:24,tintColor:"white"}}  />*/}
            </TouchableOpacity>;

        }

        if(this.props.link){
            obj = <View style={[style,this.props.style]}><Link to={this.props.link} style={[style2,this.props.subStyle]}>{txt}</Link></View>;
        }
        else {
            obj = <TouchableOpacity onPress={this.props.onPress} style={[style,this.props.style]}>{txt}</TouchableOpacity>;
        }



        return (obj);

    }

}