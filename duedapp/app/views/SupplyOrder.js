/**
 * Created by jedrzej on 1/06/2020.
 */


import * as React from 'react';

import {  Text, View, StyleSheet, StatusBar, SafeAreaView, Button as ButtonX,TouchableOpacity,Platform,
    Animated as AnimatedX , Image, ScrollView,
    Easing as EasingX, Dimensions } from 'react-native';


import SplashScreen from 'react-native-splash-screen'

const moment = require('moment');

import { Layout , _, API } from '../api/API';

import ContainerScrollableView from '../components/ContainerScrollableView';

import Background from '../components/Background';
import Button from '../components/Button';
import Input from '../components/Input';



class CurrentView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            salons: [{name:"Your salon (main branch)",id:0}],
        };

    }
    componentWillUnmount () {

    }

    componentDidMount = async ()=>{




    }



    submit = (e)=>{
        if(this.state.loading) {
            alert(_("Please wait"));
            return;
        }

        this.setState({loading:true});

        //console.log('salon',this.state.selectedSalon);

        API.postContactForm({

            subject: this.state.subject,
            name: this.state.name,
            email: this.state.email,
            phone: this.state.tel,
            message: this.state.message},(err,dt,showApiErrors)=>{


            this.setState({loading:false});

            if(err){

                this.setState({error:err});
                alert(err || _("Error in API"));
                return;
            }

            else if(!dt.success){



                let error = API.parseResponseErrors(dt);
                this.setState({error:error});
                alert(error || err || dt.message || _("Error in API"));


                return;
            }

            alert(_("Thank You! We'll come back to you shortly!"));
            this.props.navigation.goBack();

        });
    }

    formFill = (field,value)=>{

        this.state[field]=value;
    }

    showSalon = ()=>{
        // onSubmitEditing={(v)=>this.form('salon',v)}
        this.props.navigation.navigate('SalonModal',{
            'value':this.state.selectedSalon && this.state.selectedSalon.id,
            label: this.state.selectedSalon && this.state.selectedSalon.name,
            callback: (e)=>this.setState({selectedSalon:e})
        });

    }

    render() {

        let isAuthorized = API.isAuthorized();


        return (<Background scrolls={true} style={{flex:1}} offsetCall={this.offsetCall}>


            <ContainerScrollableView keyboardAware={true} style={{marginLeft:30,marginTop:60,marginRight:30,zIndex:10}}>
                <View style={{marginHorizontal:0,marginTop:0}}>


                    <Input type={"name"} placeholder={_("Subject")} onSubmitEditing={(v)=>this.formFill('subject',v)}  />
                    <Input type={"name"} placeholder={_("Your name")} onSubmitEditing={(v)=>this.formFill('name',v)}  />
                <Input type={"email"} placeholder={_("Your email")} autoCorrect={false}  onSubmitEditing={(v)=>this.formFill('email',v)}  />
                    <Input type={"tel"} placeholder={_("Telephone Number")} autoCorrect={false}  onSubmitEditing={(v)=>this.formFill('tel',v)}  />

                <Input type={"text"} placeholder={_("Message")} numberOfLines={8} autoCorrect={false}  onSubmitEditing={(v)=>this.formFill('message',v)}  />


                <Button label={_(this.state.loading ? "Loading..." : "Submit")} style={{marginTop:20}} onPress={this.submit} />

                <View style={{height:50}}></View>
                </View>
                <View style={{height:80}}></View>

            </ContainerScrollableView>

        </Background>);


    }
}


const styles = StyleSheet.create({


});

export default CurrentView;