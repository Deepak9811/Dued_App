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

class CurrentView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false
        };

    }
    componentWillUnmount () {

    }

    componentDidMount = async ()=>{

        API.getTerms({},(err,dt,showApiErrors)=>{

            if(err || !dt.success){

                if(showApiErrors){
                    alert(err || dt.message || "Error in API");
                }

                return;
            }

            this.props.navigation.setOptions({ title: dt.title });
                this.setState({terms:dt.html});



        });



    }





    offsetCall = (a)=> {
        if(a==0){

            return this.setState({height:200});
        }

        this.setState({
            height: Math.max(0,200 - a)
        });
    }

    render() {

        let isAuthorized = API.isAuthorized();


        return (<View scrolls={true} style={{flex:1,flexGrow:1,backgroundColor:'rgba(0,12,46,1)'}} offsetCall={this.offsetCall}>


            <View style={{marginTop:-20,flex:1}}>
                <Heading size={2} style={{padding:30,paddingBottom:18,paddingLeft:15}}>{_('Terms of service')}</Heading>


                <WebView
                    originWhitelist={['*']}
                    source={{ html: '<meta name="viewport" content="width=device-width, initial-scale=0.5, maximum-scale=0.5, user-scalable=0"><style>body,html{background:rgba(0,12,46,1);color:white}</style>'+this.state.terms, baseUrl: '' }}
                    style={{backgroundColor:'rgba(0,12,46,1)',width:'100%',flexGrow:1}} />

                </View>

        </View>);


    }
}


const styles = StyleSheet.create({


});

export default CurrentView;