/**
 * Created by jedrzej on 29/05/2020.
 */


import * as React from 'react';
import {  Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, Button, Image } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import {Layout} from '../api/API';


export default class Container extends React.Component {



    render = ()=>{


        return (<View style={[{marginTop:50,marginLeft:30,marginRight:30,zIndex:10},this.props.style]}>{this.props.children}</View>);

    }

}