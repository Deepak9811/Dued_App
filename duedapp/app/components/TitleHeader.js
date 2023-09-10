/**
 * Created by jedrzej on 29/05/2020.
 */


import * as React from 'react';
import {  Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput,  Image,ScrollView, TouchableOpacity } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

import {Layout} from '../api/API';

import Button from './SmallButton'


export default class Container extends React.Component {


    minus = ()=>{
        this.props.modifyMultiplier(-1);

    }
    plus = ()=>{

        this.props.modifyMultiplier(1);
    }

    render = ()=>{

        let fontSize = 26;

        let color = 'white';
        let fontWeight = 'bold';
        switch(this.props.level){
            case 1:
                fontSize = 24; fontWeight = '600'; break;
            case 2:
                fontSize = 20; fontWeight = 'normal'; break;
            case 3:
                fontSize = 15; color = '#FFFFFF'; fontWeight = 'normal'; break;
            case 4:
                fontSize = 17; fontWeight = '500'; break;
            case 5:
                fontSize = 15; color = '#FFFFFF'; fontWeight = 'normal'; break;
            case 6:
                fontSize = 17; color = '#FFFFFF'; break;
        }

        return (<View style={[{flexDirection:'row',marginTop:20,marginBottom:20, alignItems:'center'},this.props.style]}>

            <TouchableOpacity style={{flex:7,flexDirection:'row'}} onPress={this.props.onTextPress}>
                <Text style={{color:this.props.selected?'green':this.props.titleColor || color ,fontWeight:fontWeight,fontSize:fontSize,textTransform:this.props.uppercase ? 'uppercase' : undefined}}>
                    {this.props.checkboxMode && <FeatherIcon name={this.props.selected ? 'check-square' : 'square'} size={18} style={{marginRight:10,marginLeft:30}}/>}
                    {this.props.checkboxMode && " "}
                    {this.props.title}{" "}
                    {this.props.subtitle && <Text style={{fontSize:11,color:'#8e8e8e',fontWeight:'normal'}}>{"\n"} {this.props.subtitle}</Text>}
                    {!this.props.checkboxMode && this.props.selected ? <FeatherIcon name={'check'} size={18} style={{marginRight:10,marginLeft:30}}/> : undefined}
                </Text>
            </TouchableOpacity>


            {this.props.pricealt || this.props.price ? <Text style={{flex:3,color:color,textAlign:'right',fontWeight:'600',marginRight:14,fontSize:fontSize-2}}>{this.props.multiplier ? this.props.multiplier+' x ': undefined}{this.props.pricealt || '£'+this.props.price}</Text> : null}



            {this.props.onPress?<Button style={{flex:2}} onPress={this.props.onPress} icon={this.props.icon} label={this.props.actionLabel || "View All"} type={this.props.actionMode}></Button>:null}
        </View>);

    }

}