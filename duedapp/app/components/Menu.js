

import React from 'react';

import {
    SafeAreaView,
    StyleSheet,
    ScrollView,TouchableOpacity,
    View,Button,
    Text,Image,Dimensions,
    StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
import { StackActions } from '@react-navigation/native';
import Share from 'react-native-share';
import VersionNumber from 'react-native-version-number';

const screenX = Dimensions.get('screen');
const windowX = Dimensions.get('window');

import APIEvents from '../api/APIEvents';
import {API, _} from '../api/API';

const MenuItem = ({onPress,image,text,mode,long})=>{

    let txt = <Text style={{fontFamily:'Poppins-Regular',fontSize:15,color:'white'}}>{_(text)}</Text>;

    return (<TouchableOpacity onPress={onPress} style={{flexDirection:'row',alignItems:'center',paddingVertical:8}}>
        {mode == 'left' && txt}
        <Image source={image} resizeMode={'contain'} style={{marginLeft:mode=='left'?5:20,marginRight:mode=='left'?15:20, width:long?24:24,height:long?28:24}} />
        {mode != 'left' && txt}
    </TouchableOpacity>);
}

export default class Menu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            closed: false
        };



        APIEvents.addListener('avatar','Menu',()=>{
            this.setState({random:Math.random()})

        });


        APIEvents.addListener('menuHideOpen','Menu',()=>{
            this.setState({closed:false})

        });
        APIEvents.addListener('menuHideClose','Menu',()=>{
            this.setState({closed:true})

        });
    }

    componentWillUnmount () {
        APIEvents.removeListener('avatar','Menu');
        APIEvents.removeListener('menuHideClose','Menu');
        APIEvents.removeListener('menuHideOpen','Menu');
    }
    home = (e)=>{
        this.props.navigation.dispatch(
            StackActions.replace( 'Home', {})
        );

        this.props.navigation.navigate('Home',{});
        APIEvents.call('menuClose');
    }
    about = (e)=>{
        this.props.navigation.navigate('About',{});
        APIEvents.call('menuClose');
    }
    faq = (e)=>{
        this.props.navigation.navigate('FAQ',{});
        APIEvents.call('menuClose');
    }
    settings = (e)=>{

        if(!API.isAuthorized()) {
            this.props.navigation.navigate('Login',{});
        }
        else {
            this.props.navigation.navigate('Profile',{});
        }
        APIEvents.call('menuClose');
    }
    share = (e)=>{


    }

    logout = ()=>{



        if(!API.isAuthorized()) return;

        API.postLogout({},()=>{

            APIEvents.call('resetHome');

            APIEvents.call('menuClose');
            this.props.navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });

        });


    }


    register = ()=>{


        APIEvents.call('menuClose');
        this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });


    }

    render() {

        const auth = API.isAuthorized();
        let data;
        if(auth){
            data = API.getSession();
        }

        //console.log('menu rd');

        const buildVersion = VersionNumber.buildVersion || "0";
        const versionVersion = VersionNumber.appVersion || "0";

        let heightX = screenX.height-(windowX.height);

        return (<View style={{flex: 1, width: '100%', backgroundColor:'#161617'}}>

            </View>
        );
    }
}
