

import React from 'react';

import {
    SafeAreaView,
    StyleSheet,
    ScrollView,TouchableOpacity,Platform,
    View,
    Text,Image,
    StatusBar,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import APIEvents from '../api/APIEvents';
import {API,_} from '../api/API';

import HeaderRightLogged from './HeaderRightLogged';
import PlusButton from '../components/PlusButton';
import settings from "../../settings";







export default  ({ navigation }) => ({
    headerTransparent: false,
    headerBackTitleVisible: false,
    headerStyle: {
        backgroundColor:'#17254D',
        shadowRadius: 0,
        height:80,
        shadowOffset: {
            height: 0,
        },
    },

    tabBarComponent: props =>{
        return(

            <React.Fragment>
                <TabBarComponent {...props} />
            </React.Fragment>

        )
    },
    cardStyle: {
        backgroundColor:'transparent',
        shadowRadius: 0,
        shadowOffset: {
            height: 0,
        },
    },
    tabBarOptions: {
        activeTintColor: 'yellow',
        inactiveTintColor: 'white',
        labelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
            fontFamily: 'Arial'
        },
        style: {}
    },

    headerTitle : (a)=>{
        /*if(a.children=='Home (TEST)' || a.children == 'Home'){

         return <View onPress={()=>APIEvents.call('menuOpen')} style={{
         width:'100%',flexDirection:'column',alignItems:'center',paddingTop:4,height:80}}>
         <Image source={require('../../assets/Logo-White.png')} style={{width:120,resizeMode:'contain',marginTop:30}} />
         </View>;
         /*
         return <Image source={require('../../assets/Logo-White.png')}
         style={{tintColor:'#0087CB',width:120,backgroundColor:'red',resizeMode:'contain',marginTop:0}} />;* /
         }*/

        return <Text style={[a.style,{maxWidth:DeviceInfo.isTablet()?400:180,textAlign:'center'}]}>{_(a.children)}{settings.isProduction?"":<Text style={{fontSize:10,color:'red'}}>{"\n"}TEST TEST TEST</Text>}</Text>;
    },

    headerLeft: () => {
        return <HeaderRightLogged navigation={navigation} />;
    },

    headerRight: () => {

        //console.log('hl r');

        if(API.isAuthorized()){
            let data = API.getSession();

            /*
             return (<TouchableOpacity onPress={()=>navigation.navigate('Profile',{})}>
             <Image source={data && data.photo_url?{uri:data.photo_url}:require('../../assets/baseline-notes-24px.png')} style={{width:34, height:34, resizeMode:'cover', borderRadius:34,margin:10}} />
             </TouchableOpacity>);*/
        }

       return <PlusButton style={{zIndex:10,marginRight:10,marginTop:Platform.OS=='android'?1:0}} label={_("ADD")} type={'black-small'} onPress={()=>APIEvents.call('currentTaskAdd')} />;

    },

    headerBackTitleStyle: {
        paddingTop: 0,
    },

    headerTintColor: 'white',
    headerTitleStyle: {  fontFamily: 'Roboto-Regular', fontSize: 17, color: 'white'}
});
