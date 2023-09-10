/**
 * Created by jedrzej on 15/06/2020.
 */


import * as React from 'react';
import {  Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import {Layout} from '../api/API';

export default class Quantities extends React.Component {


    constructor(props) {
        super(props);
        this.state = {quantity: this.props.quantity || 0};
    }

    componentDidUpdate(prevProps, prevState) {

        if (this.props.quantity !== prevState.quantity) {
            this.setState({quantity:this.props.quantity});
        }
    }

    changeDown = ()=>{
        if(this.state.quantity>0){
            let nq = Math.max(this.props.min,this.state.quantity-1);
            this.setState({quantity: nq},()=>this.props.onChange(nq));
        }
    }
    changeUp = ()=>{

        if(this.state.quantity<99){
            let nq = Math.min(this.props.max,this.state.quantity+1);
            this.setState({quantity: nq,random:Math.random()},()=>this.props.onChange(nq));
        }
    }

    render = ()=>{


        return (<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginLeft:20,marginRight:20,}}>
            <TouchableOpacity onPress={this.changeDown} style={{width:30,height:30,borderRadius:30,backgroundColor:'white',justifyContent:'center'}}>
                <Text style={{color:'#17254D',textAlign:'center'}}>-</Text>

            </TouchableOpacity>
            <Text style={{color:'white',marginLeft:10,marginRight:10,width:20,textAlign:'center'}}>{this.state.quantity}</Text>
            <TouchableOpacity onPress={this.changeUp} style={{width:30,height:30,opacity:this.state.quantity<this.props.max?1:0.5,borderRadius:30,backgroundColor:'white',justifyContent:'center'}}>
                <Text style={{color:'#17254D',textAlign:'center'}}>+</Text>


            </TouchableOpacity>

        </View>);
    }

}
