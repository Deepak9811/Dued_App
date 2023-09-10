/**
 * Created by jedrzej on 15/06/2020.
 */


import * as React from 'react';
import {  Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, Button, Image, TouchableOpacity } from 'react-native';
import { Link } from '@react-navigation/native';

import {Layout} from '../api/API';
import FeatherIcon from "react-native-vector-icons/Feather";

export default class Input extends React.Component {


    onChangeText = (text)=>{
        "use strict";


    }

    render = ()=>{
        "use strict";

        const {size} = this.props;

        let fontFamily = 'Overpass-Regular';
        let fontSize = 39/size;
        let lineHeight = 48/size;

        let textAlign = undefined;

        let colorRight = this.props.colorRight || '#2DB1F2' ;
        let letterSpacing = undefined;

        let bb = undefined;
        switch(size+''){
            case '1':
                fontFamily = 'Poppins-SemiBold';
                break;
            case '2':
                fontFamily = 'Sen-Regular';
                fontSize = 21
                lineHeight = 27;
                bb = (<View style={{width:40,height:2,backgroundColor:'#4A5677',position:'absolute',left:15,bottom:7}}></View>);
                break;
            case '3':
                fontFamily = 'Sen-Regular';
                fontSize = 23;
                lineHeight = 22;
                textAlign = 'center';
                letterSpacing = -0.5;
                break;
            case '4':
                fontSize = 16;
                lineHeight = 22.5;
                fontFamily = 'Roboto-Regular';
                break;
            case '-4':
                fontSize = 21;
                lineHeight = 23.5;
                fontFamily = 'Roboto-Regular';
                break;
            case '-3':
                fontSize = 24;
                lineHeight = 23.5;
                fontFamily = 'Roboto-Regular';
                break;
            case '5':
                fontSize = 15;
                lineHeight = 22.5;
                break;
            case '6':
                fontFamily = 'Overpass-Light';
                fontSize = 15;
                lineHeight = 22;
                break;
            case '7':
                fontFamily = 'Sen-Regular';
                fontSize = 18;
                lineHeight = 22;
                break;
        }

        let arrow = null;

        if(this.props.arrow){
            arrow = <Image source={require('../../assets/baselinearrowforward.png')} style={{marginTop:0,marginRight:-15,tintColor:'white',width:24,height:24,backgroundColor:'transparent'}} />;
        }

        const heading = <Text  ellipsizeMode={"tail"} numberOfLines={this.props.numberOfLines || 3}
                               style={Layout.textStyle(this.props.styleSetup,{flex:1,fontFamily,color: 'white',textAlign,letterSpacing,fontSize: fontSize,lineHeight: lineHeight})}>{this.props.children}</Text>;

        const rightText = this.props.rightText ? <TouchableOpacity onPress={this.props.rightOnPress}>
            <Text style={Layout.textStyle(this.props.styleSetup,{color:this.props.rightOnPress && colorRight,fontFamily:'Overpass-Regular',fontSize:17})}>{this.props.rightText}</Text>
        </TouchableOpacity>: undefined;

        const mainStyle = [{flexWrap:'wrap',width:'100%',flexDirection:'row',alignContent:'space-between',alignSelf:'flex-start',justifyContent:'center'},this.props.style];

        if(this.props.onReveal){
            const revealer = this.props.onReveal ? <FeatherIcon name={this.props.revealed ? 'eye' : 'eye-off'} size={22} color={'#FFFFFF'} style={{marginRight:20}}/> : undefined;

            return (<TouchableOpacity onPress={this.props.onReveal} style={mainStyle}>
                {revealer}
                {heading}
                {rightText}
                {arrow}
                {bb}
            </TouchableOpacity>);
        }

        return (<View style={mainStyle}>
            {heading}
            {rightText}
            {arrow}
            {bb}
        </View>);
    }

}
