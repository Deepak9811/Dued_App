/**
 * Created by jedrzej on 30/05/2020.
 */


import * as React from 'react';
import {  Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, TouchableOpacity, Image } from 'react-native';

import {Layout} from '../api/API';
import { Link,CommonActions } from '@react-navigation/native';

import LinearGradient from 'react-native-linear-gradient';

import FastImage from 'react-native-fast-image'

import Button from '../components/Button';

export default class Input extends React.Component {


    render = ()=>{


        return (<TouchableOpacity onPress={()=>this.props.onPress(this.props.plan)} style={{flex:1,width:100,height:120,marginHorizontal:5,borderRadius:15,overflow:'hidden',justifyContent:'center',alignItems:'center'}}>

            {this.props.plan.image_url ? <FastImage source={{uri:this.props.plan.image_url}} style={{width:'100%',minHeight:120,opacity:0.8}} /> : undefined}

            <LinearGradient start={{x: 0, y: 0}} end={{x: 0, y: 1 }}
                            locations={[0.50,0.92]}
                            colors={['rgba(196,196,196,0.0)', 'rgba(196,196,196,1)' ]}
                            style={{ position:'absolute',left:0,right:0,bottom:0,height:50 }}
                >
                </LinearGradient>
            <Button style={{position:'absolute',bottom:5,left:5,right:5}} type={"white-small"} label={this.props.plan.name} onPress={()=>this.props.onPress(this.props.plan)} />
        </TouchableOpacity>);

    }

}