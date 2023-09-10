/**
 * Created by jedrzej on 15/06/2020.
 */


import * as React from 'react';
import {  Text, View, StyleSheet, StatusBar, SafeAreaView, Linking, TextInput, Platform, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import {Layout, API} from '../api/API';
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


export default class Details extends React.Component {


    call = ()=>{


        Linking.openURL(`tel:`+this.props.data.contact_number.replace(/[ ]/g,''));
    }
    email = ()=>{

        Linking.openURL(`mailto:`+encodeURIComponent(this.props.data.email))

    }
    map = ()=>{

        //console.log('call bb',this.props.data);

        /*Platform.select({
            ios: () => {
                console.log('hello linl');
                Linking.openURL('http://maps.apple.com/maps?daddr='+encodeURIComponent(this.props.data.address));
            },
            android: () => {*/
                Linking.openURL('http://maps.google.com/maps?daddr='+encodeURIComponent(this.props.data.address));
           /* }
        });*/
    }


    render = ()=>{


        return (<View>
            <TitleHeader title={"Contact  Details"} level={2}/>

            {this.props.data.contact_number && <View style={{flexDirection:'row',marginBottom:10,alignItems:'center',justifyContent:'space-between'}}>
                <Text style={{color:'#8e8e8e',fontSize:15, flex:10}}><Text style={{color:'#e1b625',fontWeight:'bold'}}>T: </Text><Text>{this.props.data.contact_number}</Text></Text>
                <CallButton onPress={this.call} style={{flex:2}} label={"CALL"}/>

            </View>}
            {this.props.data.email && <View style={{flexDirection:'row',marginBottom:10,alignItems:'center',justifyContent:'space-between'}}>
                <Text style={{color:'#8e8e8e',fontSize:15, flex:10}}><Text style={{color:'#e1b625',fontWeight:'bold'}}>E: </Text><Text>{this.props.data.email}</Text></Text>
                <CallButton onPress={this.email} style={{flex:2}} label={"EMAIL"}/>

            </View>}
            {this.props.data.address && <View style={{flexDirection:'row',marginBottom:10,alignItems:'center',justifyContent:'space-between'}}>
                <Text style={{color:'#8e8e8e',fontSize:15, flex:10}}><Text style={{color:'#e1b625',fontWeight:'bold'}}>A: </Text><Text>{this.props.data.address}</Text></Text>
                <CallButton onPress={this.map} style={{flex:2}} label={"MAP"}/>

            </View>}
            {/*this.props.managedata ?<TouchableOpacity onPress={API.navigateAdmin}><Text  style={{color:'#FFF',textAlign:'right',marginTop:20,marginBottom:30}}>Manage contact details in admin →</Text></TouchableOpacity> : undefined*/}

        </View>);
    }

}