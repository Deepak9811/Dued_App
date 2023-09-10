/**
 * Created by jedrzej on 15/06/2020.
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
        "use strict";
        let {mode} = this.props;
        if(!mode) mode = 'normal';

        const style = Layout.getElementStyle('input-button-'+mode,{borderRadius:20,backgroundColor: mode=='dark'?'#323231':'white',justifyContent:'space-between'});

        const style2 = Layout.getElementStyle('input-button-text-'+mode,{alignSelf:'center',color: mode=='dark'?'white':'#323231',fontSize: 15,letterSpacing: 3, textTransform:'uppercase',padding:16});
        const txt = <Text style={style2}>
                {this.props.label}
            </Text>;


        let obj ;
        if(this.props.link){
            obj = <View style={style}><Link to={this.props.link} style={style2}>{txt}</Link></View>;
        }
        else {
            obj = <TouchableOpacity onPress={this.props.onPress} style={style}>{txt}</TouchableOpacity>;
        }



        return (obj);

    }

}