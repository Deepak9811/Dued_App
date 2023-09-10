/**
 * Created by jedrzej on 15/06/2020.
 */


import * as React from 'react';

import {  Text, View, StyleSheet, StatusBar, SafeAreaView, Button as ButtonX,
    Animated as AnimatedX , Image,
    Easing as EasingX } from 'react-native';

import Animated, { Easing } from 'react-native-reanimated';
const { Clock, Value, set, cond, startClock, clockRunning, timing, debug, stopClock, block } = Animated

import VersionNumber from 'react-native-version-number';

const DeviceInfo = require('react-native-device-info');
import NetInfo from "@react-native-community/netinfo";

import { Layout, _, API } from '../api/API';

import Background from '../components/Background';
import Input from '../components/Input';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import ContainerScrollableView from '../components/ContainerScrollableView';
import Link from '../components/Link';
import MultiLink from '../components/MultiLink';
import MarginalizedBox from '../components/MarginalizedBox';

 class CurrentView extends React.Component {

    constructor(props) {
        super(props);
        this._transX = new Value(10);
        this._config = {
            duration: 1000,
            toValue: 120,
            easing: Easing.inOut(Easing.ease),
        };
        this._anim = timing(this._transX, this._config);
        this.state = {
            netType: '--',
            netConn: '--',
        };



        this.netstate();

        this.props.navigation.setOptions({ title: "About" });

    }

     componentWillUnmount () {

         if(this.intervl) clearInterval(this.intervl);
     }


     netstate = ()=>{

         if(this.intervl) clearInterval(this.intervl);

         this.intervl = setInterval(this.runNetState,10000);

         this.runNetState();

     }

     runNetState = ()=>{
         if(!this.state) {
             if(this.intervl) clearInterval(this.intervl);
             return;
         }

         NetInfo.fetch().then(async (state) => {

             this.setState({netType: state.type, netConn: state.isConnected?"ONLINE":"OFFLINE"});

         });

     }

     form = (e,v)=> {


         let vx = {};
         vx[e] = v;

         this.setState(vx);


     }

     goback = ()=>{

         if(API.isAuthorized()){


             this.props.navigation.navigate('Menu');

            // this.props.navigation.goBack();
             /*
             this.props.navigation.reset({
                 index: 0,
                 routes: [{ name: 'Menu' }],
             });*/
             /*
             this.props.navigation.reset({
                 index: 0,
                 routes: [{ name: 'Menu' }],
             });*/
             /**/

         }
         else {

             this.props.navigation.goBack();


             //this.props.navigation.navigate('Login');
             /*this.props.navigation.reset({
                 index: 0,
                 routes: [{ name: 'Login' }],
             });*/
         }

     }


    render() {

        const buildVersion = VersionNumber.buildVersion || "0";
        const versionVersion = VersionNumber.appVersion || "0";

        const {netType,netConn} = this.state;

        return (
            <Background page="login" margin="classic">


                <ContainerScrollableView  positioning="center" style={{marginLeft:30,marginRight:30,marginTop:30,zIndex:10}}>

                    {/*<View style={{paddingTop:20}}>
                        <Text style={{fontFamily:"Roboto-Regular",color:"white",marginBottom:10,opacity:0.8,fontSize:17}}>{_("Account")}</Text>
                        <View>
                            <Text style={{fontFamily:"Roboto-Regular",color:"white",fontSize:17}} selectable={true}>{API.getAccountName()}</Text>
                        </View>
                    </View>*/}

                    <View style={{paddingTop:20}}>
                        <Text style={{fontFamily:"Roboto-Regular",color:"white",marginBottom:10,opacity:0.8,fontSize:17}}>{_("End point")}</Text>
                        <View>
                            <Text style={{fontFamily:"Roboto-Regular",color:"white",fontSize:17}} selectable={true}>{API.getAPIUrl()}</Text>
                        </View>
                    </View>

                    <View style={{paddingTop:20}}>
                        <Text style={{fontFamily:"Roboto-Regular",color:"white",marginBottom:10,opacity:0.8,fontSize:17}}>{_("App version")}</Text>
                        <View>
                            <Text style={{fontFamily:"Roboto-Regular",color:"white",fontSize:17}} selectable={true}>{versionVersion}</Text>
                        </View>
                    </View>
                    <View style={{paddingTop:20}}>
                        <Text style={{fontFamily:"Roboto-Regular",color:"white",marginBottom:10,opacity:0.8,fontSize:17}}>{_("App build")}</Text>
                        <View>
                            <Text style={{fontFamily:"Roboto-Regular",color:"white",fontSize:17}} selectable={true}>{buildVersion}</Text>
                        </View>
                    </View>

                    <View style={{paddingTop:20}}>
                        <Text style={{fontFamily:"Roboto-Regular",color:"white",marginBottom:10,opacity:0.8,fontSize:17}}>{_("Online")}</Text>
                        <View>
                            <Text style={{fontFamily:"Roboto-Regular",color:"white",fontSize:17}} selectable={true}>{netConn} / {netType}</Text>
                        </View>
                    </View>

                    <View style={{paddingTop:20}}>
                        <Text style={{fontFamily:"Roboto-Regular",color:"white",marginBottom:10,opacity:0.8,fontSize:17}}>{_("Device type")}</Text>
                        <View>
                            <Text style={{fontFamily:"Roboto-Regular",color:"white",fontSize:17}} selectable={true}>{API.getDeviceType()}</Text>
                        </View>
                    </View>

                    <View style={{paddingTop:20}}>
                        <Text style={{fontFamily:"Roboto-Regular",color:"white",marginBottom:10,opacity:0.8,fontSize:17}}>{_("Device model")}</Text>
                        <View>
                            <Text style={{fontFamily:"Roboto-Regular",color:"white",fontSize:17}} selectable={true}>{API.getDeviceModel()}</Text>
                        </View>
                    </View>

                    <View style={{paddingTop:20}}>
                        <Text style={{fontFamily:"Roboto-Regular",color:"white",marginBottom:10,opacity:0.8,fontSize:17}}>{_("Device token")}</Text>
                        <View>
                            <Text style={{fontFamily:"Roboto-Regular",color:"white",fontSize:17}} selectable={true}>{API.getDeviceToken()}</Text>
                        </View>
                    </View>
                    <View style={{height:30}}></View>
                    <Button label={_("Go back")} style={{marginTop:20}} onPress={this.goback} />

                    <View style={{height:150}}></View>

                 </ContainerScrollableView>

            </Background>
        );
    }
}


const styles = StyleSheet.create({


});

export default CurrentView;