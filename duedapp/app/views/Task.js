/**
 * Created by jedrzej on 1/06/2020.
 */

import * as React from 'react';

import {
  Alert,
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

import settings from '../../settings';

import {API, Layout, _} from '../api/API';
import APIEvents from '../api/APIEvents';
import Timer from '../api/Timer';

import Background from '../components/Background';
import Button from '../components/Button';
import Heading from '../components/Heading';
import MembershipButton from '../components/MembershipButton';
import OfferBox from '../components/OfferBox';
import OfferSmallBox from '../components/OfferSmallBox';
import Para from '../components/Para';
import VoucherBox from '../components/VoucherBox';
import Window from '../components/Window';

import FormRenderer from '../components/FormRenderer';

import Lock from '../components/Lock';

import AsyncStorage from '@react-native-async-storage/async-storage';

class CurrentView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      activeTab: null,
      haveSave: true,
      height: 200,
      plan: JSON.parse(this.props.route.params.pack),
      scrollEnable: true,
    };

    if (!this.state.plan.groups) this.state.plan.groups = {};
  }
  componentWillUnmount() {
    APIEvents.removeListener('currentTaskAdd', 'TASK');
    APIEvents.removeListener('currentTask', 'TASK');
    APIEvents.removeListener('ActiveTab', 'TASK');
    APIEvents.removeListener('TaskReload', 'TASK');
    // APIEvents.removeListener('openTask', 'TASK');
  }

  componentDidMount = async () => {
    console.log(
      'data check :-->>>> ',
      JSON.parse(this.props.route.params.pack),
    );
    APIEvents.addListener('currentTaskAdd', 'TASK', () => {
      this.add(false);
    });

    // console.log("data check :-->>>> ",this.props.route.params.pack)

    if (this.props.route.params.redirect === true) {
      this.state.pack = JSON.parse(this.props.route.params.pack);
      let data = JSON.parse(this.props.route.params.pack);
      let formId = this.props.route.params.notData;

      let ii = Number(formId.tracerid.replace('form.Item.', ''));
      let itemData =
        data.groups &&
        data.groups.form &&
        data.groups.form.tabs &&
        data.groups.form.tabs.Item &&
        data.groups.form.tabs.Item.tableCook;
      let field =
        data.fields_json &&
        data.fields_json.fields[0] &&
        data.fields_json.fields[0].fields[0] &&
        data.fields_json.fields[0].fields[0].fields[1];

      console.log(
        'first data check 1222:--->>> ',
        field,
        itemData[ii],
        itemData,
        ii,
        formId.tracerid,
      );

      this.showTaskDetails(field, itemData[ii], itemData, ii, formId.tracerid);
    }

    // if(this.props.route.params.redirect===true){
    APIEvents.addListener('openTask', 'TASK', async formId => {
      const data = await AsyncStorage.getItem('TASKS');
      const newData = JSON.parse(data);
      const checkData = newData.find(task => task.uniqueid == formId.formId);
      this.setState({
        plan: checkData,
      });
      this.state.plan = checkData;

      let ii = Number(formId.tracerid.replace('form.Item.', ''));
      let itemData =
        checkData.groups &&
        checkData.groups.form &&
        checkData.groups.form.tabs &&
        checkData.groups.form.tabs.Item &&
        checkData.groups.form.tabs.Item.tableCook;
      let field =
        checkData.fields_json &&
        checkData.fields_json.fields[0] &&
        checkData.fields_json.fields[0].fields[0] &&
        checkData.fields_json.fields[0].fields[0].fields[1];

      console.log(
        'first data check 1222:--->>> ',
        field,
        itemData[ii],
        itemData,
        ii,
        formId.tracerid,
      );

      this.showTaskDetails(field, itemData[ii], itemData, ii, formId.tracerid);
    });
    // }

    APIEvents.addListener('ActiveTab', 'TASK', async key => {
      this.state.activeTab = key;
    });

    APIEvents.addListener('TaskReload', 'TASK', data => {
      if (!data || !data.pack) return;

      this.state = {
        loading: true,
        activeTab: null,
        haveSave: true,
        height: 200,
        plan: JSON.parse(data.pack),
      };
      if (!this.state.plan.groups) this.state.plan.groups = {};

      this.setState({random: Math.random()});
    });

    APIEvents.addListener('currentTask', 'TASK', async () => {
      // reload
      /*
            let planTask= await API.getUniqueTask(this.state.plan.uniqueid);

            //console.log('planTaskplanTask',JSON.stringify(planTask));

            if(!planTask) return;


            this.setState({
               plan: planTask,
                random: Math.random()
            });*/
    });

    console.log('get schedule :------> ', this.state.plan);
    APIEvents.addListener('callTimer', 'TASK', async opts => {
      console.log('callTimer :---> ', opts, {
        formId: this.state.plan.uniqueid,
        formName: this.state.plan.name,
        minutes: opts.timer,
        message: opts.timer_message,
      });

      Timer.scheduleTimer({
        formId: this.state.plan.uniqueid,
        formName: this.state.plan.name,
        tracerid: opts.tracerid,
        minutes: opts.timer,
        message: opts.timer_message,
      });
    });

    APIEvents.addListener('callTimerUnset', 'TASK', async opts => {
      console.log('UNSET Timer', opts, {
        formId: this.state.plan.uniqueid,
        formName: this.state.plan.name,
        minutes: opts.timer,
        message: opts.timer_message,
      });

      Timer.unscheduleTimer({
        formId: this.state.plan.uniqueid,
        formName: this.state.plan.name,
        tracerid: opts.tracerid,
        minutes: opts.timer,
        message: opts.timer_message,
      });
    });

    APIEvents.call('currentTaskHaveAddButton', this.canAdd());

    if (this.state.plan && this.state.plan.fields_json.fields) {
      let formName = this.state.plan.fields_json.id;
      let element = this.state.plan.groups[formName];

      let is_new = this.state.plan.groups.__is_new;

      this.startupPopulate(this.state.plan.fields_json.fields, is_new, element);

      this.setState({random: Math.random()});
    }

    this.props.navigation.setOptions({title: this.state.plan.name});
  };

  startupPopulate = (fields, is_new, element) => {
    API.score = 0;

    for (let i in fields) {
      let field = fields[i];

      if (field.prefill) {
        console.log('prefill44', field.id);
        if (field.type == 'date') {
          if (!element[field.id]) {
            element[field.id] = moment(new Date(), moment.ISO_8601); // moment().format("YYYY-MM-DD");
            //  console.log('fill date',element[field.id]);
          }
        }
        if (field.type == 'datetime') {
          if (!element[field.id]) {
            element[field.id] = moment(new Date(), moment.ISO_8601);
          }
        }
        if (field.type == 'time') {
          if (!element[field.id]) {
            element[field.id] = moment(new Date(), moment.ISO_8601); //moment().format("HH:mm");
          }
        }
        if (field.type == 'no') {
          if (!element[field.id]) {
            element[field.id] = this.state.position + 1; // moment().format("YYYY-MM-DD");
          }
        }
      }

      if (
        (field.type == 'table' || field.type == 'table-inline') &&
        typeof field.populate_rows != 'undefined' &&
        field.populate_rows > 0
      ) {
        if (!element[field.id]) {
          element[field.id] = [];
          for (let i = 0; i < field.populate_rows; i++) {
            this.add(true);
          }
        }
      }
    }

    this.calculateQuestions();
  };

  getPlanGroup = indexpp => {
    let gg = this.state.plan.groups;

    let indexExpl = indexpp.split('.');

    const getGroupElem = (gg, expl, index) => {
      if (typeof gg[expl[index]] != 'undefined') {
        if (expl.length - 1 <= index) {
          // console.log('group exeter',index,gg[expl[index]]);
          return gg[expl[index]];
        }

        //console.log('hello next group',expl.length,'<=',index);
        return getGroupElem(gg[expl[index]], expl, index + 1);
      }

      // console.log('group not found',expl,index);

      return null;
    };

    return getGroupElem(gg, indexExpl, 0);
  };

  populateChunk = field => {
    let pop = {};

    this.populateNew(pop, field.fields);

    return pop;
  };

  populateNew = (pop, fields, forced, iip) => {
    let populated = false;

    console.log('populateNew in TASK');

    for (let i in fields) {
      let field = fields[i];

      if (field.type == 'table') {
        if (typeof pop[field.id] == 'undefined') pop[field.id] = [];

        let newonetable = {
          __is_new: true,
          __is_just_added: true,
        };

        for (let i in field.fields) {
          let field2 = field.fields[i];

          console.log('pre...', field2.id, field2.prefill);

          if (field2 && field2.prefill) {
            console.log('prefill55', field2.prefill);

            if (field2.type == 'no') {
              newonetable[field2.id] = pop[field.id].length + 1;
            }
            if (field2.type == 'date') {
              newonetable[field2.id] = moment().format('YYYY-MM-DD');
            }
            if (field2.type == 'datetime') {
              newonetable[field2.id] = moment().format('YYYY-MM-DD HH:mm');
            }
            if (field2.type == 'time') {
              newonetable[field2.id] = moment().format('YYYY-MM-DD HH:mm');
            }
            if (field2.timer) {
              APIEvents.call('callTimer', {
                fieldId: field2.id,
                tracerid: field.id + '.' + field2.id,
                timer: field2.timer,
                timer_message: field2.timer_message,
              });
            }
            if (field2.timer_unset) {
              console.log('unset API3555');
              APIEvents.call('callTimerUnset', {
                fieldId: field2.id,
                tracerid: field.id + '.' + field2.id,
                timer: field2.timer,
                timer_message: field2.timer_message,
              });
            }
          }
        }

        if (field.same_count_reference) {
          let relatedElem = this.getPlanGroup(field.same_count_reference); //

          if (relatedElem && relatedElem.length <= pop[field.id].length) {
            alert(
              field.same_count_alert ||
                'You cannot add more ' + field.name + ' ',
            );

            return;
          }
        }

        // console.log('newonetable',newonetable);

        if (!field.cant_add || forced) {
          pop[field.id].push(newonetable);
          //console.log('popper',pop[field.id].length)
          if (iip) iip(pop[field.id].length - 1);
        }
        populated = !field.cant_add || forced ? true : false;
      }
      if (field.type == 'tabs') {
        if (!pop[field.id]) pop[field.id] = {};

        if (!this.state.activeTab)
          APIEvents.call(
            'ActiveTab',
            field.fields && field.fields.length > 0 ? field.fields[0].id : null,
          );

        if (this.populateNew(pop[field.id], field.fields, forced, iip)) {
          populated = true;
        }
      }
      if (field.type == 'tab') {
        if (!pop[field.id]) pop[field.id] = {};

        //console.log('tab matched?',field.id,this.state.activeTab);
        if (this.state.activeTab === null || this.state.activeTab == field.id) {
          if (this.populateNew(pop[field.id], field.fields, forced, iip)) {
            populated = true;
          }
        }
      }
      /*
            if(field.prefill) {
                if (field.type == 'no') {
                    pop[field.id] = pop[field.id].length + 1;
                }
                if (field.type == 'date') {
                    pop[field.id] = moment().format("YYYY-MM-DD")
                }
                if (field.type == 'datetime') {
                    pop[field.id] = moment().format("YYYY-MM-DD HH:mm")
                }
                if (field.type == 'time') {
                    pop[field.id] = moment().format("YYYY-MM-DD HH:mm")
                }
            }*/
    }

    return populated;
  };

  canAdd = () => {
    if (this.state.plan.submitted) {
      return false;
    }

    if (
      this.state.plan &&
      this.state.plan.fields_json &&
      this.state.plan.fields_json.fields
    ) {
      let newone = {};

      if (this.state.plan.fields_json.no_add) {
        return false;
      }

      return this.populateNew(newone, this.state.plan.fields_json.fields);
    }

    return false;
  };

  add = forced => {
    if (this.state.plan.submitted) {
      return;
    }

    let group = [];
    let item = null;

    let ii = 0;
    let field =
      this.state.plan.fields_json &&
      this.state.plan.fields_json.fields.filter(
        e => e.type == 'table' || e.type == 'table-inline',
      )[0];

    console.log('data :->>>> ', field);

    if (!this.state.plan.groups) {
      this.state.plan.groups = {};

      if (
        this.state.plan &&
        this.state.plan.fields_json &&
        this.state.plan.fields_json.fields
      ) {
        let newone = {
          id: moment().unix() + Math.random(),
          date: moment().unix(),
        };
        newone[this.state.plan.fields_json.id] = {};

        this.populateNew(
          newone[this.state.plan.fields_json.id],
          this.state.plan.fields_json.fields,
          forced,
        );

        group = newone[this.state.plan.fields_json.id];
        item = newone[this.state.plan.fields_json.id][field.id][ii];

        this.state.plan.groups = newone;
      }
      console.log('xadd2');
    } else {
      if (
        this.state.plan &&
        this.state.plan.fields_json &&
        this.state.plan.fields_json.fields
      ) {
        this.populateNew(
          this.state.plan.groups[this.state.plan.fields_json.id],
          this.state.plan.fields_json.fields,
          forced,
          iip => {
            console.log('call iip', iip);
            ii = iip;
          },
        );

        //  ii = this.state.plan.groups[this.state.plan.fields_json.id].length-1;
      }
    }

    /*
return;


        this.state.plan.groups.push({
            'date': moment().unix(),
            'id': moment().unix()+Math.random(),
            number: this.state.plan.groups.length+1

        });*/

    this.setState({random: Math.random()});
    //console.log('calllx');

    if (!forced) {
      API.saveTask(this.state.plan);

      console.log('start x', field, item, group, ii);
      // click!
      //this.showTaskDetail(field,item,group,ii)
      // console.log('calll');
      APIEvents.call('TableOpen', {i: ii});
    }
  };

  showTaskDetails = (field, item, group, ii, tracerid) => {
    console.log('hi fill A', field, item, group, ii, tracerid);

    let hasActiveCascade = null;
    let cascadeFieldI = null;
    let hasCascade = false;
    let cascadeData = null;
    let cascadeFieldC = 0;
    // console.log('nav 222', field.fields);
    if (field.fields)
      for (let i in field.fields) {
        const currentSubField = field.fields[i];

        if (currentSubField.type == 'subform-cascade') {
          hasCascade = true;

          if (typeof item[currentSubField.id] != 'undefined') {
            // taken
            cascadeFieldC++;
          } else {
            hasActiveCascade = currentSubField;
            cascadeData = group[field.id];
            cascadeFieldI = i;
            break;
          }
        }
      }

    console.log(
      'hi ee',
      field,
      item,
      JSON.stringify(hasCascade ? hasActiveCascade : field),
    );
    // return
    this.props.navigation.navigate('TaskDetail', {
      title:
        hasActiveCascade && hasActiveCascade.name
          ? hasActiveCascade.name
          : field.name,
      saveMe: subField => {
        if (hasCascade) {
          item[hasActiveCascade.id] = subField;
        } else {
          group[ii] = subField;
        }
        this.setState({random: Math.random()});
      },
      position: ii,
      styleSetup: JSON.stringify(this.state.styleSetup),
      pack: JSON.stringify(hasCascade ? cascadeData || {} : item), //hasCascade ? cascadeData : group),
      item: JSON.stringify(hasCascade ? hasActiveCascade : field),
    });
  };

  // showTaskDetail = (field, item, group, ii) => {
  //   let hasActiveCascade = null;
  //   let hasCascade = false;
  //   let cascadeData = null;

  //   if (field.fields)
  //   console.log('nav 222 :->>>>> ',field.fields);
  //     for (let i in field.fields) {
  //       const currentSubField = field.fields[i];

  //       if (currentSubField.type == 'subform-cascade') {
  //         hasCascade = true;

  //         if (typeof item[currentSubField.id] != 'undefined') {
  //           // taken
  //         } else {
  //           hasActiveCascade = currentSubField;
  //           cascadeData = group[field.id];

  //           break;
  //         }
  //       }
  //     }

  //   //console.log('hi ee', field, item, JSON.stringify(hasCascade ? hasActiveCascade : field));

  //   if (hasCascade && !hasActiveCascade) {
  //     alert('You have no more fields to fill');
  //     return;
  //   }

  //   // console.log('hi cascada ',hasActiveCascade,hasCascade,item,cascadeData);
  //   this.props.navigation.navigate('TaskDetail', {
  //     title:
  //       hasActiveCascade && hasActiveCascade.name
  //         ? hasActiveCascade.name
  //         : field.name,
  //     saveMe: subField => {
  //       if (hasCascade) {
  //         item[hasActiveCascade.id] = subField;
  //       } else {
  //         group[ii] = subField;
  //       }

  //       //console.log('saved?',ii,JSON.stringify(subField));
  //       //console.log('saved?',JSON.stringify(this.props.plan));
  //       /*for(let i in subField){
  //                item[i] = subField[i];
  //                }*/

  //       // console.log('coming back 477 Task!',{hasCascade,subField},JSON.stringify(this.state.plan.groups), item, group);

  //       this.props.saveMe(this.props.plan);

  //       this.setState({random: Math.random()});
  //     },
  //     position: ii,
  //     styleSetup: JSON.stringify(this.state.styleSetup),
  //     pack: JSON.stringify(hasCascade ? cascadeData || {} : item), //hasCascade ? cascadeData : group),
  //     item: JSON.stringify(hasCascade ? hasActiveCascade : field),
  //   });
  // };
  /*
    showTaskDetail = (field,item)=>{

        let hasActiveCascade = null;

        if(field.fields) for(let i in field.fields){

            const currentSubField = field.fields[i];

            if(currentSubField.type == 'subform-cascade'){

                if(typeof(item[currentSubField.id])!="undefined"){
                    // taken
                }
                else {
                    hasActiveCascade = currentSubField;
                    break;
                }

            }

        }

        this.props.navigation.navigate('TaskDetail',{
            title: field.name,
            saveMe: (subField)=>{

                item[hasActiveCascade.id] = subField;
                /*for(let i in subField){
                    item[i] = subField[i];
                }* /

                API.saveTask(this.state.plan);
                this.setState({random:Math.random()});
            },
            item: JSON.stringify(hasActiveCascade)
        });

        return;

    }*/

  submit = () => {
    setTimeout(() => {
      this.validate(() => {
        /*
            let fieldsDef = this.state.plan.fields_json;
            let fieldVals = this.state.plan.groups;

            const {n,success,errorsPlain} = API.checkRequired(fieldsDef, fieldVals, false);
            if(!success){
                alert("Please complete the required fields, you have: "+n+" errors in form:\n"+errorsPlain);

                this.setState({errorsPlain});
                return;
            }*/

        const newplan = JSON.parse(JSON.stringify(this.state.plan));
        newplan.submitted = moment().format('YYYY-MM-DD');

        delete newplan.fields_json;

        if (this.state.submitting) return;

        this.setState({submitting: true});

        API.postFormsSubmit(
          {form: newplan, submit_status: 1},
          (err, dt, showApiErrors) => {
            //console.log('hi db',err,dt);
            this.setState({submitting: false});

            if (err || !dt.success) {
              if (showApiErrors) {
                alert(err || dt.message || 'Error in API');
              } else {
                // alert('Cannot connect to servers. Storing data offline.'+err);

                this.state.plan.submitted = moment().format('YYYY-MM-DD');
                API.saveTask(this.state.plan);
                this.props.navigation.goBack();
              }
              return;
            }

            API.removeTask(this.state.plan);

            this.props.navigation.goBack();
          },
        );
      });
    }, 200);
  };

  submitButton = () => {
    if (this.state.submitting) return;
    this.state.submitting = true;
    APIEvents.call('Input');

    Alert.alert('Are you Sure?', 'Submit form?', [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => {
          this.state.submitting = false;
        },
      },
      {
        text: 'Submit form',
        onPress: () => {
          API.isLocked = false;
          this.state.submitting = false;
          this.submit();
        },
      },
    ]);
  };

  saveMeButton = () => {
    Alert.alert('Are you Sure?', 'Save changes and exit?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Save & Exit',
        onPress: () => {
          //console.log('save me A');

          //this.validate(()=>{

          API.isLocked = false;
          this.saveMe(null, true);
          this.props.navigation.goBack();
          //})
        },
      },
    ]);
  };

  validate = call => {
    this.setState({submitting: true});

    let signatures = API.findSignatureElements(this.state.plan.fields_json);

    APIEvents.call('ChangeSignatures', signatures);

    // console.log('signatures,signatures)',signatures);

    setTimeout(
      () => {
        /*
            this.setState({submitting:false});
            return;*/

        let fieldsDef = this.state.plan.fields_json;
        let fieldVals = this.state.plan.groups;

        console.log('check validation :-> ', fieldsDef, fieldVals);

        const {n, success, errorsPlain, errorsSet} = API.checkRequired(
          fieldsDef,
          fieldVals,
          false,
        );
        if (!success) {
          alert('Please complete'); //, you have: "+n+" problems in form:\n"+errorsPlain);

          //  console.log('222.state.errorsSet',errorsSet);
          this.setState({submitting: false, errorsPlain, errorsSet});
          return;
        }

        this.setState({submitting: false});

        call();
      },
      !signatures || signatures.length == 0 ? 1 : 1000,
    );
  };

  exit = () => {
    Alert.alert('Are you Sure?', 'Exit without saving changes.', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Exit',
        onPress: () => {
          this.props.navigation.goBack();
        },
      },
    ]);
  };

  deleteMe = () => {
    API.removeTask(this.state.plan);
    setTimeout(() => {
      this.props.navigation.goBack();
    }, 500);
  };

  offsetCall = a => {
    if (a == 0) {
      return this.setState({height: 200});
    }

    this.setState({
      height: Math.max(0, 200 - a),
    });
  };

  setScrollEnabling = e => {
    console.log('Heeloooooo----->>>>>> ', e);
    this.setState({
      scrollEnable: e,
    });
  };

  saveMe = (subdata, forced) => {
    // console.log('save me ',JSON.stringify(this.state.plan));
    //return;
    // console.log('sss',  JSON.stringify(this.state.plan));

    if (!this.state.plan.groups) {
      alert('Nothing to save');
      return;
    }

    if (!forced && this.state.plan.groups.__is_new) {
      return;
    }

    API.isLocked = true;
    //console.log('save task',forced);

    if (forced) {
      this.setState({submitting: true});

      let signatures = API.findSignatureElements(this.state.plan.fields_json);

      APIEvents.call('ChangeSignatures', signatures);

      //  console.log('signatures,signatures)',signatures);

      setTimeout(
        () => {
          //console.log('signatures,this.state.plan)',JSON.stringify(this.state.plan.groups));
          API.saveTask(this.state.plan, undefined);

          this.setState({submitting: false});
        },
        !signatures || signatures.length == 0 ? 1 : 500,
      );
    } else {
      API.saveTask(this.state.plan);
    }
  };
  /*
    renderPlanRecursor = (fields,groups,level)=>{
        if(!level) level = 0;

        for(let i in fields){

            const fi = fields[i];
            const group = (groups && groups[fi.id] );

           // console.log('hi fifi',fi,fi.id,group,'<---',groups);


            if(!fi) continue;

            if(fi.type=='form') {

                if (fi.main_text) {
                    this.state.planSet.push(<Heading key={level+":"+i} size={5}
                                                     style={{paddingTop:30,paddingBottom:6}}>{(fi.main_text)}</Heading>);
                }

            }
            else if(fi.type=='table'){

                this.state.planSet.push(<View key={level+":"+i}>

                    <View style={{backgroundColor:'#4A5677', flex:1, flexDirection:'row'}}>

                        {fi.fields && fi.fields.map((e,i)=>{
                            return <Text key={"tablef"+i} style={{color:'#FFF',padding:10,flex:e.flex || 2}}>{e.name}</Text>;
                        })}

                    </View>
                    {!group || group.length==0?<Para style={{marginLeft:0,marginTop:20}}>Nothing found. Try adding more.</Para>:undefined}


                    {group && group ? group.map((item,i)=> {

                        let datex = moment(item.date * 1000).format('DD/MM');

//console.log('hi item',item,i);



                        return <TouchableOpacity onPress={()=>this.showTaskDetail(fi,item)} key={"ii"+item.id+Math.random()}
                                                 style={{backgroundColor:'#4A5677', flex:1, flexDirection:'row'}}>

                            {fi.fields && fi.fields.map((e,i)=>{
                                //console.log('hi item val',e.id,item[e.id]);

                                let val = item[e.id];
                                if(e.type=='time'){
                                    val = item[e.id] ? (moment(val * 1000).format("HH:MM")) : '';
                                }
                                if(e.type=='date'){
                                    val = item[e.id] ? (moment(val * 1000).format("YYYY-MM-DD")) : '';
                                }
                                if(e.type=='subform-cascade'){
                                    if(e.face){
                                        let valx = e.face.map(fc=>{

                                            if(val && typeof(val[fc])!="undefined"){
                                                return val[fc]+"";
                                                }
                                            else {
                                                return "-";
                                                }

                                        });

                                        val = ""+valx.join(', ');
                                    }
                                    else {
                                        val = "---";
                                    }
                                }


                                return <Text key={"tablev"+i} style={{color:'#FFF',padding:10,flex:e.flex || 2}}>{val}</Text>;
                            })}

                        </TouchableOpacity>


                    }) : undefined}

                </View>);


            }

            if(fi.type!='table' && fi.type!='subform-cascade' && fi.fields){
                this.renderPlanRecursor(fi.fields,group,level+1);
            }
        }


    }*/

  formFill = (field, value) => {
    // console.log('form fill',field,value);

    this.state.plan.groups[field.id] = value;
    this.setState({rand: Math.random()});
    API.isLocked = true;

    this.saveMe();
    // console.log('xx',this.state.plan);
  };

  formCheck = field => {
    return this.state.plan.groups[field.id];
    // this.state.plan[field.id]
  };

  calculateQuestions = () => {
    //console.log('this.state.plan.groups',this.state.plan);

    const calcSection = (field, data, fieldWeight) => {
      if (field.type == 'question') {
        return {
          sum:
            data && data.value == 'Yes'
              ? fieldWeight
              : data && data.value == 'No'
              ? 0
              : !data
              ? 0
              : null,
          correct: data && data.value == 'Yes',
        };
      }

      let weight = fieldWeight;

      if (!data) return 0;

      //console.log('hi field',field.id,field.type,'weight',data,';dataset');
      let calcQ = [];
      if (field.fields) {
        if (field.type == 'audit') {
          weight =
            100 /
            field.fields.filter(e => e.type == 'section' && e.weight != 0)
              .length;
        }
        if (field.type == 'section') {
          // console.log('field.fields',field.fields);
          weight =
            fieldWeight /
            field.fields.filter(e => e.type == 'subsection').length;
        }
        if (field.type == 'subsection') {
          weight =
            fieldWeight / field.fields.filter(e => e.type == 'question').length;
          weight = (weight * 100) / 100;
        }
        for (let i in field.fields) {
          calcQ.push(
            calcSection(
              field.fields[i],
              data && data[field.fields[i].id],
              weight,
            ),
          );
        }
      }

      if (field.type == 'subsection') {
        const taken = calcQ.filter(e => e.sum !== null).length;
        const notTaken = calcQ.filter(e => e.sum === null).length;
        const all = calcQ.length;
        const correctCount = calcQ.filter(e => e.correct).length;
        const correct = calcQ.filter(e => e.sum != 0 || e.sum === null).length; //.reduce((a, b) => (typeof(a)=="object"?a.sum:a) + b.sum, 0);

        let factor = 1 + notTaken / all;
        factor = (factor * 100) / 100;

        if (correct == 0) {
          if (data) data._result = 0;
          return 0;
        }

        // (correct/taken)*fieldWeight
        data._result = correct * weight; //((((correct*weight))))*factor;
        data._result = (data._result * 100) / 100;

        //console.log('result',field.id, data._result, {newRes:(correct/taken)*fieldWeight,taken,notTaken,all, correct, factor, weight},(correct/taken),calcQ);
        return data._result;
      }
      if (field.type == 'section') {
        if (field.weight == 0) {
          return 0;
        }
        const correct = calcQ
          .filter(e => e != 0 && e !== null)
          .reduce((a, b) => a + b, 0);

        data._result = (correct * 100) / 100;
        //if(correct>0)
        //  console.log('result2',field.id, data._result,field, fieldWeight, weight, calcQ);

        return data._result;
      }
      if (field.type == 'audit') {
        const correct = calcQ
          .filter(e => e != 0 && e !== null)
          .reduce((a, b) => a + b, 0);

        data._result = correct;
        //if(correct>0)
        // console.log('result3',field.id, data._result, weight, calcQ);

        API.score = data._result;

        return Math.max(0, Math.min(data._result, 100));
      }
    };

    calcSection(
      this.state.plan.fields_json,
      this.state.plan.groups[this.state.plan.fields_json.id],
    );
  };

  render() {
    //console.log('planTask','----------------------------------------------');

    //console.log('--- ',JSON.stringify(this.state.plan));

    // console.log('planEnd','-----------------------------------------------');
    this.state.planSet = [];

    // if(this.state.plan && this.state.plan.fields_json){

    // console.log('ggg',this.state.plan.groups);

    //  this.renderPlanRecursor([this.state.plan.fields_json],this.state.plan.groups);

    // }

    //console.log('this.state.errorsSet',JSON.stringify(this.state.errorsSet));
    //console.log('gggg',JSON.stringify(this.state.plan.fields_json.font_family));

    const styleSetup =
      this.state.plan && this.state.plan.fields_json
        ? {
            font_family: this.state.plan.fields_json.font_family || 'default',
            font_color: this.state.plan.fields_json.font_color || 'black',
            font_size: this.state.plan.fields_json.font_size || '100%',
          }
        : {
            font_family: 'default',
            font_color: 'black',
            font_size: '100%',
          };
    this.state.styleSetup = styleSetup; // I know, but it's not regenerating render

    return (
      <Background
        scroll={this.state.scrollEnable}
        scrolls={true}
        style={{flex: 1}}
        offsetCall={this.offsetCall}>
        <View style={{height: 20}} />

        <View style={{marginHorizontal: 10}}>
          {this.state.plan && this.state.plan.fields_json && (
            <FormRenderer
              is_new={this.state.plan.groups.__is_new}
              tracerid={this.state.plan.fields_json.id}
              id={this.state.plan.fields_json.id}
              styleSetup={styleSetup}
              setScrollEnabling={this.setScrollEnabling}
              saveMe={(plan, field, tracerid) => {
                //console.log('welcome plan',JSON.stringify(plan));
                API.isLocked = true;
                this.state.plan.groups = plan;
                this.calculateQuestions();

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
                  console.log('unset API1128');
                  APIEvents.call('callTimerUnset', {
                    fieldId: field.id,
                    tracerid,
                    timer: field.timer,
                    timer_message: field.timer_message,
                  });
                }

                //this.saveMe();
              }}
              updateErrorsSet={(field, errs) => {
                if (!this.state.errorsSet) this.state.errorsSet = {};
                // console.log('update errors',errs);
                this.setState({errorsSet: errs, rand: Math.random()});
              }}
              errorsSet={this.state.errorsSet ? this.state.errorsSet : {}}
              plan={this.state.plan.groups}
              navigation={this.props.navigation}
              fields={[this.state.plan.fields_json]}
              formCheck={this.formCheck}
              formFill={this.formFill}
            />
          )}
        </View>

        {this.state.errorsPlain ? (
          <Para
            size={5}
            style={{color: 'red', marginHorizontal: 10, marginBottom: 20}}>
            {'Please complete the required fields'}
          </Para>
        ) : (
          undefined
        )}

        <View style={{flexDirection: 'row', marginTop: 20}}>
          {this.state.haveSave && (
            <Button
              disabled={this.state.submitting}
              style={{
                flex: 3,
                marginRight: 10,
                marginTop: Platform.OS == 'android' ? 1 : 0,
              }}
              label={_('SAVE')}
              type={'green-small'}
              onPress={() => this.saveMeButton()}
            />
          )}

          <Button
            disabled={this.state.submitting}
            style={{
              flex: 3,
              marginRight: 10,
              marginTop: Platform.OS == 'android' ? 1 : 0,
            }}
            label={_('EXIT')}
            type={'black-small'}
            onPress={() => this.exit()}
          />
          {/*<Button disabled={this.state.submitting} style={{flex:2,marginRight:10,marginTop:Platform.OS=='android'?1:0}} label={_("DELETE")} type={'black-small'} onPress={()=>this.deleteMe()} />*/}
          <Button
            disabled={this.state.submitting}
            style={{
              flex: 3,
              marginRight: 10,
              marginTop: Platform.OS == 'android' ? 1 : 0,
            }}
            label={_('SUBMIT')}
            type={'blue-small'}
            onPress={() => this.submitButton()}
          />

          {/*<Button disabled={this.state.submitting}
                        style={{flex:3,marginRight:10,marginTop:Platform.OS=='android'?1:0}} label={_("XXTEST")}
                        type={'blue-small'} onPress={()=>{
                    console.log('-------val start')

                           this.validate(()=>{
                               console.log('-------val ended')
                           })
                }} />*/}
        </View>
        <View style={{height: 200}} />
      </Background>
    );
  }
}

const styles = StyleSheet.create({});

export default CurrentView;
