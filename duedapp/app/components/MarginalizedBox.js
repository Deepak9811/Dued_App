/**
 * Created by jedrzej on 15/06/2020.
 */


import * as React from 'react';
import {  Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {Layout} from '../api/API';
import Button from './Button'
import ShoutLink from './ShoutLink'

export default class Input extends React.Component {


    onChangeText = (text)=>{
        "use strict";


    }

    render = ()=>{
        "use strict";


        return (

            <View style={{paddingTop:100,zIndex:1}}>

                <LinearGradient colors={['rgba(150,168,37,0.0)', 'rgba(150,168,37,0.8)', 'rgba(150,168,37,1.0)']}
                                style={{zIndex:1,height:400,position:'absolute',bottom: 0,left:0, right: 0}}>

                </LinearGradient>


                <View style={{zIndex:10,backgroundColor:'rgba(0,0,0,0.2)',borderTopLeftRadius:20,borderTopRightRadius:20,height:190,position:'absolute',bottom: 0,left:0, right: 0}}>

                    <View style={{paddingLeft: 30,paddingRight:30}}>

                        <View style={{paddingTop: 20,paddingBottom: 0}}>
                            <ShoutLink label={this.props.subtitle} size="small"
                                       onPress={this.props.onPress}/>
                        </View>
                        <Button
                            style={{zIndex:1000,marginTop:20}}
                            link={this.props.link}
                            onPress={this.props.onPress}
                            mode="dark"
                            label={this.props.button}
                            />

                    </View>
                </View>



            </View>);
    }

}