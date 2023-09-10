/**
 * Created by jedrzej on 15/06/2020.
 */


import * as React from 'react';
import {  Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, Button } from 'react-native';
import { Link } from '@react-navigation/native';

import {Layout} from '../api/API';

export default class Input extends React.Component {


    onChangeText = (text)=>{
        "use strict";


    }

    render = ()=>{
        "use strict";


        return (
            <View
                style={Layout.getElementStyle('multilink',{flexDirection:'row',justifyContent:'space-around',paddingTop:20,paddingBottom: 20})}
                onPress={text => this.props.onPress}>
                <Link to={this.props.link}>
                    <Text style={Layout.getElementStyle('multilink-text',{color:'white',fontSize:15})}>
                        {this.props.label+' '}
                        <Text style={Layout.getElementStyle('multilink-text-punchline',{color:'#E1B625',textDecorationLine:'underline',fontSize:15})}>{this.props.punchline}</Text>
                    </Text>
                </Link>
            </View>);
    }

}