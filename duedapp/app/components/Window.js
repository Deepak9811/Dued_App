/**
 * Created by jedrzej on 30/05/2020.
 */


import * as React from 'react';
import {  Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, TouchableOpacity, Image } from 'react-native';

import {Layout} from '../api/API';
import { Link,CommonActions } from '@react-navigation/native';

import LinearGradient from 'react-native-linear-gradient';

import Button from '../components/Button';
import setup from '../../settings';

export default class Input extends React.Component {


    render = ()=>{


        return (<View style={{marginTop:-19 }}>


            <LinearGradient start={{x: 0, y: 0}} end={{x: 0, y: 0.7 }}
                            locations={[0,0.5]}
                            colors={setup.layout.windowGradient}
                            style={{ position:'absolute',top:0,left:0,right:0,flex: 1,marginTop:0,borderRadius:20,height:50,width: '100%' }}
                >
                </LinearGradient>

            <View style={{backgroundColor:setup.layout.windowBg,marginTop:20}}>
                {this.props.children}

            </View>

        </View>);

    }

}