/**
 * Created by jedrzej on 30/05/2020.
 */


import * as React from 'react';
import {  Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, TouchableOpacity, Image } from 'react-native';

import {Layout,_} from '../api/API';
import { Link,CommonActions } from '@react-navigation/native';

import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image'

import Button from '../components/Button';
import Heading from '../components/Heading';
import AlertText from '../components/AlertText';
import Lock from '../components/Lock';

export default class OfferBox extends React.Component {


    render = ()=>{

        return (<TouchableOpacity  onPress={()=>this.props.onPress(this.props.plan)}
                                   style={{flex:1,width:237,height:290,marginHorizontal:5,borderRadius:15,overflow:'hidden',justifyContent:'center',alignItems:'center'}}>

            {this.props.plan.image_url ? <FastImage source={{uri:this.props.plan.image_url}} style={{width:'100%',minHeight:290,opacity:0.8}} />:undefined}
            {this.props.plan.shortdescription && this.props.plan.shortdescription.length>0 ?
                <Button style={{position:'absolute',top:5,right:5}} type={"gray-small"} label={this.props.plan.shortdescription}  />: null}

            <LinearGradient start={{x: 0, y: 0}} end={{x: 0, y: 1 }}
                            locations={[0.50,0.92]}
                            colors={['rgba(196,196,196,0.0)', 'rgba(196,196,196,1)' ]}
                            style={{ position:'absolute',left:0,right:0,bottom:0,height:50 }}
                >
            </LinearGradient>

            <View style={{position:'absolute','bottom':20,left:20,right:20}}>
            <Heading size={2}>{this.props.plan.name}</Heading>
            <Heading size={6} >{this.props.plan.text}</Heading>
                </View>
            {this.props.plan.locked && <Lock/>}
        </TouchableOpacity>);

    }

}