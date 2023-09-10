/**
 * Created by jedrzej on 15/06/2020.
 */


import * as React from 'react';
import {  Text, View, StyleSheet, StatusBar, SafeAreaView, TextInput,Image, TouchableOpacity,Dimensions, PanResponder,Platform  } from 'react-native';
import TextBox from 'react-native-password-eye';
import FeatherIcon from 'react-native-vector-icons/Feather';
import SignatureCapture from 'react-native-signature-capture';

const moment = require('moment');
import DateTimePicker from '@react-native-community/datetimepicker';

const initialLayout = { width: Dimensions.get('window').width };


import APIEvents from '../api/APIEvents';
import Para from "./Para";
import {Layout} from "../api/API";

import SignatureScreen from "react-native-signature-canvas";
import AsyncStorage from '@react-native-async-storage/async-storage';


const imgWidth = Dimensions.get('window').width;
const imgHeight = Dimensions.get('window').height;
const IS_ANDROID = Platform.OS === 'android';

const styling = `
.m-signature-pad--body {border: none;}
.m-signature-pad--footer {display: none; margin: 0px;padding:0px}
.m-signature-pad {
    position: absolute;
    font-size: 10px;
    border: 0px #fff;
    width: ${imgWidth}px;
    margin:auto; 
    top: 0;
    height: 200px;
    background-color: #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.27), 0 0 40px rgba(0, 0, 0, 0.08) inset;
  }`;


export default class Input extends React.Component {
    constructor(props) {
        super(props);
        this.sign = React.createRef();
        this.state = {
            text: props.text,
            isSecure: true,
        };
        if(props.type=='signature'){
            APIEvents.addListener('ChangeSignatures','Change'+props.id,(a,b,c)=>{

                let bbk = a && a.find(e=>props.id==e);


               // console.log('drag xx',props.id,this.drag2,a,b,c,bbk);


                    if(bbk){
                        //clearTimeout(this.drag2);
                        this.state.expectSave = true;
                       // console.log('drag grad',props.id,!!this.saveSignature);
                       if(IS_ANDROID){
                        if(this.saveSignature) this.saveSignature();
                       }else{
                        if(this.handleEnd) this.handleEnd();
                       }
                        
                    }

            });

        }
        APIEvents.addListener('BlurBlur','Change'+props.id,(id)=>{

            if(props.id!=id && this.turnOffEditing){
                this.turnOffEditing();
            }
        });

      
    }

    componentWillUnmount () {

        //if(this.props.type=='signature') {
        APIEvents.removeListener('BlurBlur', 'Change' + this.props.id);
        APIEvents.removeListener('ChangeSignatures', 'Change' + this.props.id);
        //}
    }

    onChangeText = (text)=>{
        text = this.checkValidateType(text);

        this.setState({text});

        this.props.onSubmitEditing(text);


    }


    onFocus= ()=>{
        APIEvents.call('BlurBlur',this.props.id);
    }

    onBlurMethod = (blur)=>{

        if(this.props.onBlur) this.props.onBlur(this.state.text);


    }

    turnOffEditing = ()=>{
        if(this.state.editing) {
           // this.setState({editing: false});
            //console.log('blur mex', this.props.id);
        }

    }

    checkValidateType = (text)=>{
        if(text) switch(this.props.validation){
            case 'price':
                text = text.replace(/,/,'.').replace(/,/g,'').replace(/[^0-9.]/g,'');
                break;
            case 'number':
                text = (text.replace(/[^0-9.\-]/g,''))+"";

                let exceprt = false;

                if(text.match(/[\.]/) && text.match(/[\.]$/) && text.match(/[\.]/g).length<=1){
                    exceprt = true;
                }
                else if(text.match(/[\-]/) && text.match(/[\-]$/) && text.match(/[\-]/g).length<=1){

                    exceprt = true;
                }
                else {
                    // console.log('hi nuber?',text);

                    text = text.replace(/([\.][0-9]{1,2})([0-9]*)$/,'$1');

                    //console.log('hi nuber2?',text);

                    // text = (Math.round(parseFloat(text)*100)/100)+"";
                }
               // console.log('text2',text,isNaN(text),exceprt)

                // decimal
                if(!exceprt && isNaN(text)){
                    text = "";
                }


                break;
            case 'int':
                text = text.replace(/[^0-9]/g,'');

                text = parseInt(text)+"";

                if(isNaN(text)){
                    text = "";
                }
                break;
            case 'uint':
                text = text.replace(/[^0-9]/g,'');

                if(parseInt(text)<0) text = "0";
                else text = parseInt(text)+"";

                if(isNaN(text)){
                    text = "";
                }
                break;

        }



        return text;
    }


    componentDidUpdate(prevProps, prevState) {
        if (this.props.text && this.props.text !== prevState.text) {
            this.setState({text:this.props.text});
        }
    }

    _onSaveEvent = (result) => {
        //result.encoded - for the base64 encoded png
        //result.pathName - for the file path name
        // console.log('saved :->',this.props.id,!!result,this.state.expectSave);

        if(result && result.encoded && this.state.expectSave){

            this.props.onSubmitEditing(result.encoded);
        }
        this.state.expectSave = false;



    }
    _onDragEvent = ()=>{
        console.log('drag _onDragEvent 3',this.props.id);
        // This callback will be called when the user enters signature
       /* if(this.drag1) clearTimeout(this.drag1)
        if(this.drag2) clearTimeout(this.drag2)
        if(this.drag3) clearTimeout(this.drag3)*/

    //    this.saveSignature();

     //   this.drag1 = setTimeout(()=>this.saveSignature(),1000);
        /*this.drag2 = setTimeout(()=>{
            this.drag2 = null;
            console.log('drag sign 3',this.props.id);
            if(this.saveSignature) this.saveSignature()
        },4000);*/
       // this.drag3 = setTimeout(()=>this.saveSignature(),8000);

    }


    changeSignature = ()=>{

        this.props.onSubmitEditing("");
        this.setState({rand:Math.random()});
    }

    saveSignature = ()=>{
        // console.log('drag sign 2',this.props.id, !!this.sign, !!this.sign.current.saveImage);
        if(this.sign &&  this.sign.current.saveImage){

            this.sign.current.saveImage();
        }

    }

    editInput = (data)=>{

        this.props.navigation.navigate('Picker',data);

        //this.setState({editing:true});
    }


    handleOK = (signature) => {
        // console.log('signature :->>> ',signature);
        // this.props.onSubmitEditing(signature);
        // alert(signature); // Callback from Component props
        if(signature && this.state.expectSave){

            this.props.onSubmitEditing(signature.replace('data:image/png;base64,',''));
        }

        this.state.expectSave = false;
      };

      handleEnd = async() => {
          // await AsyncStorage.setItem('scrollEnable',true)
          this.sign.current.readSignature();
          this.props.scrollEnable(true)

      };

    render = ()=>{
        "use strict";
        
        



        const style = {
            fontFamily: 'Roboto-Regular',
            fontSize: 17,
            height: this.props.numberOfLines>1?this.props.numberOfLines*33:60,
            marginTop: 0,

            paddingTop: this.props.numberOfLines>1?20:0,

            paddingLeft:20,
            marginBottom: 20,
            color: 'black', borderColor: '#DDD',
            backgroundColor:'white',
            borderRadius:10, borderBottomWidth: 1 };


        const styleText = {
            fontFamily: 'Roboto-Regular',
            fontSize: 17, lineHeight:60,
            color: 'black',borderBottomWidth: 1
        };


        const placeholderColor = this.props.placeholderColor || style.placeholderTextColor || undefined;
        if(placeholderColor){
            delete style.placeholderTextColor;
        }

        let text = this.checkValidateType(this.state.text); //  || ''

        let errorBar = undefined;
        if(this.props.error && this.props.error!='Please complete'){

            errorBar = <Para size={5} style={{color:'red',marginHorizontal:10,marginBottom:20}}>{this.props.error}</Para>;

        }

        const parseAutocompleteToAllowedValue = (x)=>{

            switch(x+""){

                case 'off':
                case 'username':
                case 'password':
                case 'email':
                case 'name':
                case 'tel':
                case 'street-address':
                case 'postal-code':
                case 'cc-number':
                case 'cc-csc':
                case 'cc-exp':
                case 'cc-exp-month':
                case 'cc-exp-year':
                    return x+"";

            }

            return undefined;

        };

        if(this.props.type=='signature'){
// console.log('have sig?',this.props.id,this.props.signature);
            if(this.props.signature){

                return (<TouchableOpacity disabled={this.props.disabled} onPress={this.changeSignature} style={this.props.style}>

                    <Text style={{fontFamily:"Roboto-Regular",color:"white",marginBottom:10,fontSize:17}}>{this.props.placeholder}</Text>

                    <Image
                          source={{uri: `data:image/png;base64,${this.props.signature}`}}
                        resizeMode="cover"
                        style={{width:'100%',height:200,backgroundColor:'white',borderRadius:15}}
                        />

                    {!this.props.disabled ? <Text style={{color:'blue',position:'absolute',top:'50%',textAlign:'center',width:'100%',backgroundColor:'rgba(255,255,255,0.8)'}}>CHANGE</Text> : undefined}

                </TouchableOpacity>);
            }

//console.log('hello',this.props.id+"sig");
            return (
                <View  style={this.props.style}>
                    <Text style={Layout.textStyle(this.props.styleSetup,{fontFamily:"Roboto-Regular",color:"white",marginBottom:10,fontSize:17})}>{this.props.placeholder}</Text>
                    <View 
                        style={{width:initialLayout.width-20,height:200,marginLeft:0,marginRight:5,borderRadius:10,overflow:'hidden',}}
                    >

                        {IS_ANDROID?(
                            <SignatureCapture
                            style={[{flex:1},styles.signature]}
                            key={"ex"+this.props.id+"sig"}
                            ref={this.sign}
                            onSaveEvent={this._onSaveEvent}
                            onDragEvent={this._onDragEvent}
                            saveImageFileInExtStorage={false}
                            showNativeButtons={false}
                            showTitleLabel={false}
                            />
                        ):(

                       
<SignatureScreen
    ref={this.sign}
    key={"ex"+this.props.id+"sig"}
    // bgWidth={imgWidth}
    // bgHeight={imgHeight}
    webStyle={styling}
    onBegin={() => this.props.scrollEnable(false)}
    onEnd={this.handleEnd}
    onOK={this.handleOK}
  />
  )}



                        {/*<TouchableOpacity onPress={this.saveSignature} style={{position:'absolute',backgroundColor:'transparent',padding:20,right:50,bottom:0}}>
                            <Text style={{color:'blue',textAlign:'center'}}>OK</Text>
                        </TouchableOpacity>*/}

                    </View>
                    {errorBar?<View style={{marginTop:10}}>{errorBar}</View>:undefined}
                </View>);

        }
        if(this.props.type=='date'){

            if(this.props.disabled){

                text = text && (text+"").length>0 ? moment(text).format("DD/MM/YYYY") : '--';
            }
            else {

                return (<View>

                        <Text
                            style={Layout.textStyle(this.props.styleSetup,{fontFamily:"Roboto-Regular",color:"white",marginBottom:10,fontSize:17})}>{this.props.placeholder}</Text>


                    {this.state.editing ? <View
                            style={[style,this.props.style,{height:'auto'},this.props.disabled?{backgroundColor:'#DDD'}:{}]}>

                            {(
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={text && (text+"").length>0?moment(text).toDate():new Date()}
                                    mode={"date"}
                                    is24Hour={true}
                                    textColor="black"
                                    display="spinner"
                                    onChange={(event,date)=>{

                                        this.onChangeText((date));

                                    }}
                                    />
                            )}


                        </View> : <TouchableOpacity onPress={()=>this.editInput({name: this.props.placeholder,onChangeText:this.onChangeText,mode:'date',value:text && (text+"").length>0?moment(text).toDate():new Date()})} style={{height:60,paddingHorizontal:20,justifyContent:'center',backgroundColor:this.props.disabled?'#DDD':'#FFF',borderRadius:10,marginBottom:20}}>

                    <Text style={{fontFamily:"Roboto-Regular",color:"black",lineHeight:60,marginBottom:10,fontSize:17}}>{text && (text+"").length>0 ? moment(text).format("DD/MM/YYYY") : '--:--'}</Text>

                </TouchableOpacity>}
                        {errorBar}


                    </View>);

            }

        }

        if(this.props.type=='datetime'){

            if(this.props.disabled){
                text = text && (text+"").length>0 ? moment(text).format("DD/MM/YYYY HH:mm") : '--';
            }
            else {
                return (
                    <View>
                        <Text
                            style={Layout.textStyle(this.props.styleSetup,{fontFamily:"Roboto-Regular",color:"white",marginBottom:10,fontSize:17})}>{this.props.placeholder}</Text>

                        {this.state.editing ? <View
                            style={[style,this.props.style,{height:'auto'},this.props.disabled?{backgroundColor:'#DDD'}:{}]}>
                            {(
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={text && (text+"").length>0?moment(text).toDate():new Date()}
                                    mode={"date"}
                                    is24Hour={true}
                                    textColor="black"
                                    display="spinner"
                                    onChange={(event,date)=>{
                                        this.onChangeText((date));
                                    }}
                                    />
                            )}
                        </View> : <TouchableOpacity  onPress={()=>this.editInput({name: this.props.placeholder,onChangeText:this.onChangeText,mode:'datetime',value:text && (text+"").length>0?moment(text).toDate():new Date()})}  style={{height:60,paddingHorizontal:20,justifyContent:'center',backgroundColor:this.props.disabled?'#DDD':'#FFF',borderRadius:10,marginBottom:20}}>

                        <Text style={{fontFamily:"Roboto-Regular",color:"black",lineHeight:60,marginBottom:10,fontSize:17}}>{text && (text+"").length>0 ? moment(text).format("DD/MM/YYYY HH:mm") : '--:--'}</Text>

                    </TouchableOpacity>}
                        {errorBar}
                    </View>);
            }
        }
        if(this.props.type=='time'){

            if(this.props.disabled){

                text = text && (text+"").length>0 ? moment(text).format("HH:mm") : "--";
            }
            else {

                return (
                    <View>

                        <Text
                            style={Layout.textStyle(this.props.styleSetup,{fontFamily:"Roboto-Regular",color:"white",marginBottom:10,fontSize:17})}>{ this.props.placeholder}</Text>


                        {this.state.editing ? <View
                            style={[style,this.props.style,{height:'auto'},this.props.disabled?{backgroundColor:'#DDD'}:{}]}>

                            {this.props.disabled?undefined:(
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={text && (text+"").length>0?moment(text).toDate():new Date()}
                                    mode={"time"}
                                    textColor="black"
                                    is24Hour={true}
                                    display="spinner"
                                    onChange={(event,date)=>{

                                        this.onChangeText((date));


                                    }}
                                    />
                            )}


                        </View> : <TouchableOpacity  onPress={()=>this.editInput({name: this.props.placeholder,onChangeText:this.onChangeText,mode:'time',value:text && (text+"").length>0?moment(text).toDate():new Date()})}  style={{height:60,paddingHorizontal:20,justifyContent:'center',backgroundColor:this.props.disabled?'#DDD':'#FFF',borderRadius:10,marginBottom:20}}>

                            <Text style={{fontFamily:"Roboto-Regular",color:"black",lineHeight:60,marginBottom:10,fontSize:17}}>{text && (text+"").length>0 ? moment(text).format("HH:mm") : '--:--'}</Text>

                        </TouchableOpacity>}
                        {errorBar}


                    </View>);

            }


        }


        if(this.props.type=='password'){


            return (
                <View>
                    <Text style={Layout.textStyle(this.props.styleSetup,{fontFamily:"Roboto-Regular",color:"white",marginBottom:10,fontSize:17})}>{this.props.placeholder}</Text>
                    <View>


                    <TextInput
                        style={[style,this.props.style]}
                        secureTextEntry={this.state.isSecure}
                        autoCompleteType={parseAutocompleteToAllowedValue(this.props.autoCompleteType || this.props.type)}
                        autoCorrect={this.props.autoCorrect}
                        autoCapitalize={this.props.autoCapitalize}

                        keyboardType={this.props.keyboardType}
                        onChangeText={text => this.onChangeText(text)}
                        editable={!this.props.disabled}
                        onFocus={this.onFocus}

                        multiline={this.props.multiline}
                        placeholder={this.props.placeholder}
                        placeholderTextColor={this.props.placeholderColor || '#B5B1B1'}

                        value={text}
                        />
                    <TouchableOpacity onPress={() => this.setState({isSecure:!this.state.isSecure})} style={{position:'absolute',right: 5,top:12,padding:10}}>
                        <FeatherIcon name={this.state.isSecure ? 'eye' : 'eye-off'} size={18} color={'#B5B1B1'} />
                    </TouchableOpacity>
                        </View>
                    {errorBar}
                </View>);
        }


        //console.log('auto complete',this.props.autoCompleteType, this.props.type);


        return (
            <View>

                <Text style={Layout.textStyle(this.props.styleSetup,{fontFamily:"Roboto-Regular",color:"white",marginBottom:10,fontSize:17})}>{this.props.placeholder}</Text>

                <TextInput
                    style={[style,this.props.style,this.props.disabled?{backgroundColor:'#DDD'}:{}]}
                    secureTextEntry={this.props.type=='password'}
                    autoCompleteType={parseAutocompleteToAllowedValue(this.props.autoCompleteType || this.props.type)}
                    autoCorrect={this.props.autoCorrect}
                    autoCapitalize={this.props.autoCapitalize}

                    keyboardType={this.props.keyboardType}
                    onChangeText={text => this.onChangeText(text)}
                    onBlur={this.onBlurMethod}
                    onFocus={this.onFocus}

                    editable={!this.props.disabled}
                    numberOfLines={this.props.numberOfLines}
                    multiline={this.props.numberOfLines>1}
                    placeholder={this.props.placetext}
                    placeholderTextColor={this.props.placeholderColor || '#B5B1B1'}

                    value={text}
                />
                {errorBar?<View style={{marginTop:-10}}>{errorBar}</View>:undefined}

            </View>);
    }

}


const styles = StyleSheet.create({


});
