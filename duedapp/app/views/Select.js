/**
 * Created by jedrzej on 1/06/2020.
 */


import * as React from 'react';

import {  Text, View, StyleSheet, StatusBar, SafeAreaView, Button as ButtonX,TouchableOpacity,Platform,
    Animated as AnimatedX , Image, ScrollView,
    Easing as EasingX, Dimensions } from 'react-native';


import SplashScreen from 'react-native-splash-screen'
import WebView from 'react-native-webview'

var moment = require('moment');

import { SearchBar } from 'react-native-elements';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import LinearGradient from 'react-native-linear-gradient';
import CheckBox from '@react-native-community/checkbox';

import settings from '../../settings';

import { Layout , _, API } from '../api/API';
import APIEvents from '../api/APIEvents';

import Background from '../components/Background';
import Heading from '../components/Heading';
import Para from '../components/Para';
import Window from '../components/Window';
import Button from '../components/Button';
import MembershipButton from '../components/MembershipButton';
import OfferBox from '../components/OfferBox';
import VoucherBox from '../components/VoucherBox';
import Input from '../components/Input';
import Reveal from '../components/Reveal';


import AlertText from '../components/AlertText';
import Lock from '../components/Lock';
import DateTimePicker from "@react-native-community/datetimepicker";
import RNPickerSelect from "react-native-picker-select";


class CurrentView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false
        };

    }
    componentDidMount = async ()=>{

        console.log('hello',this.props.route.params);

    }
    componentWillUnmount () {

    }

    goback = async ()=>{


        this.props.navigation.goBack();
    }

    onsubmit = ()=>{
        const {value,mode,onChangeText} = this.props.route.params;

        if(onChangeText) onChangeText(this.state.value);
        this.props.navigation.goBack();
    }

    render() {

        const {value,items,name} = this.props.route.params;

        return (
            <View style={{ flex: 1 ,backgroundColor:'transparent',flexDirection: 'column', justifyContent: 'flex-end'}}>


                <View page="Info" style={{height: "100%" ,width: '100%', backgroundColor:"rgba(30,30,60,0.97)", justifyContent:"center"}}>
                    <Heading key={"fieldtxt"} size={4}
                             style={{paddingTop:30,marginHorizontal:20,paddingBottom:6}}>{(name)}</Heading>

                    <RNPickerSelect
                        placeholder={{"label":name}}
                        value={this.state.value || value}
                        onValueChange={(value) => this.setState({value:date})}

                        style={{
                            placeholder: {color:'black'},
                            modalViewMiddle: {
                                height: 50,
                            },
                            inputIOS: {padding:20,width:300,paddingHorizontal:18,color:'black',fontFamily: 'Overpass-Regular',fontSize: 16,},
                            inputAndroid: {padding:20,width:300,paddingHorizontal:18,color:'black',fontFamily: 'Overpass-Regular',fontSize: 16 } }}
                        useNativeAndroidPickerStyle={false}

                        items={items}
                    />

                    <View style={{flexDirection:'row',width:'100%',margin:'0%',justifyContent:'space-between'}}>
                        <Button  style={{width:'40%',marginLeft:10,marginTop:Platform.OS=='android'?1:0}} label={_("CANCEL")} type={'black-small'} onPress={()=>this.goback()} />


                        <Button disabled={!this.state.value && !value} style={{width:'40%',marginRight:10,marginTop:Platform.OS=='android'?1:0}} label={_("OK")} type={'black-small'} onPress={()=>this.onsubmit()} />

                    </View>
                </View>

            </View>);


    }
}


const styles = StyleSheet.create({


});

export default CurrentView;