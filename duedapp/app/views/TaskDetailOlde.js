/**
 * Created by jedrzej on 1/06/2020.
 */


import * as React from 'react';

import {  Text, View, StyleSheet, StatusBar, SafeAreaView, Button as ButtonX,TouchableOpacity,Platform,
    Animated as AnimatedX , Image, ScrollView,
    Easing as EasingX, Dimensions } from 'react-native';

import SplashScreen from 'react-native-splash-screen'
const moment = require('moment');
import { SearchBar } from 'react-native-elements';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import LinearGradient from 'react-native-linear-gradient';

import FastImage from 'react-native-fast-image'


import settings from '../../settings';

import { Layout , _, API } from '../api/API';
import APIEvents from '../api/APIEvents';

import Background from '../components/Background';
import Heading from '../components/Heading';
import Window from '../components/Window';
import Button from '../components/Button';
import Para from '../components/Para';
import MembershipButton from '../components/MembershipButton';
import OfferBox from '../components/OfferBox';
import Input from '../components/Input';
import ContainerScrollableView from '../components/ContainerScrollableView';


import Lock from '../components/Lock';

class CurrentView extends React.Component {

    constructor(props) {
        super(props);


        let pack = undefined;

        console.log('hi pack',pack);

        if(!pack){
            pack = {
                id: moment().unix()+Math.random(),
                date: moment().unix()
            }

        }
        else {
            pack = JSON.parse(pack);
        }

        this.state = {
            loading: false,
            height:200,
            parent: JSON.parse(this.props.route.params.parent),
            group: JSON.parse(this.props.route.params.group),
            plan: (pack)
        }

    }
    componentWillUnmount () {

    }

    componentDidMount = async ()=>{


        this.props.navigation.setOptions({ title: this.state.parent.name });


    }

    submit = async ()=>{




        this.props.route.params.saveMe(this.state.plan);
        this.props.navigation.goBack();

/*
        let tasks = this.state.parent.groups;

        let exist = false;
        for(let i in tasks){
            if(tasks[i].id==this.state.parent.id){





                if(typeof(tasks[i].hour1)=="undefined"){
                    tasks[i].hour1 = this.state.plan;
                }
                if(typeof(tasks[i].hour2)=="undefined"){
                    tasks[i].hour2 = this.state.plan;
                }
            }
        }
        this.state.parent.groups = tasks;

        await API.saveTaskGroup(this.state.parent);
        this.props.navigation.goBack();*/

    }


    formFill = (field,value)=>{

        this.state.plan[field]=value;
        this.setState({rand:Math.random()});
    }

    render() {


        return (<Background scrolls={true} style={{flex:1}} offsetCall={this.offsetCall}>


            <ContainerScrollableView keyboardAware={true} style={{marginLeft:30,marginTop:60,marginRight:30,zIndex:10}}>
                <View style={{marginHorizontal:0,marginTop:0}}>


                    <Input type={"number"} keyboardType={"number-pad"} placeholder={_("Cupboard number")} text={(this.state.group['number']+"" || "")}
                           disabled={true} validation={"number"} />

                    <Input type={"name"} placeholder={_("Time")} disabled={true} text={moment(this.state.plan.date*1000).format("HH:mm") || ""}   />

                    <Input type={"number"} keyboardType={"number-pad"} validation={"number"} placeholder={_("Temperature °C")}
                           autoCorrect={false}  onSubmitEditing={(v)=>this.formFill('temperature',v)}  />

                    <Input type={"name"} placeholder={_("Name")} autoCorrect={false}  onSubmitEditing={(v)=>this.formFill('name',v)}  />

                    <Input type={"signature"} placeholder={_("Signature")} numberOfLines={8} autoCorrect={false}
                           text={this.state.plan.signature || undefined}
                           onSubmitEditing={(v)=>this.formFill('signature',v)}  />


                    <Button label={_(this.state.loading ? "Loading..." : "Save")} style={{marginTop:20}} onPress={this.submit} />

                    <View style={{height:50}}></View>
                </View>
                <View style={{height:50}}></View>

            </ContainerScrollableView>

        </Background>);



    }
}


const styles = StyleSheet.create({


});

export default CurrentView;