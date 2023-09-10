/**
 * Created by jedrzej on 15/06/2020.
 */


import * as React from 'react';
import {  Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
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
import TitleHeader from '../components/TitleHeader';
import Rating from '../components/Rating';
import CallButton from '../components/CallButton';
import Description from '../components/Description';
import Break from '../components/Break';


export default class Staff extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            selected: typeof(props.barberUserId)=="object"?props.barberUserId.id:props.barberUserId,
            isBarberPreselected: props.isBarberPreselected,
            advanced: !!props.advanced

        };
    }

    select = (i,e)=>{
        if(this.props.selection) {
            this.setState({selected:e.id});
            this.props.onPress(e);
        }
    }

    componentDidUpdate(prevProps) {
        let nv = typeof(this.props.barberUserId)=="object"?this.props.barberUserId.id:this.props.barberUserId;

       if(this.state.selected != nv) {
           this.setState({selected: nv});

       }
        if(this.props.isBarberPreselected===true && !prevProps.isBarberPreselected){
            this.setState({isBarberPreselected:this.props.isBarberPreselected})
        }
    }


    render = ()=>{

        const {selected, isBarberPreselected} = this.state;

        if(!this.props.data || this.props.data.length==0) return null;
        return (<View>
            {!this.props.selection && <TitleHeader title={"Staff"} level={2}/>}

            <ScrollView
                horizontal={true} >
            {this.props.data.map((e,i)=>{

                if(isBarberPreselected && selected!=e.id) return;

                if(!isBarberPreselected && this.state.advanced && !e.allow_advanced_booking) return;

                /*if(this.props.selection && i==0){


                    return null;
                    return (<TouchableOpacity key={i} onPress={()=>this.select(i,{id:'all'})} key={"staff"+i} style={{marginRight:30,marginBottom:30}}>
                        <View style={[{backgroundColor:'#8e8e8e',borderRadius:10,borderWidth:1,alignItems:'center',justifyContent:'center',borderColor:'transparent'},
                                        selected==i?{backgroundColor:'#E1B625',borderColor:'#96A825'}:{borderColor:'#323231'}]}>
                            <View style={{borderWidth:2,borderRadius:9,borderColor: selected==i? '#323231' : '#323231',alignItems:'center',justifyContent:'center'}}>

                                <View style={{width:96,height:78,alignItems:'center',justifyContent:'center'}}>
                                        <Image source={require('../../assets/logo2.png')} style={{}} />

                                </View>
                                <Text style={{fontWeight:'bold',fontSize:12,marginTop:5,marginBottom:10,marginLeft:20,marginRight:20,color:'#FFFFFF',textAlign:'center'}}>I DON'T{"\n"}MIND</Text>
                            </View>
                        </View>
                    </TouchableOpacity>)

                }*/

                return (<TouchableOpacity key={i} onPress={()=>this.select(i,e)} key={"staff"+i} style={{marginRight:30,marginBottom:30, justifyContent:'center',alignItems:'center'}}>
                    <View style={[{width:78,height:78,backgroundColor:'#8e8e8e',borderRadius:45,alignItems:'center',borderWidth:1,justifyContent:'center'},selected==e.id?{borderColor:'#96A825'}:{borderColor:'#323231'}]}>
                        <View style={{width:76,height:76,overflow:'hidden',borderRadius:45,borderWidth:2,borderColor:'#323231',justifyContent:'center'}}>
                            <Image source={e.photo_url ? {uri:e.photo_url} : undefined} style={{width:66,height:66,borderRadius:60,resizeMode:'contain',alignSelf:'center'}} />
                        </View>
                    </View>
                    <Text style={{fontWeight:'bold',fontSize:13,marginTop:10,color:'#FFFFFF',textAlign:'center'}}>{e.name}</Text>
                    {this.props.selection && <Text style={{fontWeight:'normal',fontSize:10,marginTop:0,color:'#8e8e8e',textAlign:'center'}}>{e.status}</Text>}
                </TouchableOpacity>)

            })}
                </ScrollView>


            </View>);
    }

}