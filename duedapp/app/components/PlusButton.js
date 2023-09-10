/**
 * Created by jedrzej on 30/05/2020.
 */


import * as React from 'react';
import {  Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, Button, TouchableOpacity, Image } from 'react-native';

import {Layout} from '../api/API';
import { Link,CommonActions } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';


import APIEvents from '../api/APIEvents';

export default class Input extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: true
        }

    }

    onChangeText = (text)=>{
        "use strict";


    }


    componentWillUnmount () {

        APIEvents.removeListener('currentTaskHaveAddButton','AddButton');
    }

    componentDidMount = async ()=>{


        APIEvents.addListener('currentTaskHaveAddButton','AddButton',async (op)=>{

            this.setState({visible:op});

        });

    }

    render = ()=>{
        "use strict";
        let {type, selected, disabled} = this.props;

        if(!this.state.visible){
            return <View></View>;
        }

        if(!type) type = 'normal';


        let opacity = 1;
        let defaultBorderRadius = 33;
        let defaultBgColor = '#0974DB';
        let defaultTextColor = '#FFF';
        let defaultBorderColor = '#0974DB';
        let fontSize = 23;
        let fontFamily = 'Sen-Regular';
        let padding = 16;
        let letterSpacing = 0;
        let paddingH = 16;
        switch(type){
            case 'stealth':
                defaultBgColor = 'transparent';
                defaultBorderColor = 'transparent';
                defaultTextColor = '#707070';
                fontFamily = 'Sen-Regular';
                padding = 3;
                paddingH = 3;
                fontSize = 12;
                break;
            case 'white-small':
                defaultBgColor = '#FFFFFF';
                defaultBorderColor = '#FFFFFF';
                defaultTextColor = '#707070';
                fontFamily = 'Sen-Regular';
                padding = 3;
                paddingH = 3;
                fontSize = 12;
                break;
            case 'gray-small':
                defaultBgColor = '#707070';
                defaultBorderColor = '#707070';
                defaultTextColor = '#FFFFFF';
                fontFamily = 'Sen-Regular';
                padding = 3;
                paddingH = 13;
                fontSize = 12;
                break;
            case 'white-smaller':
                defaultBgColor = '#FFFFFF';
                defaultBorderColor = '#FFFFFF';
                defaultTextColor = '#707070';
                fontFamily = 'Sen-Regular';
                padding = 3;
                paddingH = 8;
                fontSize = 10;
                break;
            case 'red-small':
                defaultBgColor = 'darkred';
                defaultBorderColor = 'darkred';
                defaultTextColor = '#FFFFFF';
                fontFamily = 'Sen-Regular';
                padding = 3;
                paddingH = 13;
                fontSize = 12;
                break;
            case 'black-small':
                defaultBgColor = 'transparent';
                defaultBorderColor = '#FFFFFF';
                defaultTextColor = '#FFFFFF';
                fontFamily = 'Sen-Regular';
                padding = 10;
                paddingH = 14;
                fontSize = 12;
                break;
            case 'blue':
                defaultBgColor = '#0087CB';
                defaultBorderColor = '#0087CB';
                defaultTextColor = '#FFFFFF';
                fontFamily = 'Sen-Regular';
                padding = 10;
                paddingH = 10;
                fontSize = 13;
                letterSpacing=1;
                break;

            case 'blue-smaller-wide':
                defaultBgColor = '#0087CB';
                defaultBorderColor = '#0087CB';
                defaultTextColor = '#FFFFFF';
                fontFamily = 'Sen-Regular';
                padding = 10;
                paddingH = 50;
                fontSize = 15;
                letterSpacing=1;
                break;




            case 'black-wide':
                defaultBgColor = 'transparent';
                defaultBorderColor = '#FFFFFF';
                defaultTextColor = '#FFFFFF';
                fontFamily = 'Sen-Regular';
                padding = 10;
                paddingH = 20;
                fontSize = 15;
                letterSpacing=1;
                break;
            case 'black':
                defaultBgColor = 'transparent';
                defaultBorderColor = '#FFFFFF';
                defaultTextColor = '#FFFFFF';
                fontFamily = 'Sen-Regular';
                padding = 10;
                paddingH = 10;
                fontSize = 13;
                letterSpacing=1;
                break;
        }

        if(disabled){
            opacity = 0.5;
        }

        const selectedStyle = selected ? {backgroundColor:'#E1B625'} : {};

        const style = {borderRadius:defaultBorderRadius,justifyContent:'center',flexDirection: 'row', alignItems: 'center',
                backgroundColor: defaultBgColor, borderColor: defaultBorderColor, borderWidth: 1, opacity};

        const style2 = {alignSelf:'center',justifyContent:'center', flexDirection: 'row', alignItems: 'center', padding:padding , paddingHorizontal: paddingH};


        const style3 = {
            fontFamily,
            alignSelf:'center',justifyContent:'center', flexDirection: 'row', alignItems: 'center',
                color: defaultTextColor,fontSize,
                letterSpacing: letterSpacing};


        let icon = null;
        if(this.props.icon){
            icon = <Image source={this.props.icon} style={{tintColor:this.props.iconColor || defaultTextColor,maxWidth:16,maxHeight:16,resizeMode:'contain',marginRight:8}} />
        }

        if(this.props.iconF){
            icon = <FeatherIcon name={this.props.iconF} size={fontSize*1.4} color={this.props.iconColor || defaultTextColor} style={{marginRight:10,marginLeft:0}}/>;
        }

        const txt = <View style={[style2,this.props.subStyle]}>
            {icon}<Text style={[style3,this.props.textStyle]}>{this.props.label}</Text>
            </View>;


        let obj ;
        if(this.props.link){
            obj = <View style={[style,selectedStyle,this.props.style]}>
                <Link to={this.props.link} style={[style2,this.props.subStyle]}>
                    {txt}
                </Link>
            </View>;
        }
        else {
            obj = <TouchableOpacity
                disabled={disabled}
                onPress={disabled ? ()=>{} : this.props.onPress}
                style={[style,selectedStyle,this.props.style]}>
                {txt}
            </TouchableOpacity>;
        }



        return (obj);

    }

}