/**
 * Created by jedrzej on 29/05/2020.
 */


import * as React from 'react';
import {  Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput,  Image,ScrollView } from 'react-native';

import {Layout} from '../api/API';

import Background from '../components/Background';
import Input from '../components/Input';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import Link from '../components/Link';
import MultiLink from '../components/MultiLink';
import MarginalizedBox from '../components/MarginalizedBox';
import ContainerScrollableView from '../components/ContainerScrollableView';
import TitleHeader from '../components/TitleHeader';
import Rating from '../components/Rating';
import CallButton from '../components/CallButton';
import Description from '../components/Description';
import Break from '../components/Break';


export default class Container extends React.Component {



    render = ()=>{

//  [Wed Aug 19 2020 13:58:23.608]  LOG      hi rev {"created_at": "2020-08-19 11:56:45", "id": "1", "name": "fgdffgdfgd", "rating": "5", "review": "Ghghfgh"} 0
        return (<View  style={{flexDirection:'row'}}>

            <View>

                <Text style={{color:'white',fontSize:17,marginLeft:10}}>{this.props.data.name}</Text>
                <View style={{flexDirection:'row',marginLeft:10,justifyContent:'space-between',marginRight:40}}>

                    <Rating mode={"individual"} style={{marginTop:5,letterSpacing:4}} rating={this.props.data.rating}/>
                    <Text style={{fontSize:13,color:'#8e8e8e'}}></Text>

                </View>
                <Text style={{fontSize:15,color:'#8e8e8e',marginRight:40,marginLeft:10,marginTop:20,marginBottom:20}}>{this.props.data.review}</Text>


            </View>
        </View>);

    }

}