/**
 * Created by jedrzej on 15/06/2020.
 */


import * as React from 'react';
import {  Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, Button, TouchableOpacity } from 'react-native';
import { Link } from '@react-navigation/native';

import {Layout} from '../api/API';

export default class Input extends React.Component {


    onChangeText = (text)=>{
        "use strict";


    }

    render = ()=>{
        "use strict";

        const {size} = this.props;

        return (<Link
            style={[{paddingTop:30,paddingBottom: 20,justifyContent:'space-between',alignSelf:'center'},this.props.style]}
            to={this.props.link}>
            <Text style={{fontFamily:'Overpass-Regular',alignSelf:'center',color: 'white',fontSize: size=='small'?16:16}}>{this.props.label}</Text>
        </Link>);
    }

}