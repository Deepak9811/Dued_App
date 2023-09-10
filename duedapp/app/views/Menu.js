/**
 * Created by jedrzej on 5/06/2020.
 */


import * as React from 'react';

import {  Text, View, StyleSheet, StatusBar, SafeAreaView, Button as ButtonX, Dimensions, TouchableOpacity,
    Animated as AnimatedX , Image, ScrollView, Alert,
    Easing as EasingX } from 'react-native';
var moment = require('moment'); // require

import Animated, { Easing } from 'react-native-reanimated';
const { Clock, Value, set, cond, startClock, clockRunning, timing, debug, stopClock, block } = Animated

import { SearchBar } from 'react-native-elements';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

// import {Picker} from '@react-native-community/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import VersionNumber from 'react-native-version-number';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Layout , _, API, showPrice } from '../api/API';
import APIEvents from '../api/APIEvents';

import Background from '../components/Background';
import Input from '../components/Input';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import Link from '../components/Link';
import MultiLink from '../components/MultiLink';
import MarginalizedBox from '../components/MarginalizedBox';
import ContainerScrollableView from '../components/ContainerScrollableView';
import ContainerView from '../components/ContainerView';
import TitleHeader from '../components/TitleHeader';
import Heading from '../components/Heading';




import Rating from '../components/Rating';
import Para from '../components/Para';
import Description from '../components/Description';
import Break from '../components/Break';
import ContactDetails from '../components/ContactDetails';
import OpeningHours from '../components/OpeningHours';

import Staff from '../components/Staff';
import Links from '../components/Links';
import DateSelection from '../components/DateSelection';


const MenuItem = ({onPress,image,text,mode,long})=>{

    let txt = <Text style={{fontFamily:'Roboto-Regular',fontSize:17,color:'white'}}>{_(text)}</Text>;

    return (<TouchableOpacity onPress={onPress} style={{flexDirection:'row',alignItems:'center',backgroundColor:'rgba(255,255,255,0.19)',borderRadius:15,marginBottom:10,paddingVertical:8}}>
        {mode == 'left' && txt}
        <View style={{borderWidth:3,borderRadius:45,marginLeft:10,marginRight:20,width:45,height:45,borderColor:'white',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
        <Image source={image} resizeMode={'contain'} style={{ backgroundColor:'transparent',width:24,height:24}} />
            </View>
        {mode != 'left' && txt}
    </TouchableOpacity>);
}

export default  class CurrentView extends React.Component {

    constructor(props) {
        super(props)

        const {value, callback} = this.props.route.params;
        this.state = {
            loaded: true,
            loading: false,
            value: value,
            salons: []


        };
    }

    componentWillUnmount () {

        //APIEvents.call('menuHideOpen');
    }
    componentDidMount() {

       // APIEvents.call('menuHideClose');

    }

    confirm = ()=>{

        const { callback} = this.props.route.params;

        callback(this.state.code);
        //APIEvents.call('menuHideClose');
        this.goback();
    }

    goback = ()=>{
        this.props.navigation.goBack();
    }



    logout = ()=>{
       // if(!API.isAuthorized()) return;

        API.postLogout({},()=>{

            APIEvents.call('resetHome');

            APIEvents.call('menuClose');
            this.props.navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });

        });


    }

    dashboard = ()=>{
        APIEvents.call('menuClose');

        this.props.navigation.goBack()


        this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
        });
    }

    forms = ()=>{
        APIEvents.call('menuClose');
        this.props.navigation.goBack()
        this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'FormsList' }],
        });
    }

    supplies = ()=>{
        APIEvents.call('menuClose');
        this.props.navigation.goBack()
        this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'SuppliesList' }],
        });
    }

    contactus = ()=>{
        APIEvents.call('menuClose');

        this.props.navigation.setParams({menu: 1});
        this.props.navigation.navigate('Contact',{menu:1});


        /*
        this.props.navigation.setParams({menu: 1});

        this.props.navigation.goBack()
        this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'Contact' }],
        });
        */
    }



    allforms = async ()=>{
        if(this.state.submitting) return;
        this.state.submitting = true;

        let forms = [];


        const value = await AsyncStorage.getItem('TASKS');

        if (value !== null) {

            let tasks = JSON.parse(value);

            if(tasks){

                let has_tasks = false;

                Alert.alert(
                    "Forms",
                    "Submitting all forms should only be used in exceptional circumstances, by selecting this action you are confirming that all forms have been checked individually",
                    [
                        {
                            text: "Cancel",
                            onPress: () => {
                                this.state.submitting = false;
                                },
                            style: "cancel",
                        },
                        {
                            text: "OK",
                            onPress: () =>{

                                this.setState({loaded:false});
                                API.submitSubmittedTasks({
                                    submitAll: true,
                                    callmeback:()=>{
                                        this.state.submitting = false;
                                        this.setState({loaded:true});
                                    }
                                });

                            },
                            style: "default",
                        },
                    ],
                    {
                        cancelable: true
                    }
                );


            }

        }
        else {
            this.state.submitting = false;
        }

        APIEvents.call('menuClose');
      //  this.props.navigation.goBack()
       // alert("Cannot connect to the API");
    }
    terms = ()=>{
        APIEvents.call('menuClose');
        //this.props.navigation.goBack()
        this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'Terms' }],
        });
    }
    about = ()=>{
        APIEvents.call('menuClose');
        //this.props.navigation.goBack()


        this.props.navigation.navigate('Pair',{});

        /*
        this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'Pair' }],
        });*/
    }

    render() {
        const { search, mode } = this.state;

        const {value,label} = this.props.route.params;

        if(!this.state.loaded){

            return (<View style={{ flex: 1 ,backgroundColor:'transparent',flexDirection: 'column', justifyContent: 'flex-end'}}>

                <View page="Info" style={{height: "100%" ,width: '100%', backgroundColor:"rgba(0,12,46,1)", justifyContent:"center",borderTopLeftRadius:20,borderTopRightRadius:20,padding:10,paddingBottom:0,paddingTop:50}}>

                        <Text style={{color:'white', fontWeight:'bold',fontSize:22}}>Submitting forms... please wait.</Text>
                </View>

            </View>);


        }

        const buildVersion = VersionNumber.buildVersion || "0";
        const versionVersion = VersionNumber.appVersion || "0";
        //
        return (<View style={{ flex: 1 ,backgroundColor:'transparent',flexDirection: 'column', justifyContent: 'flex-end'}}>


                <View page="Info" style={{height: "100%" ,width: '100%', backgroundColor:"rgba(0,12,46,1)", justifyContent:"center",borderTopLeftRadius:20,borderTopRightRadius:20,padding:10,paddingBottom:0,paddingTop:50}}>

                    <ScrollView style={{width:'100%',marginTop:50,paddingTop:20,flex:1}}>

                    <MenuItem onPress={this.dashboard} image={require('../../assets/dashboard.png')} text={"Dashboard"} />
                    <MenuItem onPress={this.forms} image={require('../../assets/form.png')} text={"Form List"} />
                    <MenuItem onPress={this.supplies} image={require('../../assets/parachute.png')} text={"Supplies"} />
                    <MenuItem onPress={this.contactus} image={require('../../assets/contact2.png')} text={"Contact Us"} />
                    {/* <MenuItem onPress={this.allforms} image={require('../../assets/form.png')} text={"Submit All Forms"} /> */}
                    <MenuItem onPress={this.terms} image={require('../../assets/outline.png')} text={"Terms & Conditions"} />
                    <MenuItem onPress={this.about} image={require('../../assets/aboutsuccessfulman.png')} text={"About App"} />

                        {/*<MenuItem onPress={this.logout} image={require('../../assets/dashboard.png')} text={"Logout"} />*/}

                        <View style={{height:30}}></View>
                        <Text style={{color:'#FFF',fontFamily:'Overpass-Regular',letterSpacing:1,fontSize:12,textAlign:'center',opacity:0.2}}>App build <Text style={{fontFamily:'Poppins-SemiBold'}}>{buildVersion}</Text>, version <Text style={{fontFamily:'Poppins-SemiBold'}}>{versionVersion} {setup.isProduction?"PROD":"TEST"}</Text></Text>

                        <View style={{height:50}}></View>
                    </ScrollView>
                </View>
                <TouchableOpacity style={{backgroundColor:'#17254D',borderRadius:30,position:'absolute',left:0,right:0,top:-30,

                minHeight:140,paddingTop:26}} onPress={this.goback}>

                    <View style={{marginRight:50,marginTop:50,marginLeft:20,flexDirection:'row',justifyContent:'space-between'}}>
                    <Heading size={4} style={{backgroundColor:'transparent'}}>MENU</Heading>

                    <View style={{backgroundColor:'rgba(255,255,255,0.23)',marginTop:-5,width:34,height:34,alignItems:'center',justifyContent:'center',borderRadius:34}}>
                        <Image source={require('../../assets/Close.png')} style={{backgroundColor:'transparent',width:14, height:14}} />
                    </View>

                 </View>

                </TouchableOpacity>

            </View>
        );
    }
}

