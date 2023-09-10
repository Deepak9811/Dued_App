/**
 * Created by jedrzej on 29/05/2020.
 */


import * as React from 'react';
import {  Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput,  Image,ScrollView } from 'react-native';

import {Layout} from '../api/API';

import Button from './SmallButton'


export default class Optioned extends React.Component {



    render = ()=>{

        let fontSize = 26;

        let fontWeight = 'bold';
        switch(this.props.level){
            case 1:
                fontSize = 24; fontWeight = '600'; break;
            case 2:
                fontSize = 20; fontWeight = 'normal'; break;
        }

        return (!this.props.options || this.props.options.length==0?[]:<View style={{flexDirection:'row',marginTop:40,marginBottom:20}}><Text style={{flex:2,color:'white',fontWeight:fontWeight,fontSize:fontSize}}>{this.props.title}</Text>
            {this.props.onPress?<Button style={{flex:1}} onPress={this.props.onPress} label={"View All"} mode="dark-mark"></Button>:null}</View>);

    }

}