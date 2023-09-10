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
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';

import FastImage from 'react-native-fast-image'
import { Layout , _, API, showPrice } from '../api/API';

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

import Rating from '../components/Rating';
import Description from '../components/Description';
import Break from '../components/Break';
import ContactDetails from '../components/ContactDetails';
import OpeningHours from '../components/OpeningHours';

import Staff from '../components/Staff';
import Links from '../components/Links';
import DateSelection from '../components/DateSelection';



export default  class CurrentView extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: false,


        };
    }

    componentDidMount() {

        this.props.navigation.setOptions({ title: this.props.route.params.title });
    }

    goback = ()=>{
        this.props.navigation.goBack();
    }


    render() {

        const p  = this.props.route.params;

        return (
            <View style={{ flex: 1, paddingBottom:100,backgroundColor:'black'}}>


             <ReactNativeZoomableView
                 maxZoom={1.5}
                 minZoom={0.5}
                 zoomStep={0.5}
                 initialZoom={1}
                 bindToBorders={true}
                 style={{
            padding: 10,
          }}
                 >
                 {p && p.image_url_large?<Image style={{ flex: 1, width: null, height: '100%' }}
                        source={{uri:p.image_url_large}}
                        resizeMode="contain" />:undefined}
             </ReactNativeZoomableView>


            </View>
        );
    }
}

