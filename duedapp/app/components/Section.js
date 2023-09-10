/**
 * Created by jedrzej on 4/07/2022.
 */


import * as React from 'react';
import {  Text, View, StyleSheet, StatusBar, SafeAreaView, ScrollView, TextInput, Button, TouchableOpacity, Dimensions } from 'react-native';
import { Link } from '@react-navigation/native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import {Layout} from '../api/API';

import APIEvents from '../api/APIEvents';
import FormRenderer from '../components/FormRenderer';
import Heading from "./Heading";



const initialLayout = { width: Dimensions.get('window').width };

export default class Section extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            tabs: ['All Forms'],
            index: 0,
            list: null,
            routes: this.props.fields.map(e=>{
                return {key: e.id, title: e.name}
            }),
            /*routes: [
             {key: 'Details', title: 'Details'},
             {key: 'Services', title: 'Services'},
             {key: 'Reviews', title: 'Reviews'},
             {key: 'Gallery', title: 'Gallery'},
             ],*/
            loaded: false
        }


        APIEvents.call('ActiveTab',this.state.routes && this.state.routes.length>0?this.state.routes[0].key:null);

    }

    componentDidMount = async ()=>{

        APIEvents.call('ActiveTab',this.state.routes && this.state.routes.length>0?this.state.routes[0].key:null);
    }

    setIndex = (i)=>{
       // console.log('set index',i);
        this.setState({index:i});
        APIEvents.call('ActiveTab',this.state.routes && this.state.routes.length>0 && this.state.routes[i]?this.state.routes[i].key:null);
    }

    updateErrorsSet = (field,errs)=>{
        this.props.updateErrorsSet({id:this.props.id},errs);
/*
        let errorsSet = this.props.errorsSet || {};

        errorsSet[this.props.id+"EEEE"] = errs;

        if(this.props.updateErrorsSet){
            console.log('hi idx1',field.id,this.props.id,errorsSet);
            this.props.updateErrorsSet({id:this.props.id},errorsSet);
        }*/
    }



    render = ()=>{

        let {index, routes} = this.state;
        let errors = this.props.errorsSet ? this.props.errorsSet : {};
/*
        const renderScene = ({ route, index }) => {
            //console.log('rrr',route.key,(this.state.list && this.state.list[route.key]) || []);


            for(let i in this.props.fields){
                const field = this.props.fields[i];
                let error = errors && errors[field.id];

                if(field.id==route.key){


                    if(!this.props.plan[field.id]) this.props.plan[field.id] = {};


                    return ;

                }
            }

            return <View></View>;
        };
*/
        const field = this.props.field;
        let error = errors;

        const tracerid = this.props.tracerid+"."+field.id;

        return (<View style={{marginTop:0,marginLeft:10,marginRight:10}} >

            <Heading key={"fieldtxt"+field.id} size={this.props.parentIsSection?-4:-3}
                     error={error}
                     styleSetup={this.props.styleSetup}
                     style={{marginLeft:-10,paddingTop:0,paddingBottom:16}}>{(field.name)}</Heading>


            <FormRenderer
                key={"fieldsubform"+field.id}
                setScrollEnabling={this.props.setScrollEnabling}
                id={field.id}
                tracerid={tracerid}
                navigation={this.props.navigation}
                isEditable={this.props.isEditable}
                isNew={this.props.isNew}
                styleSetup={this.props.styleSetup}
                parentIsSection={true}

                selected={this.props.selected}

                saveMe={(plan,fieldx,traceridx)=>{
                    this.props.plan = plan;
                    // console.log('save me',plan);
                    this.props.saveMe(this.props.plan,fieldx,traceridx);
                }}

                updateErrorsSet={(fieldx,errs)=>{

                    let errorsSet = error || {};

                    errorsSet[field.id] = errs;

                    if(this.updateErrorsSet){
                        console.log('hi idx2',fieldx.id,field.id,errorsSet);
                        this.updateErrorsSet(field,errorsSet);
                    }
                }}

                errorsSet={error}
                plan={this.props.plan}

                fields={field.fields}

                formFill={(subfield,value)=>{

                    this.props.plan[subfield.id]=value;
                    this.setState({rand:Math.random()});
                    this.props.saveMe(this.props.plan,subfield,tracerid+"."+subfield.id);
                }}/>

        </View>);



    }

}
const renderTabBar = props => (
    <ScrollView horizontal={true} style={{flexGrow:0,height:56,backgroundColor:'#121B36'}}><TabBar
        {...props}
        getLabelText={({ route }) => route.title}
        indicatorStyle={{ backgroundColor: '#96a825',height:0 }}

        tabContainerStyle={(a,b,c)=>{
           // console.log('xxx',a,b,c);
        }}
        indicatorContainerStyle={{ }}


        renderLabel={({ route, focused, color }) => (
      <View style={{flex:1,margin:-10,justifyContent:'center',backgroundColor:focused?'#0974DB':'transparent'}}><Text style={{ color:'#FFF',margin: 18,fontWeight:'bold',fontFamily:'Overpass-Regular' }}>
        {route.title}
      </Text></View>
    )}


        style={{ height:60, width: 'auto',backgroundColor: 'transparent' }}
        labelStyle={{height:30,fontWeight:'bold',fontSize:14,textTransform:'none'}}
        /></ScrollView>
);

const renderItem = ({})=>{

    return <TouchableOpacity></TouchableOpacity>

};

