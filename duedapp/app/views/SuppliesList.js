/**
 * Created by jedrzej on 1/06/2020.
 */


import * as React from 'react';

import {  Text, View, StyleSheet, StatusBar, SafeAreaView, Button as ButtonX,TouchableOpacity,Platform,
    Animated as AnimatedX , Image, ScrollView,
    Easing as EasingX, Dimensions } from 'react-native';


import SplashScreen from 'react-native-splash-screen'

var moment = require('moment');

import { SearchBar } from 'react-native-elements';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import LinearGradient from 'react-native-linear-gradient';

import settings from '../../settings';

import { Layout , _, API } from '../api/API';
import APIEvents from '../api/APIEvents';

import SupplyBox from '../components/SupplyBox';
import Background from '../components/Background';
import Heading from '../components/Heading';
import Window from '../components/Window';
import Para from '../components/Para';
import Button from '../components/Button';
import MembershipButton from '../components/MembershipButton';
import OfferBox from '../components/OfferBox';
import VoucherBox from '../components/VoucherBox';
import OfferSmallBox from '../components/OfferSmallBox';
import Quantities from '../components/Quantities';


import AlertText from '../components/AlertText';
import Lock from '../components/Lock';

class CurrentView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            page: 0,
            empty: true,
            orderValue: {}
        };

        APIEvents.addListener('favoriteCall','FavList',()=>{
            this.componentDidMount();
        });


        APIEvents.addListener('resetHome','FavList',()=>{
            this.componentDidMount();
        });



        this.props.navigation.setOptions({ title: "Supplies" });
    }
    componentWillUnmount () {

        APIEvents.removeListener('resetHome','FavList');
        APIEvents.removeListener('favoriteCall','FavList');
    }

    componentDidMount = async ()=>{

        API.getSuppliesList({page:this.state.page},(err,dt,showApiErrors)=>{

            if(err || !dt.success){

                if(showApiErrors){
                    alert(err || dt.message || "Error in API");
                }

                return;
            }

            if(dt.list){

                this.setState({...dt});

            }


        });



    }


    get pagination () {
        const { entries, activeSlide } = this.state;
        return (
            <Pagination
                dotsLength={3}
                activeDotIndex={activeSlide}
                containerStyle={{ marginTop:-80, backgroundColor: 'transparent' }}
                dotStyle={{
                  width: 8,
                  height: 8,
                  borderRadius: 5,
                  marginHorizontal: -10,
                  backgroundColor: '#0087CB'
              }}
                inactiveDotStyle={{
                  width: 8,
                  height: 8,
                  backgroundColor: '#161617'
                  // Define styles for inactive dots here
              }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={1}
                />
        );
    }

    order = (e)=>{

        this.props.navigation.navigate('SupplyOrder',{id:e.id,data:JSON.stringify(e)});

    }
    offsetCall = (a)=> {
        if(a==0){

            return this.setState({height:200});
        }

        this.setState({
            height: Math.max(0,200 - a)
        });
    }

    reset = ()=>{

        this.setState({orderValue:{},empty:true});

    }

    submit = ()=>{

        let orderValuex = [];

        for(let i in this.state.orderValue){
            orderValuex.push({
                id:i,
                quantity:this.state.orderValue[i]
            });
        }

        this.setState({loading:true});

        API.postSuppliesList({
            items: orderValuex
        },(err,dt,showApiErrors)=>{

            this.setState({loading:false});

            if(err || !dt.success){
                    alert(err || dt.message || "Error in API");
                return;
            }

            alert("Success! Your order number is "+dt.order_no);

            this.reset();
        });

    }

    render() {

        return (<Background scrolls={true} style={{flex:1}} offsetCall={this.offsetCall}>



            <View style={{paddingTop:10}}>
            {this.state.list ? this.state.list.map(e=>{

                return <SupplyBox e={e}
                                  key={"orderI"+e.id}
                                  onPress={()=>this.order(e)}
                                  changeQuantity={(ng)=>{ this.state.orderValue[e.id]=ng;  this.setState({empty:false,random:Math.random()})  }}
                                  quantity={this.state.orderValue[e.id] || 0}
                />;



            }) : undefined}

                </View>

                {!this.state.list || this.state.list.length==0?<Para style={{textAlign:'center',marginBottom:300,marginTop:30,flex:1}}>Nothing found</Para>:undefined}



                <View style={{height:0}}></View>

            <View style={{flexDirection:'row',justifyContent:'space-between'}}>

            <Button disabled={this.state.empty || this.state.loading} label={_(this.state.loading ? "Loading..." : "Reset")} type={"black-wide"} style={{marginTop:20}} onPress={this.reset} />
            <Button disabled={this.state.empty || this.state.loading} label={_(this.state.loading ? "Loading..." : "Place order")} type={"blue-smaller-wide"} style={{marginLeft:20,marginTop:20}} onPress={this.submit} />
            </View>
            <View style={{height:150}}></View>
        </Background>);


    }
}

const DescriptionElement = (props)=>{



}


const styles = StyleSheet.create({


});

export default CurrentView;
