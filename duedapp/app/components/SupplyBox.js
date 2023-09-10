/**
 * Created by jedrzej
 */


import * as React from 'react';
import {
    Text,
    View,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    TextInput,
    Image,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { Link } from '@react-navigation/native';

import {_, Layout} from '../api/API';
import Quantities from "./Quantities";

export default class SupplyBox extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            revealed: false
        };

    }
    reveal = ()=>{


        this.setState({revealed:!this.state.revealed});


    }



    render = ()=>{

        const e = this.props.e;

        let more;
        const text = [];
        const description = (e.description+"").split(' ');
        for(let i =0,c=description.length,l=0;i<c;i++){

            text.push(description[i]);
            l+=(description[i]+"").length;
            if(l>100 && !this.state.revealed) {
                text.push('');
                more = (<Text style={{color:'#FFF',borderRadius:5,backgroundColor:'rgba(255,255,255,0.19)'}}>more...</Text>)
                break;
            }

        }
        if(!more){
          //  text.push('');
          //  more = (<Text style={{color:'#FFF',borderRadius:5,backgroundColor:'rgba(255,255,255,0.19)'}}>less</Text>)
        }

        return (<View key={"orderI"+e.id} onPress={this.props.onPress}
                      style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'rgba(255,255,255,0.19)',borderRadius:15,marginBottom:10,paddingVertical:8}}>

            <View style={{flexDirection:'row',width:Dimensions.get('window').width-160,marginRight:20,alignItems:'center'}}>

                <View style={{justifyContent:'center',alignItems:'center'}}>
                    <View style={{borderWidth:2,borderRadius:45,marginLeft:20,marginRight:20,
                        marginBottom:10,
                        width:75,height:75,borderColor:'white',overflow:'hidden',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        {e.image?<Image source={{uri:e.image}} resizeMode={'cover'} style={{ backgroundColor:'transparent',width:75,height:75}} />:undefined}

                    </View>

                    <Quantities
                        quantity={this.props.quantity}
                                onChange={this.props.changeQuantity}
                                max={99} min={0} />
                </View>
                <TouchableOpacity onPress={()=>{
                    this.reveal();
                }}>
                    <Text style={{fontFamily:'Roboto-Regular',fontSize:17,color:'white'}}>{_(e.name)}{"\n"}<Text style={{fontSize:14}}>{text.join(' ')}{more}</Text></Text>

                </TouchableOpacity>
            </View>

        </View>);

    }

}
