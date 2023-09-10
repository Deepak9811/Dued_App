

import React from 'react';

import {
    SafeAreaView,
    StyleSheet,
    ScrollView, TouchableOpacity,
    View, Button,
    Text, Image,
    StatusBar, Alert,
} from 'react-native';

import APIEvents from '../api/APIEvents';
import {API} from '../api/API';

export default class HeaderRightLogged extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cart:0,
            instance: Math.random()
        };

        let logoutInterval;
        let isLogoutInProgress = false;

        APIEvents.addListener('logout','menu',(b)=>{
            console.log('log me out B!',isLogoutInProgress)
            if(isLogoutInProgress){

                if(logoutInterval) clearTimeout(logoutInterval);

                logoutInterval = setTimeout(()=>{
                    isLogoutInProgress = false;
                },2000);

                return;
            }

            isLogoutInProgress = true;
         //   signOut(props,true);
            API.postLogout({},()=>{

                this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                });

            });

        });
        APIEvents.addListener('addToCart','menu',(b)=>{
            this.setState({cart:b});
        });

       }

    componentDidMount = async ()=>{

        API.getCart((cart)=>{
            this.setState({cart:cart && cart.length>0});

        });
    }

    componentWillUnmount = () => {
        APIEvents.removeListener('addToCart','menu'+this.state.instance);
    }

    basket = ()=>{

        this.props.navigation.navigate('Basket',{});

    }

    showMenu = () => {
        //APIEvents.call('menuOpen');

        this.props.navigation.navigate('Menu',{});
    }

    render = () => {
        let cart = null;

        if(this.state.cart){
            cart = <TouchableOpacity onPress={()=>this.basket()} style={{paddingRight:20,paddingTop:10}}></TouchableOpacity>;
        }

        if(this.props.navigation.canGoBack()){
            const {index, routes} = this.props.navigation.dangerouslyGetState();
            const currentRoute = routes[index].name;

            cart =  (<TouchableOpacity onPress={()=>{
                if(API.isLocked &&(currentRoute=='Task' || currentRoute=='TaskDetail')){ //

                    Alert.alert(
                        "Are you Sure?",
                        "Exit without saving changes.",
                        [
                            {
                                text: "Cancel",
                                style: "cancel",
                            },
                            {
                                text: "Exit",
                                onPress: () => {
                                    API.isLocked = false;
                                    this.props.navigation.goBack();

                                }
                            }
                        ]);
                }
                else {
                    this.props.navigation.goBack();
                    API.isLocked = false;
                }



                }} style={{marginLeft:-10,padding:14,marginTop:3,zIndex:2}}>
                    <Image source={require('../../assets/Back.png')} style={{backgroundColor:'transparent',width:24, height:24}} /></TouchableOpacity>
            );

        }

        return (<View style={{marginRight:30,flexDirection:'row'}}>
            <TouchableOpacity onPress={()=>this.showMenu()} style={{padding:20,zIndex:1,backgroundColor:'transparent'}}>
                <Image source={require('../../assets/baseline-notes-24px.png')} style={{backgroundColor:'transparent',width:30, height:20}} /></TouchableOpacity>
            {cart}</View>);

    }
};
