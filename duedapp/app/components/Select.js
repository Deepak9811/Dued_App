/**
 * Created by jedrzej on 15/06/2020.
 */


import * as React from 'react';
import {
    Text,
    View,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    Platform,
    TextInput,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather'
import RNPickerSelect from 'react-native-picker-select';

const initialLayout = { width: Dimensions.get('window').width };

import {Layout} from '../api/API';
import TitleHeader from '../components/TitleHeader';

export default class Select extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }


    /*
    componentDidUpdate(prevProps, prevState) {
        if (this.props.text && this.props.text !== prevState.text) {
            this.setState({text:this.props.text});
        }
    }*/

    render = ()=>{
        "use strict";

        let items = this.props.options ? this.props.options.map(e=>{
            return {label:e.name+"",value:e.id}
        }) : []


        return (
            <View style={this.props.style}>

                <View style={{borderWidth:1 ,backgroundColor:'#FFF',justifyContent:'space-between',
                    alignItems:'center',flexDirection:'row',borderColor:'#DDD',marginBottom:0,borderRadius:10,height:60}}>
                    {Platform.OS!='android' && <Feather name="arrow-down" size={20} color="#202020" style={{top:20,position:'absolute',right:20}}  />}

                    <View style={{zIndex:3}}>
                        <RNPickerSelect
                            placeholder={{"label":""+this.props.placeholder}}
                            value={this.props.text}
                            onValueChange={(value) => this.props.onSubmitEditing && this.props.onSubmitEditing(value)}

                            style={{
                                placeholder: {color:'black',},
                                modalViewMiddle: {
                                    height: 50,
                                },
                            inputIOS: Layout.textStyle(this.props.styleSetup,{padding:20,width:Dimensions.get('window').width,paddingHorizontal:18,font_color:'black',color:'black',fontFamily: 'Overpass-Regular',fontSize: 16,}),
                            inputAndroid: Layout.textStyle(this.props.styleSetup,{padding:20,width:300,paddingHorizontal:18,font_color:'black',color:'black',fontFamily: 'Overpass-Regular',fontSize: 16 }) }}
                            useNativeAndroidPickerStyle={false}

                            items={items/*[
                        { label: 'Football', value: 'football' },
                        { label: 'Baseball', value: 'baseball' },
                        { label: 'Hockey', value: 'hockey' },
                    ]*/}
                            />
                    </View>
                </View>
            </View>);


    }

}
