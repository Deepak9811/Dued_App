/**
 * Created by jedrzej on 3/02/2021.
 */

import * as React from 'react';

import {  Text, View, StyleSheet, StatusBar, SafeAreaView, Button as ButtonX, TouchableOpacity,ImageBackground,Platform,
    Animated as AnimatedX , Image,Linking,Alert  } from 'react-native';

import { StackActions } from '@react-navigation/native';
import VersionNumber from 'react-native-version-number';

import { Layout, API,_ } from '../api/API';

import Background from '../components/Background';

import settings from '../../settings';

class CurrentView extends React.Component {

    constructor(props) {
        super(props);


    }

    componentDidMount = async ()=>{


        await API.loadSession();
        this.props.navigation.dispatch(
            StackActions.replace(API.isAuthorized() ? 'Home' : 'Login', {})
        );




    }


    render() {
        return (
            <Background page="Loader" image={""} style={{flex:1,justifyContent: "center",alignItems: "center"}}>

                <Text style={{color:'#FFFFFF',textAlignVertical: "center",textAlign: "center",opacity:0.6}}>{_('loading...')}</Text>


            </Background>
        );
    }
}


export default CurrentView;