/**
 * Created by jedrzej on 15/06/2020.
 */


import * as React from 'react';
import {  Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import {Layout} from '../api/API';

export default class Description extends React.Component {


    onChangeText = (text)=>{


    }

    render = ()=>{


        return (<View style={[{ backgroundColor: '#3e403f',marginTop:-10,width:1,height:42,opacity: 0.6,},this.props.style]}></View>);
    }

}