/**
 * Created by jedrzej on 15/06/2020.
 */


import * as React from 'react';
import {  Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import {Layout} from '../api/API';
import Background from '../components/Background';
import Input from '../components/Input';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import Link from '../components/Link';
import MultiLink from '../components/MultiLink';
import MarginalizedBox from '../components/MarginalizedBox';
import ContainerScrollableView from '../components/ContainerScrollableView';
import TitleOptioned from '../components/TitleOptioned';
import Rating from '../components/Rating';
import CallButton from '../components/CallButton';
import Description from '../components/Description';
import Break from '../components/Break';


export default class Links extends React.Component {


    onChangeText = (text)=>{


    }

    render = ()=>{


        return (<View>
            <TitleOptioned title={"Other Links"} level={2}  options={[]}/>

            </View>);
    }

}