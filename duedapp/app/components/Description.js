/**
 * Created by jedrzej on 15/06/2020.
 */


import * as React from 'react';
import {  Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import {Layout} from '../api/API';

export default class Description extends React.Component {


    constructor(props) {
        super(props);
        this.state = {opened:false};
    }

    toggleMore = (text)=> {

        this.setState({opened: !this.state.opened});
    }



    render = ()=>{


        if(!this.props.data) return null;
        return (

            <View>
                <TouchableOpacity onPress={this.toggleMore}>
                <Text style={{fontSize:15,color:'#8e8e8e',marginBottom:10}}>
                    {this.props.data}

                    {/*this.state.opened ? <Text>{"\n"}No more text to read ;)...</Text> : <Text style={{color:'#96a825'}}>Read More</Text>*/}</Text>

                    </TouchableOpacity>
            </View>);
    }

}