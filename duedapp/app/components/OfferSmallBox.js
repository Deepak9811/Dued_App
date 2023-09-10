/**
 * Created by jedrzej on 30/05/2020.
 */


import * as React from 'react';
import {  Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, TouchableOpacity, Image } from 'react-native';

import {Layout,_} from '../api/API';
import { Link,CommonActions } from '@react-navigation/native';

import LinearGradient from 'react-native-linear-gradient';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FastImage from 'react-native-fast-image'

import Button from '../components/Button';
import Heading from '../components/Heading';
import AlertText from '../components/AlertText';

export default class OfferBox extends React.Component {


    render = ()=>{


        return (<TouchableOpacity  onPress={()=>this.props.onPress(this.props.plan)} style={{flex:1,width:'50%',height:200,marginHorizontal:5,borderRadius:15,overflow:'hidden',justifyContent:'center',alignItems:'center'}}>

            {this.props.plan.image_url ? <FastImage source={{uri:this.props.plan.image_url}} style={{width:'100%',minHeight:290,opacity:0.8}} />: undefined}



            <FeatherIcon style={{position:'absolute',top:10,right:10}} name={ 'heart'} size={22} color={this.props.plan.liked?'#0087CB':'#FFF'} />


            <LinearGradient start={{x: 0, y: 0}} end={{x: 0, y: 1 }}
                            locations={[0.50,0.92]}
                            colors={['rgba(196,196,196,0.0)', 'rgba(196,196,196,1)' ]}
                            style={{ position:'absolute',left:0,right:0,bottom:0,height:50 }}
                >
            </LinearGradient>

            <View style={{position:'absolute','bottom':20,left:20,right:20}}>
            <Heading size={3}>{this.props.plan.name}</Heading>
            <Heading size={6}>{this.props.plan.shortdescription}</Heading>
                </View>
            {!this.props.inactive && this.props.plan.locked && <View style={{position:'absolute', left: 0, top: 0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.6)',
                flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                <AlertText size={2} style={{alignItems:'center',marginTop:10}}>{_("Locked")}</AlertText>

            </View>}
        </TouchableOpacity>);

    }

}