/**
 * Created by jedrzej on 1/06/2020.
 */

import * as React from 'react';

import {
  Animated as AnimatedX,
  Button as ButtonX,
  Dimensions,
  Easing as EasingX,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {SearchBar} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import SplashScreen from 'react-native-splash-screen';
const moment = require('moment');

import FastImage from 'react-native-fast-image';

import DeviceInfo from 'react-native-device-info';

import settings from '../../settings';

import {API, Layout, _} from '../api/API';
import APIEvents from '../api/APIEvents';

import Background from '../components/Background';
import Button from '../components/Button';
import ContainerScrollableView from '../components/ContainerScrollableView';
import Heading from '../components/Heading';
import Input from '../components/Input';
import MembershipButton from '../components/MembershipButton';
import OfferBox from '../components/OfferBox';
import Para from '../components/Para';
import Window from '../components/Window';

import FormRenderer from '../components/FormRenderer';

import Lock from '../components/Lock';

class CurrentView extends React.Component {
  constructor(props) {
    super(props);

    let pack = this.props.route.params.pack;

    if (!pack) {
      pack = {
        id: moment().unix() + Math.random(),
        date: moment().unix(),
      };
    } else {
      pack = JSON.parse(pack);
    }

    this.state = {
      loading: false,
      scrollEnable: true,
      height: 200,
      //   parent: JSON.parse(this.props.route.params.parent),
      //   group: JSON.parse(this.props.route.params.group),
      plan: pack,
      styleSetup: JSON.parse(this.props.route.params.styleSetup),
      position: this.props.route.params.position || 0,
      item: JSON.parse(this.props.route.params.item),
    };
  }
  componentWillUnmount() {}

  componentDidMount = async () => {
    //    console.log('hi field before',this.state.plan," , ",this.state.item.fields);
    if (this.state.item && this.state.item.fields) {
      for (let i in this.state.item.fields) {
        let field = this.state.item.fields[i];
        console.log('field data get :------>  ', field);

        if (field.prefill) {
          // console.log('prefill66',field.prefill,field.id);
          if (field.type == 'date') {
            if (!this.state.plan[field.id]) {
              this.state.plan[field.id] = moment(new Date(), moment.ISO_8601); // moment().format("YYYY/MM/DD");
            }
          }
          if (field.type == 'datetime') {
            if (!this.state.plan[field.id]) {
              this.state.plan[field.id] = moment(new Date(), moment.ISO_8601);
            }
          }
          if (field.type == 'time') {
            if (!this.state.plan[field.id]) {
              this.state.plan[field.id] = moment(new Date(), moment.ISO_8601); //moment().format("HH:mm");
              // console.log('fill date', this.state.plan[field.id]);
            }
          }
          if (field.type == 'no') {
            if (!this.state.plan[field.id]) {
              this.state.plan[field.id] = this.state.position + 1; // moment().format("YYYY/MM/DD");
            }
          }
          if (field.timer) {
            APIEvents.call('callTimer', {
              fieldId: field.id,
              tracerid: this.props.route.params.tracerid + '.' + field.id,
              timer: field.timer,
              timer_message: field.timer_message,
            });
          }
          if (field.timer_unset) {
            console.log('unset API119');
            APIEvents.call('callTimerUnset', {
              fieldId: field.id,
              tracerid: this.props.route.params.tracerid + '.' + field.id,
              timer: field.timer,
              timer_message: field.timer_message,
            });
          }
        }
        // console.log('hi field X',this.state.plan);

        this.setState({random: Math.random()});
      }
    }

    const title = this.props.route.params.title || 'Details';
    if (DeviceInfo.isTablet()) {
      this.props.navigation.setOptions({title});
    } else {
      this.props.navigation.setOptions({
        title: title.substring(0, 23) + (title.length > 23 ? '...' : ''),
      });
    }
  };

  submit = async () => {
    if (this.state.loading) return;

    this.setState({loading: true});

    let fieldsDef = this.state.item;

    let signatures = API.findSignatureElements(fieldsDef);

    // signatures = [ signatures[0] ];

    APIEvents.call('ChangeSignatures', signatures);

    setTimeout(
      () => {
        let fieldVals = {};
        fieldVals[fieldsDef.id] = this.state.plan;
        /*
            this.setState({loading:false});
            console.log('hi field xxc',this.state.plan);
            return;*/

        //console.log('hi vals',fieldVals,this.state.plan);

        const {n, success, errorsPlain, errorsSet} = API.checkRequired(
          fieldsDef,
          fieldVals,
          this.state.plan.__is_new,
        );

        // console.log('errorsSet', {n,success,errorsPlain, errorsSet},JSON.stringify(this.state.plan));

        this.setState({loading: false});
        //  return;

        if (!success) {
          this.setState({
            errorsPlain,
            errorsSet: errorsSet ? errorsSet[this.state.item.id] : {},
          });
          alert('Please complete'); // the required fields, you have: "+n+" problems in form:\n"+errorsPlain);

          return;
        }

        if (this.state.plan.__is_new) this.state.plan.__is_new = false;
        //console.log('this.state.plan',this.props.route.params.tracerid);
        this.props.route.params.saveMe(
          this.state.plan,
          undefined,
          this.props.route.params.tracerid,
        );

        if (this.state.item && this.state.item.timer) {
          console.log('HELLO TIMER OF TABLE ELEMENT!', this.state.item);
          APIEvents.call('callTimer', {
            fieldId: this.state.item.id,
            tracerid:
              this.props.route.params.tracerid + '.' + this.state.item.id,
            timer: this.state.item.timer,
            timer_message: this.state.item.timer_message,
          });
        }
        if (this.state.item && this.state.item.timer_unset) {
          console.log('unset API201');
          APIEvents.call('callTimerUnset', {
            fieldId: this.state.item.id,
            tracerid:
              this.props.route.params.tracerid + '.' + this.state.item.id,
            timer: this.state.item.timer,
            timer_message: this.state.item.timer_message,
          });
        }

        this.props.navigation.goBack();
      },
      !signatures || signatures.length == 0 ? 1 : 1000,
    );

    /*
        let tasks = this.state.parent.groups;

        let exist = false;
        for(let i in tasks){
            if(tasks[i].id==this.state.parent.id){





                if(typeof(tasks[i].hour1)=="undefined"){
                    tasks[i].hour1 = this.state.plan;
                }
                if(typeof(tasks[i].hour2)=="undefined"){
                    tasks[i].hour2 = this.state.plan;
                }
            }
        }
        this.state.parent.groups = tasks;

        await API.saveTaskGroup(this.state.parent);
        this.props.navigation.goBack();*/
  };

  formFill = (field, value) => {
    //console.log('save in plan?', field.id, value);

    this.state.plan[field.id] = value;
    this.setState({rand: Math.random()});
  };

  formCheck = field => {
    return this.state.plan[field.id];
    // this.state.plan[field.id]
  };

  setScrollEnabling = e => {
    // console.log('scrollEnable :===============>>>>> ',e)
    this.setState({
      scrollEnable: e,
    });
  };

  render() {
    let fields = [];

    // console.log('iii',this.state.item);
    /*
        if(this.state.item && this.state.item.fields) for(let i in this.state.item.fields){

            let field = this.state.item.fields[i];

            if(field.type == "date"){

                fields.push(<Input key={"field"+field.id} type={"text"} placeholder={_(field.name)} disabled={!!field.prefill}

                                   onSubmitEditing={(v)=>{
                                   let vx = moment(v).unix();
                                   console.log('vvv',vx);

                                   this.formFill(field,vx)

                                   }}

                                   text={(this.state.plan[field.id] && moment(this.state.plan[field.id]*1000).format("YYYY/mm/dd")) || moment().format("YYYY/mm/dd")}   />);

            }
            else if(field.type == "time"){

                fields.push(<Input key={"field"+field.id} type={"text"} placeholder={_(field.name)} disabled={!!field.prefill}


                                   onSubmitEditing={(v)=>{
                                   let vx = moment(v).unix();
                                   console.log('vvv',vx);

                                   this.formFill(field,vx)

                                   }}

                                   text={(this.state.plan[field.id] && moment(this.state.plan[field.id]*1000).format("HH:mm")) || moment().format("HH:mm")}   />);

            }
            else if(field.type == "tempc"){

                fields.push(<Input type={"number"} keyboardType={"number-pad"} validation={"number"} placeholder={_(field.name)}
                                   autoCorrect={false}  onSubmitEditing={(v)=>this.formFill(field,v)}  />);

            }
            else if(field.type == "text"){

                fields.push(<Input type={"text"}  placeholder={_(field.name)}
                                   autoCorrect={false}  onSubmitEditing={(v)=>this.formFill(field,v)}  />);

            }
            else if(field.type == "phone"){

                fields.push(<Input type={"number"} keyboardType={"number-pad"} validation={"phone"} placeholder={_(field.name)}
                                   autoCorrect={false}  onSubmitEditing={(v)=>this.formFill(field,v)}  />);

            }
            else if(field.type == "email"){


                fields.push(<Input type={"email"}validation={"email"} placeholder={_(field.name)}
                                   autoCorrect={false}  onSubmitEditing={(v)=>this.formFill(field,v)}  />);
            }
            else {
                console.log('unknown type',field);
            }

        }*/
    return (
      <Background
        scroll={this.state.scrollEnable}
        scrolls={true}
        style={{flex: 1}}
        offsetCall={this.offsetCall}>
        <ContainerScrollableView
          scrollEnable={this.state.scrollEnable}
          keyboardAware={true}
          style={{marginLeft: 10, marginTop: 60, marginRight: 10, zIndex: 10}}>
          <View style={{marginHorizontal: 0, marginTop: 0}}>
            {this.state.item && (
              <FormRenderer
                saveMe={(plan, field, tracerid) => {
                  this.state.plan = plan;
                  this.props.route.params.saveMe(
                    this.state.plan,
                    field,
                    tracerid,
                  );

                  if (field && field.timer) {
                    console.log('HELLO TIMER OF AN ELEMENT!', field);
                    APIEvents.call('callTimer', {
                      fieldId: field.id,
                      tracerid,
                      timer: field.timer,
                      timer_message: field.timer_message,
                    });
                  }
                  if (field && field.timer_unset) {
                    console.log('Unset 355');
                    APIEvents.call('callTimerUnset', {
                      fieldId: field.id,
                      tracerid,
                      timer: field.timer,
                      timer_message: field.timer_message,
                    });
                  }
                }}
                tracerid={this.props.route.params.tracerid}
                styleSetup={this.state.styleSetup}
                setScrollEnabling={this.setScrollEnabling}
                updateErrorsSet={(field, errs) => {
                  if (!this.state.errorsSet) this.state.errorsSet = {};
                  // console.log('update errors',errs);
                  this.setState({errorsSet: errs, rand: Math.random()});
                }}
                errorsSet={this.state.errorsSet ? this.state.errorsSet : {}}
                plan={this.state.plan}
                navigation={this.props.navigation}
                fields={this.state.item.fields}
                isNew={this.state.plan.__is_new}
                isEditable={true}
                formCheck={this.formCheck}
                formFill={this.formFill}
              />
            )}

            {/*<Input type={"number"} keyboardType={"number-pad"} placeholder={_("Cupboard number")} text={(this.state.group['number']+"" || "")}
                           disabled={true} validation={"number"} />

                    <Input type={"name"} placeholder={_("Time")} disabled={true} text={moment(this.state.plan.date*1000).format("HH:mm") || ""}   />

                    <Input type={"number"} keyboardType={"number-pad"} validation={"number"} placeholder={_("Temperature °C")}
                           autoCorrect={false}  onSubmitEditing={(v)=>this.formFill('temperature',v)}  />

                    <Input type={"name"} placeholder={_("Name")} autoCorrect={false}  onSubmitEditing={(v)=>this.formFill('name',v)}  />

                    <Input type={"signature"} placeholder={_("Signature")} numberOfLines={8} autoCorrect={false}
                           text={this.state.plan.signature || undefined}
                           onSubmitEditing={(v)=>this.formFill('signature',v)}  />*/}

            <Button
              label={_(this.state.loading ? 'Loading...' : 'Save')}
              style={{marginTop: 20}}
              onPress={this.submit}
            />

            <View style={{height: 100}} />
          </View>
          <View style={{height: 50}} />
        </ContainerScrollableView>
      </Background>
    );
  }
}

const styles = StyleSheet.create({});

export default CurrentView;
