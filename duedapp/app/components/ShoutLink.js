/**
 * Created by jedrzej on 15/06/2020.
 */


import * as React from 'react';
import {  Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, Button, TouchableOpacity } from 'react-native';

import {Layout} from '../api/API';

export default class Input extends React.Component {


    onChangeText = (text)=>{
        "use strict";


    }

    render = ()=>{
        "use strict";

        const {size} = this.props;

        return (<TouchableOpacity
            style={Layout.getElementStyle('shoutlink-button',{justifyContent:'space-between',alignSelf:'center'})}
            onPress={()=>this.props.onPress}>
            <Text style={Layout.getElementStyle('shoutlink-button-text-'+(size||'normal'),{alignSelf:'center',textTransform:'uppercase',letterSpacing: 1, color: 'white',fontSize: size=='small'?14:15})}>{this.props.label}</Text>
        </TouchableOpacity>);
    }

}