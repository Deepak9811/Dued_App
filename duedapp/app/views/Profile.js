/**
 * Created by jedrzej on 15/06/2020.
 */


import * as React from 'react';

import {  Text, View, StyleSheet, StatusBar, SafeAreaView, Button as ButtonX,
    Animated as AnimatedX , Image, TouchableOpacity,Platform, Alert,
    Easing as EasingX } from 'react-native';

import ImagePicker from 'react-native-image-picker';

import { decode } from "base64-arraybuffer";


import { Layout, API, _ } from '../api/API';
import APIEvents from '../api/APIEvents';

import Background from '../components/Background';

 class CurrentView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            salons: [],};
    }

     componentDidMount = async ()=>{
         this.delay = null;

         API.postProfileDetails({},(err,dt)=>{

             if(dt && dt.success){

                 this.setState({...dt});



                 API.getSalons({},(err,dt)=>{
                     //console.log('salons',dt,err);

                     if(dt){
                         //if(!this.state.selectedSalon){
                           //  dt.list.unshift( [{label:"xxx",value:null}] );
                         //}
                         this.setState({salons:dt.list || []});
                     }

                 })
             }
         });

     }

     callAvatar = (url)=>{

         API.setSessionData('photo_url',url);

         APIEvents.call('avatar');

         this.props.navigation.setParams({ 'newAvatar':Math.random() });

     }

     showImagePicker = ()=>{


         const options = {
             title: 'Select Avatar',
          //   customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
            /* storageOptions: {
                 skipBackup: true,
                 path: 'images',
             },*/
         };
         ImagePicker.showImagePicker(options, (response) => {

             if (response.didCancel) {
                 console.log('User cancelled image picker');
             } else if (response.error) {
                 console.log('ImagePicker Error: ', response.error);
             } else if (response.customButton) {
                 console.log('User tapped custom button: ', response.customButton);
             } else {

                 API.postProfileUplink({type:response.type},(err,dt)=>{

                     if (err) {
                         alert(err);
                     }
                     else if (!dt.success) {
                         alert(dt.message || "Sorry, We cannot complete your request at this time! :(");
                     }
                     else if(dt && dt.success){


                         var file = {
                             uri:response.uri,
                             type: response.type,
                             name: `test.jpg`,
                         }

                         const arrayBuffer = decode(response.data);

                         /*var file = {
                             uri: response.data, //pickerResp.uri,
                             type: response.type,
                             name: `test.jpg`,
                         };*/
                         //var buf = new Buffer(base64image.replace(/^data:image\/\w+;base64,/, ""), 'base64')

                         function uploadFile(file, signedRequest,  cb ) {
                             const xhr = new XMLHttpRequest();
                             xhr.open('PUT', signedRequest);
                             //xhr.setRequestHeader('ContentEncoding', 'base64');

                             xhr.setRequestHeader('X-Amz-ACL', 'public-read');
                             if(Platform.OS != 'ios'){
                                 xhr.setRequestHeader('Content-Type', file.type);
                             }
                             xhr.onreadystatechange = function() {
                                 if (xhr.readyState === 4) {
                                     if(xhr.status === 200) {
                                         cb()
                                     } else {
                                         console.log('xhr.status',xhr.status, +xhr._response.substr(0,128));
                                         alert('Could not upload file.'+xhr.status+' '+xhr._response.substr(0,128));
                                     }
                                 }
                             };
                             xhr.send(arrayBuffer);
                         };

       //console.log('upload dt.upload_url',dt)
                         uploadFile(file,dt.upload_url, ()=> {
                                 console.log('success', dt.photo_url);

                                 API.postProfileSetPhoto({photo_url:dt.photo_url}, (err, dto)=> {

        //console.log('ddd',err,dto);

                                     if (err) {
                                         alert(err);
                                     }
                                     else if (!dto.success) {
                                         alert(dto.message || "Sorry, We cannot complete your request at this time! :(");
                                     }
                                     else if (dto && dto.success) {

                                         this.callAvatar(dt.photo_url);

                                         this.setState({photo_url: dt.photo_url});

                                     }

                                 });
                             });

                     }
                 });

             }
         });

     }

     form = (e,v)=> {


         this.state[e] = v;

         this.setState({random:Math.random()});

     }
     login = ()=>{

         let payload = {
             name: this.state.name,
         };

     }


     renew = ()=>{

         this.props.navigation.navigate('Purchase',{id:this.state.membership.planId});

     }

    render() {


        return (
            <Background page="Profile">

            </Background>
        );
    }
}


const styles = StyleSheet.create({

});

export default CurrentView;