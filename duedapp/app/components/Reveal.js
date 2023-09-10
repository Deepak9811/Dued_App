/**
 * Created by jedrzej on 15/06/2020.
 */


import * as React from 'react';
import {  Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, Image, TouchableOpacity } from 'react-native';
import { Link } from '@react-navigation/native';

import {Layout} from '../api/API';

export default class Input extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            revealed: false
        };

    }
    reveal = ()=>{


        this.setState({revealed:!this.state.revealed},()=>this.props.onReveal && this.props.onReveal());


    }



    render = ()=>{


        return (<View style={[this.props.style]}>
            <TouchableOpacity onPress={this.reveal} style={{marginTop:this.props.marginTop||15,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
            <Text style={{color:'white',width:'80%'}}>{this.props.label}</Text>


                {/*<Image source={this.state.revealed?require('../../assets/Minus.png'):require('../../assets/Plus.png')} style={{margin:10,width:20,height:20}}/>*/}

        </TouchableOpacity>


            {this.state.revealed && <Text style={[{fontFamily: 'Overpass-Regular',color: 'white',fontSize: 12,lineHeight: 12}]}>{this.props.children}</Text>}

        </View>);

    }

}