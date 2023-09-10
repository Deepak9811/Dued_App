/**
 * Created by jedrzej on 15/06/2020.
 */


import * as React from 'react';
import {  Text, View, StyleSheet, Alert, StatusBar, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

var moment = require('moment'); // require

import {Layout} from '../api/API';
const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const dayNames = ["Mo","Tu","We","Th","Fr","Sa","Su"];



const dayOfM = {width:50,textAlign:'center',padding:5,color:'white',fontSize:15};
const dayOfMx = {textAlign:'center',height:35,padding:7,color:'white',fontSize:15,alignItems:'center'};
const oldDay = {color:'#8E8E8E',fontSize:15};
const selDay = {color:'#E1B625'};
const selDayD = {borderColor:'#E1B625',borderWidth:1,borderRadius:19};
const daySelected = {backgroundColor:'#96A825',borderColor:'#96A825',borderRadius:19,overflow:'hidden'};


const alertMe = (day,reason)=>{

    Alert.alert(moment(day+"").format('DD-MM-YYYY'),reason+"");

}


const Day = ({d,maxD,dayI,curD,curDate,daySelect,selectedDate,today,dayDate,enabled,reason,ispast})=>{

    return <View  style={[dayOfM,!enabled?{"opacity":0.5}:{}]}>
        <TouchableOpacity onPress={()=>enabled ?  daySelect(dayI) : alertMe(today,reason || "Barber is not allowing (yet!) this day to be booked")}
                          activeOpacity={dayI+1>=curD?0.2:1}>

            <Text key={d+dayI} style={[dayOfMx,enabled && dayDate.format('YYYY-MM-DD')==curDate?selDayD:{},dayI+1<curD?oldDay:{},selectedDate && selectedDate.format('YYYY-MM-DD')==dayDate.format('YYYY-MM-DD')?daySelected:{},!enabled && reason && !ispast?{color:'#b55d4d'}:{}]}>
                {dayI<0?'-':(dayI%maxD+1)}
            </Text>
        </TouchableOpacity>
    </View>;


}



export default class Description extends React.Component {


    constructor(props) {
        super(props);

        let startDate = new Date();
        let nextMonthStartDate = new Date();
        nextMonthStartDate.setDate(1);

        this.state = {
            selectedDate: null,
            startDate: startDate,
            nextMonthStartDate: new Date(nextMonthStartDate.setMonth(nextMonthStartDate.getMonth()+1)),
            more: false,
            selectedDay: null,
            selectedHour: null,
            currentMonth: 0,
            nextMonth: false,
            allowLeft: false,
            allowRight:true
        };
    }

    showmore = ( i )=> {

        this.setState({
            currentMonth: this.state.currentMonth+i,
            allowLeft: this.state.currentMonth+i>=1,
            allowRight: this.state.currentMonth+i<8
        });
    }

    selected = ({selectedDay,selectedDate})=>{



        this.setState({selectedHour:null,selectedDay,selectedDate},this.sendOut);


    }

    sendOut = ()=>{
        let {selectedDate,selectedHour} = this.state;


        if(selectedDate && selectedHour && this.props.setDate){
            const hour = selectedHour.split(':');
            selectedDate = selectedDate.hours(parseInt(hour[0])).minutes(parseInt(hour[1])).seconds(0);

            this.props.setDate(selectedDate);
        }
        else if(this.props.setDate) {

            this.props.setDate(null);
        }

    }

    selectedHour = ({selectedHour})=> {
        const {selectedDate} = this.state;

        this.setState({selectedHour},this.sendOut);

    }
/*
    componentDidUpdate(prevProps) {
        let nv = prevProps.selectedDate!=this.props.selectedDate

        if(nv && this.props.selectedDate) {
            this.setState({selectedDate: this.props.selectedDate});

        }
    }*/

    //

   render = ()=>{

        const {startDate,nextMonthStartDate,selectedDay,selectedHour,selectedDate, allowLeft, allowRight, nextMonth} = this.state;
        const {slots, barberUserId,reasons} = this.props;

        if(!barberUserId){
            return <View></View>;
        }
        if(typeof(slots)=="undefined"){
            return <View><Text>Barber not available</Text></View>;
        }

        const slot = slots;

        let newDate = new Date();
       /*if(this.state.currentMonth!=0)*/ newDate.setDate(1);
       newDate.setMonth(newDate.getMonth()+this.state.currentMonth);

       let newDateReal = new Date();
       if(this.state.currentMonth!=0) newDateReal.setDate(1);
       newDateReal.setMonth(newDateReal.getMonth()+this.state.currentMonth);

        let usableStartDate = new Date(newDate);
       //= nextMonth ? nextMonthStartDate : startDate;

       //console.log('usableStartDate',usableStartDate);
        let startDateU = usableStartDate.getTime() / 1000;
        let maxD =  new Date(usableStartDate.getFullYear(), usableStartDate.getMonth() + 1, 0).getDate();
        let curD =  usableStartDate.getDate();
        let curWeekD =  usableStartDate.getDay();
        if(curWeekD==0) curWeekD = 7;

       let startDateAsString = moment(usableStartDate).format('YYYY-MM-DD');
       let newDateRealAsString = moment(newDateReal).format('YYYY-MM-DD');

        let weeksC = 5; //this.state.more ? 4 : 2;

        let weeksElems = [];
        let todaySelected = null;
       // let firstDay = moment().subtract(curWeekD-1,'days');
       let otherMonthDays = 0;
       let currentMonth = null;

       let allowedMonth = moment(usableStartDate).format('YYYY-MM');

        for(let i = 0,dayI=curD-curWeekD ;i<weeksC;i++){

            let daysElems = [];
            let isMonthChanged = false;

            let todayx;

            for(let e = 0; e<7;e++){

                todayx = moment(newDate).date(dayI+1);
                let today = moment(newDate).date(dayI+1);
                if(currentMonth===null) currentMonth = today.format('YYYY-MM');
                let todayF = today.format('YYYY-MM-DD');
                if( selectedDay==dayI) {
                    todaySelected = todayF;
                }
                if(today.format('YYYY-MM')>allowedMonth){
                    isMonthChanged = true;

                    for(let e0=e;e0<7;e0++){
                        daysElems.push(<View style={[dayOfM]} key={"day"+e0+"-"+dayI}></View>);
                    }

                    break;
                }
                if(!isMonthChanged) otherMonthDays++;

                daysElems.push(<Day key={"day"+dayI}
                                    d={e}
                                    enabled={typeof(slot[todayF])!="undefined"}
                                    ispast={newDateRealAsString>todayF}
                                    reason={reasons && reasons[todayF]?reasons[todayF]:(newDateRealAsString>todayF?"Date in past":(startDateAsString==todayF?"Sorry, you cannot book today anymore":undefined))}
                                    today={todayF}
                                    dayI={dayI}
                                    dayDate={today}
                                    maxD={maxD}
                                    curD={nextMonth ? -100 : curD}
                                    curDate={this.state.currentMonth==0?startDateAsString:''}
                                    selectedDate={selectedDate}
                                    daySelect={(d)=>this.selected({selectedDay:d,selectedDate:today})}/>);

                dayI++;
            }

            weeksElems.push(<View key={"weeksElems"+i} style={{flexDirection:'row',justifyContent:'space-evenly'}}>{daysElems}</View>);
            if(isMonthChanged ){

                break;
                //weeksElems.push(<View key={"weeksElemsx"+i} style={{flexDirection:'row',marginTop:10,marginBottom:10,justifyContent:'space-evenly'}}><Text style={{color:'#AAA',letterSpacing:3}}>{monthNames[todayx.toDate().getMonth()].toUpperCase()} {todayx.toDate().getFullYear()}</Text></View>);
            }
        }


        let hourSe = [];
        if(selectedDay!==null && typeof(selectedDay)!="undefined"){

            let hourAv = slot[todaySelected];

            let hourSelection = [];

            for(let hourKey in hourAv){

                let hour = hourAv[hourKey][0];

                hourSelection.push(<View key={hour} style={[{margin:5,borderRadius:4,height:36,borderWidth:1,borderColor:'#E1B625'},selectedHour && selectedHour==hour?{borderColor:'#96A825',backgroundColor:'#96A825'}:{}]}>
                    <TouchableOpacity onPress={()=>{this.selectedHour({selectedHour:hour});}}>

                        <Text style={{padding:15,paddingBottom:10,paddingTop:10,fontSize:12,color:'#FFFFFF'}}>{hour}</Text>

                    </TouchableOpacity></View>);

            }

            hourSe = <ScrollView horizontal={true} style={{flexDirection:'row',flex:1,marginTop:20,paddingBottom:10}}>{hourSelection}</ScrollView>;

        }

        return (<View style={[{backgroundColor:'#252525',padding:20,borderRadius:10},this.props.style]}>


            <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:20}}>
                <TouchableOpacity disabled={!allowLeft} onPress={()=>this.showmore(-1)} style={{marginLeft:14}}><FontAwesome name={"chevron-left"} size={16} color={"rgba(255,255,255,0."+(allowLeft?8:1)+")"} /></TouchableOpacity>

                <Text style={{color:'#E1B625',fontSize:15}}>{monthNames[usableStartDate.getMonth()].toUpperCase()} {usableStartDate.getFullYear()}</Text>

                {/*<TouchableOpacity onPress={this.showmore}><Text style={{fontSize:12,color:"#FFFFFF"}}>SHOW {this.state.more ? 'LESS':'MORE'}</Text></TouchableOpacity>*/}
                <TouchableOpacity disabled={!allowRight} onPress={()=>this.showmore(1)} style={{marginRight:14}}><FontAwesome name={"chevron-right"} size={16} color={"rgba(255,255,255,0."+(allowRight?8:1)+")"} /></TouchableOpacity>
            </View>


            <View style={{flexDirection:'row',justifyContent:'space-evenly'}}>

                {dayNames.map((e,i)=><Text key={"dayNames"+e} style={[dayOfMx,dayOfM,i+1==curWeekD?selDay:{}]}>{e}</Text>)}

            </View>

            {weeksElems}


            {hourSe}


        </View>);
    }

}