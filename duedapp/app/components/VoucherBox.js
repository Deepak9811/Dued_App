/**
 * Created by jedrzej on 30/05/2020.
 */


import * as React from 'react';
import {  Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, TouchableOpacity, Image } from 'react-native';

import {Layout, _} from '../api/API';
import { Link,CommonActions } from '@react-navigation/native';

import LinearGradient from 'react-native-linear-gradient';

import Button from '../components/Button';
import Heading from '../components/Heading';
import Para from '../components/Para';

export default class OfferBox extends React.Component {


    render = ()=>{


        return (<TouchableOpacity  onPress={()=>this.props.onPress && this.props.onPress(this.props.plan)} style={{flex:1,width:'100%',height:163,marginVertical:5,borderRadius:15,overflow:'hidden',justifyContent:'center',alignItems:'center',
        backgroundColor:'#0087CB'}}>

            <LinearGradient start={{x: 0, y: 0}} end={{x: 0, y: 1 }}
                            locations={[0.20,0.92]}
                            colors={['rgba(196,196,196,0.0)', '#0087CB' ]}
                            style={{ position:'absolute',left:0,right:0,bottom:0,height:50 }}
                >
            </LinearGradient>

            <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0 }}
                            locations={[0.40,0.50]}
                            colors={['rgba(196,196,196,0.0)', '#0087CB' ]}
                            style={{ position:'absolute',left:0,right:0,bottom:0,top:0 }}
                >
            </LinearGradient>
            {this.props.plan.limitExceeded+''=='1' ?  <View style={{position:'absolute',left:16,bottom:10}}>
                <Text style={{color:'red',fontSize:20,fontWeight:'bold',fontFamily: 'Overpass-Light'}}>USED</Text></View> : undefined}

            {this.props.plan.costText && <Button style={{position:'absolute',bottom:10,left:10}} type={"white-smaller"} label={this.props.plan.costText}  />}

            <View style={{position:'absolute','top':20,left:'55%',right:30,bottom:20,opacity:this.props.plan.limitExceeded+''=='1'?0.5:1.0,flexDirection:'column',justifyContent:'space-between',alignItems:'flex-start'}}>
                <Heading size={3} numberOfLines={5} style={{maxHeight:'80%'}} >{this.props.plan.name}</Heading>

                {/*<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                    <Image source={require('../../assets/qr-code.png')} /><Para style={{marginLeft:15,marginTop:2}} size={12}>{_("Tap to get\nThe Code.")}</Para>
                </View>*/}
                <Para size={13} style={{opacity:0.8}}>{this.props.plan.timeout}</Para>
            </View>


            <View style={{backgroundColor:'#161617',width:30,height:30,borderRadius:22,position:'absolute',left:-22,top:67}}></View>
            <View style={{backgroundColor:'#161617',width:30,height:30,borderRadius:22,position:'absolute',right:-22,top:67}}></View>
        </TouchableOpacity>);

    }

}