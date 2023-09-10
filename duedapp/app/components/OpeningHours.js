/**
 * Created by jedrzej on 15/06/2020.
 */


import * as React from 'react';
import {  Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

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


export default class Opening extends React.Component {



    onChangeText = (text)=>{


    }

    render = ()=>{

        let days = 'monday,tuesday,wednesday,thursday,friday,saturday,sunday'.split(',');


        let daysx = [];
        if(this.props.data ){

            let startDate = '';
            let startDateDays = [];
            for(let i in days){
                let day = days[i];
                let start=this.props.data[day] || '-';
                let end = this.props.data[day+'_close']|| '-';

                /*if(startDate==start+' - '+end){
                    startDateDays.push(day);
                }
                else {*/
                    if(startDate.length>0){

                        daysx.push(<View key={i} style={{flexDirection:'row',marginBottom:10,alignItems:'center',justifyContent:'space-between'}}>
                                <Text style={{color:'#8e8e8e',fontSize:15}}>{startDateDays.join(' - ')}</Text>
                                <Text style={{color:'#e1b625',fontSize:15}}>{startDate}</Text>
                            </View>);
                    }
                    startDate = start+' - '+end;
                    startDateDays = [day];
                //}
            }
            if(startDate.length>0){
                daysx.push(<View key={"xx"} style={{flexDirection:'row',marginBottom:10,alignItems:'center',justifyContent:'space-between'}}>
                    <Text style={{color:'#8e8e8e',fontSize:15}}>{startDateDays.join(' - ')}</Text>
                    <Text style={{color:'#e1b625',fontSize:15}}>{startDate}</Text>
                </View>);
            }

        }
        else {
            return null;
        }


        return (<View>

            <TitleHeader title={"Opening Hours"} level={2}/>

            {daysx}

            {/*<View style={{flexDirection:'row',marginBottom:10,alignItems:'center',justifyContent:'space-between'}}>
                <Text style={{color:'#8e8e8e',fontSize:15}}>Monday - Friday</Text>
                <Text style={{color:'#e1b625',fontSize:15}}>09:00 - 18:00</Text>
            </View>
            <View style={{flexDirection:'row',marginBottom:10,alignItems:'center',justifyContent:'space-between'}}>
                <Text style={{color:'#8e8e8e',fontSize:15}}>Saturday</Text>
                <Text style={{color:'#e1b625',fontSize:15}}>08:00 - 16:00</Text>
            </View>
            <View style={{flexDirection:'row',marginBottom:10,alignItems:'center',justifyContent:'space-between'}}>
                <Text style={{color:'#8e8e8e',fontSize:15}}>Sunday</Text>
                <Text style={{color:'#e1b625',fontSize:15}}>CLOSED</Text>
            </View>*/}
            </View>);
    }

}