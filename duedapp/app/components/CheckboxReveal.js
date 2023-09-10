/**
 * Created by jedrzej on 15/06/2020.
 */


import * as React from 'react';
import {  Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

import {Layout} from '../api/API';
import Para from "./Para";
import FeatherIcon from 'react-native-vector-icons/Feather';

export default class Input extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            revealed: props.revealState
        };

    }

    onChangeText = (text)=>{


    }

    render = ()=>{

        let errorBar = undefined;
        if(this.props.error){

            errorBar = <View style={{}}><Para size={5} style={{color:'red',marginHorizontal:10,marginBottom:20}}>{this.props.error}</Para></View>;

        }
//console.log('hi reveal',this.props.text);


        return (<View>
            <TouchableOpacity style={{backgroundColor:'transparent',flexDirection:'row',justifyContent:'space-between',flex:1,marginBottom:20}} onPress={()=>{

                const newRev = !this.state.revealed;

                this.props.onSubmitEditing(newRev);
/*
                if(!this.props.text) {
                    this.props.onSubmitEditing(true);
                }*/
                this.props.onBlur && (this.props.onBlur)(!this.props.text)

                this.setState({revealed:newRev},()=>{
                    this.props.revealResponse(newRev);
                })

            }}>

                <Text  style={[
                   Layout.getElementStyle('input-checkbox-text',
                       Layout.textStyle(this.props.styleSetup,{fontSize:18, paddingVertical:10,paddingLeft:0, color: this.props.mode=='dark'? '#323231' :  'white'}))]}>{this.props.placeholder}</Text>

                <View style={{borderWidth:1,borderColor:'white',borderRadius:40,width:40,height:40,paddingTop:8,paddingLeft:8}}>
                    <FeatherIcon name={!this.state.revealed ? "arrow-down" : "arrow-up"} size={22} color={'#FFF'} />
                </View>


            </TouchableOpacity>

            {errorBar}
        </View>);
/*
        return (
            <View><View style={[{flexDirection:'row',marginVertical:10},this.props.style]}>
                <CheckBox style={Layout.getElementStyle('input-checkbox')} value={this.props.text} boxType={'square'}
                          onFillColor={'white'} onCheckColor={'gray'} onTintColor={'gray'}
                          lineWidth={1}
                          onValueChange={text => {
                              if(!this.props.text) {
                                  this.props.onSubmitEditing(text);
                              }
                              this.props.onBlur && (this.props.onBlur)(!this.props.text)
                          }}
                          tintColors={{ true: 'white', false: 'white' }}
                    />
                <TouchableOpacity onPress={()=>{
                    if(!this.props.text){
                        (this.props.onSubmitEditing || this.props.onPress)(!this.props.text);
                    }

                    this.props.onBlur && (this.props.onBlur)(!this.props.text) ;
                }} style={{alignSelf:'center'}}>
                    <Text  style={[
                    this.props.link?{textDecorationLine:'underline',color:'white',marginLeft:20}:{},Layout.getElementStyle('input-checkbox-text',
                    {fontSize:14, paddingLeft:10, color: this.props.mode=='dark'? '#323231' :  'white'})]}>{this.props.placeholder}</Text>
                 </TouchableOpacity>

            </View>
                {errorBar}</View>);*/
    }

}
