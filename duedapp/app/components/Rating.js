/**
 * Created by jedrzej on 15/06/2020.
 */


import * as React from 'react';
import {  Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import {Layout} from '../api/API';

export default class Rating extends React.Component {


    onChangeText = (text)=>{


    }

    render = ()=>{


        const mode = this.props.mode || "rating";

        const {rating,rating_sample} = this.props;

        let extraStyle = this.props.style || {};

        let size = 10;
        extraStyle['letterSpacing'] = 3;

        switch(mode){
            case 'individual':
                size = 11;
                extraStyle['letterSpacing'] = 1;
                break;
            case 'inline':
                extraStyle['letterSpacing'] = 5;
                size = 14; break;
        }

        let stars = [];
        for(let i = 0;i<5;i++){
            stars.push(<FontAwesome key={i} name={"star"+(i<rating?"":"-o")} size={size} />);
        }




        return (
            <View style={this.props.containerStyle}>
                <Text style={[{color:'#E1B625',fontSize:size},extraStyle]}>
                    {stars}
                    {mode=='inline' && <Text style={{color:'#e1b625',letterSpacing:0}}> {rating}</Text>}
                    {mode=='inline' && <Text style={{color:'#8E8E8E',fontSize:10,letterSpacing:0}}> ({rating_sample || 0} Reviews)</Text>}
                </Text>
                {mode=='rating' && <Text style={{color:'#8E8E8E',fontSize:10,letterSpacing:0}}>({rating_sample || 0} Reviews)</Text>}
            </View>);
    }

}