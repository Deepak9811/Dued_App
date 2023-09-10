/**
 * Created by jedrzej on 15/06/2020.
 */


import * as React from 'react';
import {  Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, Button, TouchableOpacity } from 'react-native';
import { Link } from '@react-navigation/native';

import {Layout} from '../api/API';

import Background from './Background'

export default class Loader extends React.Component {


    onChangeText = (text)=>{
        "use strict";


    }

    render = ()=>{
        "use strict";


        return (
            <Background page="Loading" ><Text style={{color:'white',marginTop:200,textAlign:'center'}}>LOADING...</Text></Background>);
    }

}