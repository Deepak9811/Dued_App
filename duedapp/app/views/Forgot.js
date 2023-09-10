/**
 * Created by jedrzej on 15/06/2020.
 */


import * as React from 'react';

import {  Text, View, StyleSheet, StatusBar, SafeAreaView, Button as ButtonX,
    Animated as AnimatedX , Image,
    Easing as EasingX } from 'react-native';

import Animated, { Easing } from 'react-native-reanimated';
const { Clock, Value, set, cond, startClock, clockRunning, timing, debug, stopClock, block } = Animated

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
        this.state = {};
    }

     form = (e,v)=> {


         let vx = {};
         vx[e] = v;

         this.setState(vx);


     }

     login = ()=>{

         API.postAuthReset({
             email_repeat: this.state.email_repeat,
             email: this.state.email
         },(err,dt)=>{
             if(err){
                 alert(err);
                 return this.setState({error:err});
             }
             else if (!dt.success) {
                 alert(dt.message || "Sorry, We cannot complete this action at this time! @1");
                 return;
             }
             else {

                 alert("Please check your email for reset activation mail");
             }

             this.props.navigation.reset({
                 index: 0,
                 routes: [{ name: 'Home' }],
             });
         });
     }
    render() {

        return (
            <Background page="login" margin="classic">


                <ContainerScrollableView  positioning="center" style={{marginLeft:30,marginRight:30,marginTop:150,zIndex:10}}>
                    <Input placeholder={_("Email")} text={this.state.email} onSubmitEditing={(v)=>this.form('email',v)} />
                    <Input placeholder={_("Repeat email")} text={this.state.email_repeat} onSubmitEditing={(v)=>this.form('email_repeat',v)} />

                    <Button style={{marginTop:20}} label={_("Reset password")} disabled={!this.state.email || this.state.email!=this.state.email_repeat} onPress={this.login} />


                 </ContainerScrollableView>

            </Background>
        );
    }
}


const styles = StyleSheet.create({


});

export default CurrentView;