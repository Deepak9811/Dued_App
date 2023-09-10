/**
 * @module API
 */
import * as React from 'react';

import {
  Alert,
  Animated as AnimatedX,
  Button as ButtonX,
  Easing as EasingX,
  Linking,
  NativeModules,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Easing as EasingXX,
  Notifier,
  NotifierComponents,
} from 'react-native-notifier';

const DeviceInfo = require('react-native-device-info');

import NetInfo from '@react-native-community/netinfo';

// import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import CustomToaster from 'react-native-tiny-toast';

import moment from 'moment';
import setup from '../../settings';
import APIEvents from './APIEvents';

import PushNotification from 'react-native-push-notification';

const en = require('../lang/en');
const xx = require('../lang/xx');
const IS_ANDROID = Platform.OS === 'android';
let runOnce = false;

let session = {};
const PRODUCTION = setup.isProduction;
const DEBUG = false && !PRODUCTION;

const apiUrl = PRODUCTION
  ? 'https://' + setup.apiDomain + ''
  : setup.isDev
  ? 'http://localhost:9998'
  : 'https://' + setup.apiDomain + '';

let sendingData = false;
let startApi = false;

const getDeviceLocale = () => {
  const deviceLanguage =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
      : NativeModules.I18nManager.localeIdentifier;

  return deviceLanguage;
};

export const _ = s => {
  const currentLocale = getDeviceLocale();

  if (false) {
    if (typeof xx[s] != 'undefined') {
      if (typeof xx[s] == 'function') {
        return '#' + xx[s]();
      }
      return '@' + xx[s];
    }
    return '!!!' + s;
  }

  if (currentLocale == 'en') {
    if (typeof en[s] != 'undefined') {
      if (typeof en[s] == 'function') {
        return en[s]();
      }
      return en[s];
    }
  } else {
    if (typeof en[s] != 'undefined') {
      if (typeof en[s] == 'function') {
        return en[s]();
      }
      return en[s];
    }
  }

  switch (s) {
    case 'invalid_price':
      return 'The price may have changed please check item.';
    case 'provide_address_name':
      return 'Your name should be a minimum of 5 characters.';
    case 'provide_shipping_address':
      return 'Your address should be a minimum of 4 characters.';

    case 'provide_shipping_town':
      return 'Provide shipping city/town.';
    case 'provide_shipping_county':
      return 'Provide shipping county.';
    case 'provide_shipping_postcode':
      return 'Provide shipping postcode.';

    case 'quantity_depleted':
      return 'Sorry this item is now out of stock.';

    case 'booking_confirmed':
      return 'Booking Confirmed! Thank you.';

    case 'queue_confirmed':
      return 'You have joined todays Queue! Thank you.';

    case 'gap_confirmed':
      return 'You have joined todays Queue! Thank you.';

    case 'incurn ':
      return 'Invalid user password. Please try again.';
  }

  return s;
};

/**
 * API
 */
export const API = {
  isProduction: () => {
    return PRODUCTION;
  },

  // setBackgroundSync: async ()=> {
  //   if(!API.backgroundSyncs){
  //       let syncData = (await AsyncStorage.getItem('backgroundSyncs')) || '[]';
  //       try {
  //           API.backgroundSyncs = JSON.parse(syncData);
  //       }
  //       catch(e){
  //           console.log('bg sync sync failed',e);
  //       }
  //   }
  // },

  // addBackgroundSync: async ()=>{
  //     if(!API.backgroundSyncs){
  //       let syncData = (await AsyncStorage.getItem('backgroundSyncs')) || '[]';
  //       try {
  //           API.backgroundSyncs = JSON.parse(syncData);
  //       }
  //       catch(e){
  //           console.log('bg sync sync failed',e);
  //       }
  //     }
  //     API.backgroundSyncs.push((new Date()).toISOString()+"")
  //     AsyncStorage.setItem('backgroundSyncs', JSON.stringify(API.backgroundSyncs));
  // },

  listBackgroundSyncs: () => {
    return API.backgroundSyncs || [];
  },

  postInvalidateSession: (data, callback) => {
    session.invalidated = true;
    API.saveSessionQuick();

    API.nativeApiCall(
      'POST',
      '/auth/invalidate',
      data,
      (err, dt) => {
        callback(err, dt);
      },
      undefined,
      true,
    );
  },

  getDeviceType: () => {
    return DeviceInfo.getDeviceType();
  },

  getDeviceModel: () => {
    return DeviceInfo.getDeviceId();
  },

  getDeviceToken: () => {
    return DeviceInfo.getUniqueId();
  },

  postApiVersion: (data, callback) => {
    API.nativeApiCall('POST', '/api/version', data, (err, dt) => {
      callback(err, dt);
    });
  },

  postSession: (data, callback) => {
    API.nativeApiCall('POST', '/auth/check', data, (err, dt) => {
      if (dt && dt.data && API.isAuthorized()) {
        let existing = API.getSession();
        for (let i in dt.data) {
          if (i == 'session_token') continue;

          API.setSessionData(i, dt.data[i]);

          APIEvents.call('reloaded');
        }
      }
    });
  },

  checkRequiredSingle: (
    field,
    val,
    fields,
    vals,
    isNew,
    errs,
    errorsPlain,
    n,
  ) => {
    // console.log('field check :- ', field);
    let exists =
      vals && typeof vals[field.id] != 'undefined' && vals[field.id] != '';

    let required = field.required;
    let requiredsoft = field.requiredsoft;
    let higher_than = field.higher_than;
    let enabled_only_on_edit = field.enabled_only_on_edit;
    let require_field_name = field.require_field_name;
    let require_if_higher = field.require_if_higher;
    let require_if_lower = field.require_if_lower;
    let recommendation = field.recommendation;
    let require_field_names = field.require_field_names;

    // console.log(
    //   'checkup',
    //   field.id,
    //   required,
    //   'requiredsoft :->',
    //   requiredsoft,
    //   exists,
    //   require_if_higher,
    //   require_field_name,
    //   isNew,
    //   enabled_only_on_edit,
    // );

    if ((required || requiredsoft) && !exists) {
      if (isNew && enabled_only_on_edit) return n;

      n++;
      let defaultReMessage = requiredsoft ? 'Fill in' : 'Please complete';

      if (field.type == 'signature') {
        defaultReMessage =
          'Please enter your signature and wait for it to save';
      }
      //console.log('hi error',field.require_message , defaultReMessage);
      errs[field.id] = field.require_message || defaultReMessage;
      errorsPlain.push(field.name + ': ' + errs[field.id]);
    } else if (higher_than) {
      let other = fields.find(e => e.id == higher_than);
      if (other) {
        if (vals && vals[field.id] < vals[other.id]) {
          n++;
          errs[field.id] = 'Error, value is too low!';
          errorsPlain.push(field.name + ': ' + errs[field.id]);
        }
      } else {
        n++;
        errs[field.id] =
          'Error, required field ' + higher_than + ' not found in the form!';
        errorsPlain.push(field.name + ': ' + errs[field.id]);
      }
    } else if (require_field_names && exists) {
      let existsRQ = true;
      for (let i in require_field_names) {
        if (
          (vals && typeof vals[require_field_names[i]] == 'undefined') ||
          !vals[require_field_names[i]]
        ) {
          //console.log('find ',fields,require_field_names[i]);
          if (fields) {
            //console.log('gfixx2', fields.find(e=>e.id == require_field_names[i]));
          }
          let setxx2 = fields.find(e => e.id == require_field_names[i]);
          let require_field_nameLabel = setxx2 && setxx2.name;
          if (require_field_nameLabel) {
            existsRQ = false;
            n++;
            errs[field.id] =
              '' +
              'Please fill in ' +
              (require_field_nameLabel || require_field_names[i]); // +vals[require_field_names[i]]
            errorsPlain.push(field.name + ': ' + errs[field.id]);
            break;
          }
        }
      }
    } else if (
      require_field_name &&
      require_if_lower &&
      vals &&
      parseFloat(vals[field.id]) < require_if_lower
    ) {
      let existsRQ =
        vals &&
        typeof vals[require_field_name] != 'undefined' &&
        vals[require_field_name] != '';
      // fields.find(e=>e.id==require_field_name) //

      //console.log('hihi',existsRQ,vals[require_field_name]);
      let require_field_nameLabel = fields.find(e => e.id == require_field_name)
        .name;

      if (!existsRQ) {
        n++;
        errs[field.id] =
          '' +
          require_field_nameLabel +
          ' ' +
          (require_field_nameLabel.substring(
            require_field_nameLabel.length - 2,
            require_field_nameLabel.length,
          ) == 's'
            ? 'are'
            : 'is') +
          ' required, because ' +
          field.name +
          ' is too low!';
        errorsPlain.push(field.name + ': ' + errs[field.id]);
      }
    } else if (
      require_field_name &&
      require_if_higher &&
      vals &&
      parseFloat(vals[field.id]) > require_if_higher
    ) {
      let existsRQ =
        vals &&
        typeof vals[require_field_name] != 'undefined' &&
        vals[require_field_name] != '';
      // fields.find(e=>e.id==require_field_name) //

      //console.log('hihi',existsRQ,vals[require_field_name]);
      let require_field_nameLabel = fields.find(e => e.id == require_field_name)
        .name;

      if (!existsRQ) {
        n++;
        errs[field.id] =
          '' +
          require_field_nameLabel +
          ' ' +
          (require_field_nameLabel.substring(
            require_field_nameLabel.length - 2,
            require_field_nameLabel.length,
          ) == 's'
            ? 'are'
            : 'is') +
          ' required, because ' +
          field.name +
          ' is too high!';
        errorsPlain.push(field.name + ': ' + errs[field.id]);
      }
    }
    if (exists) {
      //  && field.max > exists

      if (field.type == 'uint' || field.type == 'int') {
        let vv = vals ? parseInt(vals[field.id]) : 0;

        if (field.min && vv < field.min) {
          if (!recommendation) {
            n++;
            errs[field.id] =
              'The ' +
              field.name +
              ' specified is less than ' +
              field.min +
              ' degrees C.';
            errorsPlain.push(field.name + ': ' + errs[field.id]);
          } else {
            errorsPlain.push(field.name + ': ' + recommendation);
          }
        }
        if (field.max && vv >= field.max) {
          if (!recommendation) {
            n++;
            errs[field.id] =
              'The ' +
              field.name +
              ' specified is more than ' +
              field.max +
              ' degrees C.';
            errorsPlain.push(field.name + ': ' + errs[field.id]);
          } else {
            errorsPlain.push(field.name + ': ' + recommendation);
          }
        }
      } else if (field.type == 'tempc') {
        let vv = vals ? parseFloat(vals[field.id]) : 0;

        if (field.min && vv < field.min) {
          if (!recommendation) {
            n++;
            errs[field.id] =
              'The ' +
              field.name +
              ' specified is less than ' +
              field.min +
              ' degrees C.';
            errorsPlain.push(field.name + ': ' + errs[field.id]);
          } else {
            errorsPlain.push(field.name + ': ' + recommendation);
          }
        }
        if (field.max && vv >= field.max) {
          if (!recommendation) {
            n++;
            errs[field.id] =
              'The ' +
              field.name +
              ' specified is more than ' +
              field.max +
              ' degrees C.';
            errorsPlain.push(field.name + ': ' + errs[field.id]);
          } else {
            errorsPlain.push(field.name + ': ' + recommendation);
          }
        }
      } else if (field.min || field.max) {
        if (field.min && vals && vals[field.id] < field.min) {
          n++;
          errs[field.id] =
            'The ' + field.name + ' specified is less than ' + field.min + '.';
          errorsPlain.push(field.name + ': ' + errs[field.id]);
        }
        if (field.max && vals && vals[field.id] >= field.max) {
          n++;
          errs[field.id] =
            'The ' + field.name + ' specified is more than ' + field.max + '.';
          errorsPlain.push(field.name + ': ' + errs[field.id]);
        }
      }
    }

    if (field.type == 'table' || field.type == 'table-inline') {
      return; // handled in details
    }

    /**
     * Do not check selects, since options will trigger true for required...
     */
    if (field.fields && field.type != 'select') {
      errs[field.id] = {};

      if (
        field.type == 'checkbox' ||
        field.type == 'checkboxreveal' ||
        field.type == 'radio'
      ) {
        //console.log('check field',field.id,vals[field.id],vals);

        errs[field.id] = '';
        errs[field.id + 'Sub'] = {};
        if (vals && vals[field.id]) {
          n = API.checkAssoc(
            field.fields,
            vals[field.id + 'Sub'],
            errs[field.id + 'Sub'],
            isNew,
            errorsPlain,
            n,
          );
        }
      } else {
        n = API.checkAssoc(
          field.fields,
          vals ? vals[field.id] : undefined,
          errs[field.id],
          isNew,
          errorsPlain,
          n,
        );
      }
    }

    return n;
  },

  checkAssoc: (fields, vals, errs, isNew, errorsPlain, n) => {
    if (fields) {
      for (let i in fields) {
        let field = fields[i];
        if (field.type == 'option') {
          continue;
        }
        if (!vals) {
          console.log('hi no vals in ', field);
        }

        n = API.checkRequiredSingle(
          field,
          vals ? vals[field.id] : {},
          fields,
          vals,
          isNew,
          errs,
          errorsPlain,
          n,
        );
      }
    }

    return n;
  },

  checkRequired: (fieldsDef, fieldVals, isNew) => {
    let n = 0;
    let errorsSet = {};
    let errorsPlain = [];

    errorsSet[fieldsDef.id] = {};

    n = API.checkAssoc(
      fieldsDef.fields,
      fieldVals[fieldsDef.id],
      errorsSet[fieldsDef.id],
      isNew,
      errorsPlain,
      n,
    );

    //console.log('hihi checkRequired', errorsSet,errorsPlain,errorsPlain.length, 'hello n ', n);

    // errorsPlain.length==0
    return {
      n: errorsPlain.length,
      success: parseInt(n) == 0 || typeof n == 'undefined',
      errorsSet: errorsSet,
      errorsPlain: errorsPlain.join('\n'),
    };
  },

  runScheduledNotificationCutOff: async (cutoff, cutoffdate) => {
    let currentTime = moment().unix();
    if (Number(currentTime) <= Number(cutoffdate)) {
      let scheduleTime = new Date(moment(cutoff.time, 'HH:mm:ss').utcOffset(0));
      if (Platform.OS !== 'android') {
        // PushNotification.localNotificationSchedule({
        //   // id: uniqueId,
        //   title: 'Dued',
        //   tag: 'json:' + 'test',
        //   userInfo: {action: 'openform'},
        //   message: 'Time to submit your forms',
        //   date: scheduleTime,
        //   vibrate: true,
        //   soundName: 'my_sound.wav',
        // });
      }
    }
  },

  submitSubmittedTasks: async ({
    callmeback,
    triggercutoff,
    cutoff,
    submitAll,
    isbackground,
    subTime,
  }) => {
    API.submitting = true;
    APIEvents.call('submitting', true);

    console.log('triggercutoff?', typeof subTime);
    const value = await AsyncStorage.getItem('TASKS');

    let cutoffdate = null;
    let cutoffnow = false;
    // if (triggercutoff && cutoff) {
    //   let current = moment().utcOffset(0);

    //   let newDate;
    //   if (cutoff.day == 2) {
    //     newDate = moment(
    //       current.format('MM-DD-YYYY') + ' ' + cutoff.time + ' +00:00',
    //       'MM-DD-YYYY HH:mm:ss Z',
    //     )
    //       .utcOffset(0)
    //       .subtract(1, 'days');
    //   } else if (cutoff.day == 3) {
    //     newDate = moment(
    //       current.format('MM-DD-YYYY') + ' ' + cutoff.time + ' +00:00',
    //       'MM-DD-YYYY HH:mm:ss Z',
    //     )
    //       .utcOffset(0)
    //       .subtract(2, 'days');
    //   } else {
    //     newDate = moment(
    //       current.format('MM-DD-YYYY') + ' ' + cutoff.time + ' +00:00',
    //       'MM-DD-YYYY HH:mm:ss Z',
    //     ).utcOffset(0);
    //   }
    //   //newDate = newDate.subtract(1, 'days');
    //   /*if(newDate<current){
    //         // we're in the past, add one day.
    //         newDate = newDate.add(1, 'days');
    //     }*/
    //   cutoffdate = newDate.unix();

    //   //  console.log('hi date',newDate, newDate>current, newDate<current, cutoffdate);
    // }

    if (value !== null) {
      let tasks = JSON.parse(value);

      console.log('tasks :->>>> ', tasks);

      if (tasks) {
        let errors = 0;
        let allCascade = [];

        let submittedIds = [];

        let yesData = [];
        let toData = [];

        for (let i in tasks) {
          let is_from_cutoff = false;

          if (Number(subTime) === 3) {
            const dateString = moment
              .unix(tasks[i].datetime)
              .format('MM/DD/YYYY');
            const toDate = moment().format('MM/DD/YYYY');
            if (dateString === toDate) {
              continue;
            }
          }

          if (tasks[i].datetime && tasks[i].datetime) {
            // console.log('send me cutoff!',i,moment(tasks[i].datetime*1000),moment(cutoffdate*1000));
            tasks[i].submitted = moment().format('YYYY-MM-DD');
            is_from_cutoff = true;
          }

          if (!submitAll) {
            if (!tasks[i].submitted) {
              continue;
            }
          } else if (!tasks[i].submitted) {
            tasks[i].submitted = moment().format('YYYY-MM-DD');
          }

          const newplan = JSON.parse(JSON.stringify(tasks[i]));
          delete newplan.fields_json;

          // console.log('submit', newplan.uniqueid);

          allCascade.push(
            new Promise(approve => {
              API.postFormsSubmit(
                {
                  form: newplan,
                  isbackground,
                  submit_status: is_from_cutoff ? 3 : 2,
                },
                (err, dt, showApiErrors) => {
                  if (err || !dt.success) {
                    if (showApiErrors) {
                      alert(err || dt.message || 'Error in API');
                    }
                    errors++;
                    approve();
                    return;
                  }

                  //API.removeTask(newplan);
                  //console.log('hi new plan id',newplan.uniqueid);
                  submittedIds.push({uniqueid: newplan.uniqueid});

                  approve();
                },
              );
            }),
          );
        }

        //   console.log('hi cascade',allCascade.length);
        if (allCascade.length == 0) {
          sendingData = false;
          if (callmeback) callmeback();
          APIEvents.call('submitting', false);
          API.submitting = false;
        }
        Promise.all(allCascade).then(async x => {
          for (let i in submittedIds) {
            //   console.log('call sca',submittedIds[i]);
            await API.removeTask(submittedIds[i]);
          }
          // console.log('submittedIds changed state', submittedIds);

          if (submittedIds.length - errors > 0) {
            // alert("Submitted "+(submittedIds.length-errors)+" form."+(errors?" There were "+errors+" errors.":""));
          } else if (submittedIds.length - errors > 1) {
            // alert("Submitted "+(submittedIds.length-errors)+" forms."+(errors?" There were "+errors+" errors.":""));
          } else if (errors > 0) {
            // alert("Submission failed."+(errors?" There were "+errors+" errors":""));
          }

          sendingData = false;
          if (callmeback) callmeback();
          API.submitting = false;
          APIEvents.call('submitting', false);
          APIEvents.call('resetHome');
        });
      }
    }
  },

  removeTask: async taskdt => {
    if (!taskdt) {
      // console.log('no dat',taskdt);
      return;
    }
    let tasks = JSON.parse(await AsyncStorage.getItem('TASKS'));

    if (!tasks) {
      tasks = [];
    }

    let exist = false;
    let newtasks = [];
    for (let i in tasks) {
      if (tasks[i] && tasks[i].uniqueid == taskdt.uniqueid) {
        // delete tasks[i];
        // console.log('delete task', i, tasks[i].uniqueid);
        // break;
      } else if (tasks[i]) {
        newtasks.push(tasks[i]);
      }
    }

    for (let i in newtasks) {
      if (newtasks[i] && newtasks[i].uniqueid == taskdt.uniqueid) {
        // delete tasks[i];
        // console.log('TASK PERSISTS!!!!', i, newtasks[i].uniqueid);
        // break;
      }
    }

    await AsyncStorage.setItem('TASKS', JSON.stringify(newtasks));
    //console.log('calllx');
    setTimeout(() => {
      // console.log('calll');
      APIEvents.call('currentTask');
    }, 500);
  },

  populateTaskMain: (form, keyI) => {
    //console.log('populateTaskMain',keyI);
    let dataset = {};

    for (let i in form) {
      const field = form[i];

      if (field.prefill) {
        // console.log('prefill11', field.id);

        if (field.type == 'no') {
          dataset[field.id] = keyI || 1;
        }

        if (field.type == 'table') {
          let datarows = [];
          let datalimit = field.max_rows || 10;

          for (let e = 1; e <= datalimit; e++) {
            datarows.push(API.populateTaskMain(field.fields, e));
          }

          dataset[field.id] = datarows;
        }

        if (field.type == 'date') {
          dataset[field.id] = moment(new Date(), moment.ISO_8601); // moment().format("YYYY-MM-DD");
        }
        if (field.type == 'datetime') {
          dataset[field.id] = moment(new Date(), moment.ISO_8601);
        }
        if (field.type == 'time') {
          dataset[field.id] = moment(new Date(), moment.ISO_8601);
        }
        if (field.type == 'no') {
          dataset[field.id] = keyI;
        }
        if (field.timer) {
          // console.log('timer check :------> ', field.timer);
          APIEvents.call('callTimer', {
            fieldId: field.id,
            tracerid: field.id,
            timer: field.timer,
            timer_message: field.timer_message,
          });
        }
        if (field.timer_unset) {
          // console.log('unset API');
          APIEvents.call('callTimerUnset', {
            fieldId: field.id,
            tracerid: field.id,
            timer: field.timer,
            timer_message: field.timer_message,
          });
        }
      }

      if (field.type == 'tabs') {
        dataset[field.id] = API.populateTaskMain(field.fields, 1);
      }
      if (field.type == 'tab') {
        dataset[field.id] = API.populateTaskMain(field.fields, 1);
      }

      //console.log('hhi field',field.type,field.id);

      if (field.type == 'table' || field.type == 'table-inline') {
        if (
          typeof field.populate_rows != 'undefined' &&
          field.populate_rows > 0
        ) {
          let datarows = [];
          for (let e = 1; e <= field.populate_rows; e++) {
            datarows.push(API.populateTaskMain(field.fields, e));
          }
          dataset[field.id] = datarows;
        }
        if (
          typeof field.backend_defined_rows != 'undefined' &&
          field.backend_defined_rows
        ) {
          let datarows = [];
          if (field.value) {
            for (let val in field.value) {
              datarows.push(field.value[val]);
            }
          }
          dataset[field.id] = datarows;
        }
      }
    }
    return dataset;
  },

  haveTaskType: async e => {
    let tasks = JSON.parse(await AsyncStorage.getItem('TASKS'));
    if (!tasks) return false;
    for (let i in tasks) {
      let iduniq = (tasks[i].id + '').split('0.')[0];

      //console.log('task id',iduniq, e.id);
      if (iduniq == e.id) {
        return true;
      }
    }

    return false;
  },

  createTask: taskdt => {
    try {
      if (taskdt.fields_json) {
        taskdt.groups = {
          __is_new: true,
        };

        taskdt.groups[taskdt.fields_json.id] = API.populateTaskMain(
          taskdt.fields_json.fields,
        );

        console.log('hi new data', JSON.stringify(taskdt.groups));
      }
      taskdt.uniqueid = taskdt.id + '' + Math.random();
      taskdt.datetime = moment() /*.subtract(2, 'days')*/
        .unix();

      return taskdt;
    } catch (error) {
      CustomToaster.show(`Storage Saving Error 2`, {
        duration: CustomToaster.duration.SHORT,
        position: CustomToaster.position.CENTER,
        containerStyle: {
          backgroundColor: 'rgba(255,179,202,1)',
          width: '95%',
          height: 80,
          borderLeftWidth: 5,
          borderLeftColor: '#ff407b',
        },
        textStyle: {
          color: '#000',
          position: 'absolute',
          left: 90,
          fontSize: 25,
        },
        imgSource: require('./logo.png'),
        imgStyle: {width: 65, height: 65, position: 'absolute', left: 10},
        mask: true,
        maskStyle: {},
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'Storage Saving Error 2',
      //   autoHide: false,
      //   text2: error + '',
      // });
    }
  },

  saveTask: async (taskdt, newone, callmeback) => {
    try {
      let tasks = JSON.parse(await AsyncStorage.getItem('TASKS'));

      console.log('tasks?', tasks);
      if (!tasks) {
        tasks = [];
      }

      if (newone) {
        if (taskdt.fields_json) {
          taskdt.groups = {
            __is_new: true,
          };

          taskdt.groups[taskdt.fields_json.id] = API.populateTaskMain(
            taskdt.fields_json.fields,
          );

          //console.log('hi new data',JSON.stringify(taskdt.groups));
        }
        taskdt.uniqueid = taskdt.id + '' + Math.random();
      } else if (taskdt.groups && taskdt.groups.__is_new) {
        delete taskdt.groups.__is_new;
      }

      let exist = false;
      let existId = null;
      if (!newone)
        for (let i in tasks) {
          if (!taskdt.uniqueid) {
            if (tasks[i] && tasks[i].id == taskdt.id) {
              tasks[i] = taskdt;
              exist = true;
              existId = 'norm' + i;
              break;
            }
          } else {
            if (tasks[i] && tasks[i].uniqueid == taskdt.uniqueid) {
              tasks[i] = taskdt;
              existId = 'unique' + i;
              exist = true;
              break;
            }
          }
        }

      if (newone || !exist) {
        tasks.push(taskdt);
      }

      // console.log('exists?',exist,existId);

      await AsyncStorage.setItem('TASKS', JSON.stringify(tasks));
      //console.log('add saved',tasks);
      setTimeout(() => {
        APIEvents.call('currentTask', tasks);
      }, 500);
    } catch (error) {
      CustomToaster.show(`Storage Saving Error 2`, {
        duration: CustomToaster.duration.SHORT,
        position: CustomToaster.position.CENTER,
        containerStyle: {
          backgroundColor: 'rgba(255,179,202,1)',
          width: '95%',
          height: 80,
          borderLeftWidth: 5,
          borderLeftColor: '#ff407b',
        },
        textStyle: {
          color: '#000',
          position: 'absolute',
          left: 90,
          fontSize: 25,
        },
        imgSource: require('./logo.png'),
        imgStyle: {width: 65, height: 65, position: 'absolute', left: 10},
        mask: true,
        maskStyle: {},
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'Storage Saving Error 2',
      //   autoHide: false,
      //   text2: error + '',
      // });
    }
  },

  findSignatureElements: def => {
    let oo = [];

    if (def && def.fields) {
      oo = []; // def.fields.filter(e=>e.type=='signature').map(e=>e.id);

      for (let i in def.fields) {
        const ff = def.fields[i];

        if (ff.type == 'signature') {
          oo.push(ff.id + '');
        } else if (
          ff.type == 'checkbox' ||
          ff.type == 'radio' ||
          ff.type == 'checkboxreveal' ||
          ff.type == 'tabs' ||
          ff.type == 'tab'
        ) {
          let suboo = API.findSignatureElements(ff);

          oo.push(...suboo);
        }
      }
    }

    return oo;
  },

  getUniqueTask: async taskid => {
    try {
      let tasks = JSON.parse(await AsyncStorage.getItem('TASKS'));
      if (!tasks) {
        tasks = [];
      }

      // console.log('tasks',tasks);

      let exist = false;
      for (let i in tasks) {
        if (tasks[i].uniqueid == taskid) {
          return tasks[i];
        }
      }
    } catch (error) {
      CustomToaster.show(`Storage Saving Error 3`, {
        duration: CustomToaster.duration.SHORT,
        position: CustomToaster.position.CENTER,
        containerStyle: {
          backgroundColor: 'rgba(255,179,202,1)',
          width: '95%',
          height: 80,
          borderLeftWidth: 5,
          borderLeftColor: '#ff407b',
        },
        textStyle: {
          color: '#000',
          position: 'absolute',
          left: 90,
          fontSize: 25,
        },
        imgSource: require('./logo.png'),
        imgStyle: {width: 65, height: 65, position: 'absolute', left: 10},
        mask: true,
        maskStyle: {},
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'Storage Saving Error 3',
      //   autoHide: false,
      //   text2: error + '',
      // });
    }

    return null;
  },

  getTask: async taskid => {
    try {
      let tasks = JSON.parse(await AsyncStorage.getItem('TASKS'));
      if (!tasks) {
        tasks = [];
      }

      // console.log('tasks',tasks);

      let exist = false;
      for (let i in tasks) {
        if (tasks[i].id == taskid) {
          return tasks[i];
        }
      }
    } catch (error) {
      CustomToaster.show(`Storage Saving Error 3`, {
        duration: CustomToaster.duration.SHORT,
        position: CustomToaster.position.CENTER,
        containerStyle: {
          backgroundColor: 'rgba(255,179,202,1)',
          width: '95%',
          height: 80,
          borderLeftWidth: 5,
          borderLeftColor: '#ff407b',
        },
        textStyle: {
          color: '#000',
          position: 'absolute',
          left: 90,
          fontSize: 25,
        },
        imgSource: require('./logo.png'),
        imgStyle: {width: 65, height: 65, position: 'absolute', left: 10},
        mask: true,
        maskStyle: {},
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'Storage Saving Error 3',
      //   autoHide: false,
      //   text2: error + '',
      // });
    }

    return null;
  },

  /**
     * @function postLogin
     * POST /auth/authorize
     * @param data
     *  email, pass
     * @param callback
     * @return string
       \{
            success: true,
             message: null,
             data: {
                <br>session_token: ‘Authorization token’,
                <br>name: ‘Name of user’,
                <br>email: ‘email of user’
            }
        \}
     */
  postLogin: (data, callback) => {
    API.nativeApiCall('POST', '/api/authorize', data, (err, dt) => {
      if (dt && dt.success) {
        return API.saveSession(dt, () => callback(err, dt));
      }

      callback(err, dt);
    });
  },

  /**
   * @function postLogout
   * POST /auth/logout
   * @param data empty
   * @param callback
   * @return string
   * \{
   *  success: true
   * \}
   */
  postLogout: (data, callback) => {
    // console.log('hello logout :-> ', data);
    API.nativeApiCall('POST', '/api/auth/logout', data, (err, dt) => {
      API.destroySession(() => callback(err, dt));
    });
  },

  postCheckActualVersion: callback => {
    let data = {
      version: DeviceInfo.getVersion(),
      build: DeviceInfo.getBuildNumber(),
      platform: setup.os || Platform.OS,
      platformos: Platform.OS,
      deviceId: DeviceInfo.getDeviceId(),
    };

    API.nativeApiCall(
      'POST',
      '/api/checkactualversion',
      data,
      (err, dt) => {
        // console.log('hi checkactualversion', data, '->', dt, err);

        if (!err && dt && dt.success === false) {
          Alert.alert(
            'WARNING!',
            dt.message ||
              "You're using old version of this app. Please upgrade",
          );

          if (dt.force && dt.url) {
            Linking.canOpenURL(dt.url)
              .then(() => {
                return Linking.openURL(dt.url);
              })
              .catch(e => {
                Alert.alert('ERROR!', 'Cannot open store link: ' + e);
              });
          }
        }

        if (callback) callback(dt);
      },
      undefined,
      true,
      true,
    );
  },

  checkVersionForUpdate: callback => {
    console.log('version start');
    let data = {
      platform: Platform.OS,
    };
    // if(timeoutx){

    API.nativeApiCall(
      'POST',
      '/api/checkversion',
      data,
      (err, dt) => {
        if (callback) callback(dt);
        console.log('latest version on playstore is', data, '->', dt.data, err);
        return dt;
      },
      undefined,
      true,
      true,
    );
    // }else{
    //   return false
    // }
  },

  getCheckmeme: (data, callback) => {
    // console.log('check offline');
    let calledback = false;

    API.nativeApiCall(
      'GET',
      '/api/checkmeme',
      data,
      (err, dt, code) => {
        if (!calledback) {
          calledback = true;
          //console.log('ee',calledback);
          callback(err, dt, code);
        }
      },
      undefined,
      true,
      true,
      fetcher => {
        setTimeout(() => {
          if (!calledback) {
            calledback = true;
            callback('timeout', null, 999);
          }
        }, 1000);
      },
    );
  },

  postFormsCutoff: (data, callback) => {
    // API.cacheTrigger('/api/forms/cutoff',data,callback,(call)=>{
    API.nativeApiCall('GET', '/api/forms/cutoff', data, (err, dt) => {
      callback(err, dt);
    });
    //   });
  },

  silentNotification: async (notiData, callback) => {
    let fcmToken = await AsyncStorage.getItem('fcmtoken');

    let data = notiData.data;
    let data1 = JSON.parse(data.body);

    let findFcm1 = data1.find(x => x.fcm_token === fcmToken);
    console.log('find our fcm :->> ', findFcm1.fcm_token);
    // console.log('silent notification receive');

    if (findFcm1) {
      API.submitSubmittedTasks({
        callmeback: null,
        triggercutoff: true,
        cutoff: null,
        isbackground: true,
        subTime: findFcm1.cutoff_today,
      });
    }
  },

  /**
   * @function postForms
   * POST /forms
   */
  postForms: (data, callback) => {
    API.cacheTrigger('/api/forms', data, callback, call => {
      console.log('api data :- ', data, ' , ', callback, ' , ', call);
      API.nativeApiCall('GET', '/api/forms', data, (err, dt) => {
        if (!err && dt) {
          call(dt);
          //return API.saveSession(dt,()=>callback(err,dt));
        }

        // console.log('hello ', dt);
        callback(err, dt);
      });
    });
  },

  postFormsSubmit: (data, callback) => {
    // NetInfo.fetch().then(async state => {
    // console.log('Connection type', state.type);
    // alert('Is connected? '+ data);

    console.log('check notification data :-> ', data);
    // return;

    // if (state.isConnected) {
    API.nativeApiCall('POST', '/api/forms/submit', data, (err, dt) => {
      callback(err, dt);
    });
    // } else{
    //   let errr ='network error'
    //   let dt =null
    //   callback(errr, dt);
    //   Alert.alert("Alert","Unable to submit due to no internet connection. Form will be autosubmitted when internet reconnected.",[{text:'ok',}])
    // }
    // });
  },

  getFormCategories: (data, callback) => {
    if (
      API.cacheTrigger('/api/forms/categories', data, callback, call => {
        API.nativeApiCall('GET', '/api/forms/categories', data, (err, dt) => {
          if (!err && dt) {
            call(dt);
          }

          callback(err, dt);
        });
      })
    ) {
      return;
    }
  },

  getSuppliesList: (data, callback) => {
    if (
      API.cacheTrigger('/api/supplies', data, callback, call => {
        API.nativeApiCall(
          'GET',
          '/api/supplies',
          {id: data.id, page: data.page || 0},
          (err, dt) => {
            if (!err && dt) {
              call(dt);
            }

            callback(err, dt, setup.showApiErrors);
          },
        );
      })
    ) {
      return;
    }
  },

  postSuppliesList: (data, callback) => {
    API.nativeApiCall('POST', '/api/supplies', data, (err, dt) => {
      callback(err, dt, setup.showApiErrors);
    });
  },

  getShare: (data, callback) => {
    API.nativeApiCall(
      'POST',
      '/share/get',
      {id: data.id, page: data.page || 0},
      (err, dt) => {
        callback(err, dt, setup.showApiErrors);
      },
    );
  },

  /**
   * @function getTerms
   */
  getTerms: (data, callback) => {
    // callback(null,{success:true,message:null,terms:'Terms and conditions text'+"\n"+'Terms and conditions text'+"\n\n\n\n\n\n\nMore terms"},setup.showApiErrors);

    API.nativeApiCall('GET', '/api/terms', {}, (err, dt) => {
      callback(err, dt, setup.showApiErrors);
    });
  },

  /**
   * @function postAuthReset
   * Reset user passwd
   * POST /auth/reset
   * @return success: true or success:false, message: 'error desc'
   */
  postAuthReset: (data, callback) => {
    // callback(null,{success:true,message:null},setup.showApiErrors);

    API.nativeApiCall(
      'POST',
      '/auth/reset',
      {email_repeat: data.email_repeat, email: data.email},
      (err, dt) => {
        callback(err, dt, setup.showApiErrors);
      },
    );
  },

  /**
   * @function postContactForm
   * POST /contact/form
   * @param data
   *  name
   *  email
   *  message
   * @param callback
   * @return success: true
   */
  postContactForm: (data, callback) => {
    // callback(null,{success:true,message:null},setup.showApiErrors);

    API.nativeApiCall('POST', '/api/contact/form', data, (err, dt) => {
      callback(err, dt, setup.showApiErrors);
    });
  },

  /**
     * @function getFaqs
     * POST /faqs/get
     * @param data empty
     * @param callback
     * @return success: true,
     * list: \[
         \{
             'title': 'Test Faq',
             'content': 'Test content'
         \},
         ...
     \]
     */
  getAbout: (data, callback) => {
    /*callback(null,{success:true,message:null,list:[
            {
                id: 'silver',
                'title': 'Test Faq',
                'content': 'Test content'
            },
            {
                id: 'silver2',
                'title': 'Test Faq',
                'content': 'Test content'
            }

        ]},setup.showApiErrors);*/

    API.nativeApiCall('GET', '/api/about', data, (err, dt) => {
      callback(err, dt, setup.showApiErrors);
    });
  },

  /**
   * @function postDevicesAdd
   * POST /devices/add
   * Add notification device id
   * @param data
   *  access_token UDID
   *  platform \[ios|android\]
   * @param callback
   * @return success: true
   */
  postDevicesAdd: (data, callback) => {
    API.nativeApiCall(
      'POST',
      '/devices/add',
      data,
      (err, dt) => {
        callback(err, dt);
      },
      undefined,
      true,
    );
  },

  /**
   * @function postDevicesRemove
   * POST /devices/remove
   * @param data
   *  access_token UDID
   *  platform \[ios|android\]
   * @param callback
   * @return success: true
   */
  postDevicesRemove: (data, callback) => {
    API.nativeApiCall(
      'POST',
      '/devices/remove',
      data,
      (err, dt) => {
        callback(err, dt);
      },
      undefined,
      true,
    );
  },

  getCart: callback => {
    if (session && session.cart) {
      return callback(session.cart);
    }

    return callback([]);
  },

  postBasketBasket: (data, callback) => {
    API.nativeApiCall('POST', '/basket/basket', data, (err, dt) => {
      callback(err, dt);
    });
  },
  addToCart: (product, quantity, price, shipping_cost) => {
    if (!session.cart) {
      session.cart = [];
    }
    Notifier.showNotification({
      title: 'Product added to your basket!',
      Component: NotifierComponents.Alert,
      componentProps: {
        alertType: 'success',
        backgroundColor: '#96A825',
      },
      showEasing: EasingXX.bounce,
      /*
            title: 'John Doe',
            description: 'Hello! Can you help me with notifications?',
            duration: 0,
            showAnimationDuration: 800,
            onHidden: () => console.log('Hidden'),
            onPress: () => console.log('Press'),*/
    });

    session.cart.push({
      product,
      id: product.id,
      quantity,
      price,
      shipping_cost,
    });
    API.saveCart();

    APIEvents.call('addToCart', session.cart.length > 0);
  },

  removeFromCart: place => {
    session.cart.splice(place, 1);
    API.saveCart();

    APIEvents.call('addToCart', session.cart.length > 0);
  },
  clearCart: () => {
    session.cart = [];
    API.saveCart();
    APIEvents.call('addToCart', session.cart.length > 0);
  },
  saveCart: () => {
    API.saveSessionQuick();
    API.postBasketBasket({items: this.cart}, () => {});
  },

  getAuthorizationBearer: () => {
    try {
      return session.loginData.token; //loginData.data.session_token
    } catch (e) {
      return null;
    }
  },

  setSessionTeam: async (team, callback) => {
    //console.log('team',team,session);
    if (session && session.loginData && session.loginData.data)
      session.loginData.data.clientapp_selected_team_id = team;

    await API.saveSessionQuick();

    if (callback) callback();
  },

  getSessionTeam: () => {
    return (
      session &&
      session.loginData &&
      session.loginData.data &&
      session.loginData.data.clientapp_selected_team_id
    );
  },

  getSession: () => {
    return session && session.loginData && session.loginData.data;
  },

  setSessionData: (key, val) => {
    let dt = session && session.loginData && session.loginData.data;

    if (dt) {
      dt[key] = val;
    }
  },

  saveDeviceToken: async token => {
    const tokenOld = await AsyncStorage.getItem('access_token');

    if (tokenOld && tokenOld != token) {
      // unregister old.
      API.postDevicesRemove(
        {
          access_token: tokenOld,
          platform: Platform.OS,
        },
        (err, dt) => {
          console.log('dev del', err, dt);
        },
      );
    }

    await AsyncStorage.setItem('access_token', token + '');

    API.ticleToken();
  },

  ticleToken: async () => {
    const token = await AsyncStorage.getItem('access_token');

    //console.log('titici',token, API.isAuthorized());
    if (token && API.isAuthorized()) {
      API.postDevicesAdd(
        {
          access_token: token,
          platform: Platform.OS,
        },
        (err, dt) => {
          console.log('dev reg', err, dt);
        },
      );
    }
  },

  parseResponseErrors: dt => {
    let message =
      dt.message || 'Sorry, We cannot complete your request at this time! :(';
    if (dt.validation) {
      message +=
        ' ' +
        dt.validation.map(e => {
          return e.field + ': ' + e.message + '\n';
        });
    }

    return message;
  },

  saveSessionQuick: async () => {
    await AsyncStorage.setItem(API.getStorageToken(), JSON.stringify(session));
  },

  saveSession: (res, callback) => {
    session = {loginData: res, user: {}};
    API.saveSessionQuick();
    // console.log('reloadSession');
    API.reloadSession(callback, true);
  },
  reloadSession: async (callback, refreshData) => {
    var token = await AsyncStorage.getItem('token');
    if (token) {
      session.token = token;
    }
    await API.saveSessionQuick();
    callback(null, true);
  },

  getStorageToken: () => {
    return '@Token:key';
  },

  loadSession: async () => {
    const ses = await AsyncStorage.getItem(API.getStorageToken());

    try {
      session = JSON.parse(ses);
    } catch (e) {
      console.log('loadSession err', e);
    }
  },

  destroySession: callback => {
    console.log('session check :-> ', session);
    if (session && session.loginData) {
      switch (session.loginData.login_type) {
        case 'facebook':
          LoginManager.logOut();
          break;
      }
    }

    API.saveDeviceToken('');

    session = {};
    API.saveSessionQuick();
    callback();
  },

  isAuthorized: () => {
    return (
      session &&
      typeof session.loginData !== 'undefined' &&
      session.loginData.success !== false &&
      !session.invalidated
    );
  },

  cacheTrigger: async (url, data, callback, proceed) => {
    NetInfo.fetch().then(async state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);

      const cached = await AsyncStorage.getItem(
        'cached' + url + JSON.stringify(data),
      );

      if (!state.isConnected) {
        if (cached) {
          try {
            callback(null, JSON.parse(cached));
          } catch (e) {
            console.log('err stored data', e);
            proceed(() => {});
          }
        } else {
          proceed(() => {});
        }
      } else {
        if (cached) {
          callback(null, JSON.parse(cached));
        }

        proceed(async dtx => {
          AsyncStorage.setItem(
            'cached' + url + JSON.stringify(data),
            JSON.stringify(dtx),
          );
        });
      }
    });
  },

  getAccountName: () => {
    return session && session.loginData && session.loginData.name;
  },

  getAPIUrl: () => {
    return apiUrl;
  },

  nativeApiCall: async (
    method,
    url,
    params,
    callback,
    bearer,
    silent,
    callbackall,
    callbefore,
  ) => {
    const ses = await AsyncStorage.getItem('@Token:key');
    let getSess;
    try {
      if (Object.keys(session).length != 0) {
        getSess = session.loginData.token; //loginData.data.session_token
      } else {
        if (Object.keys(JSON.parse(ses)).length != 0) {
          getSess = JSON.parse(ses).loginData.token;
        }
      }
    } catch (e) {
      getSess = null;
    }

    var data = {
      method: method,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        // Authorization: bearer || API.getAuthorizationBearer() || undefined,
        Authorization: bearer || getSess || undefined,
      },
    };

    if (typeof data.headers.Authorization == 'undefined') {
      delete data.headers.Authorization;
    } else {
      data.headers.Authorization = 'Bearer ' + data.headers.Authorization;
    }
    // console.log('hello you ',bearer || API.getAuthorizationBearer(),session);

    if (!params) {
      params = {};
    }
    //params.bespokedIdent = setup.bespokedIdent;
    // params.locale = 'en';//getDeviceLocale();

    if (method.toLowerCase() != 'get' && method.toLowerCase() != 'head') {
      data.body = JSON.stringify(params);
    }

    let requestUrl = apiUrl + url;
    if (DEBUG) console.log('>>> REQ: ', requestUrl, data);

    const ff = fetch(requestUrl, data);
    if (callbefore) {
      callbefore(ff);
    }

    ff.then(async response => {
      let responseText = await response.text();

      if (DEBUG)
        console.log(
          '>>> RESP: ',
          requestUrl,
          method,
          params,
          response.status,
          responseText,
        );

      if (
        response.status == 200 ||
        response.status == 400 ||
        response.status == 403 ||
        response.status == 405
      ) {
        try {
          if (!responseText || responseText.length == 0) {
            return callback(null, {}, response.status);
          }
          var res = JSON.parse(responseText);
          callback(null, res, response.status);
        } catch (e) {
          console.log('>>> err e', responseText, e);
          callback(responseText, null, response.status);
        }
      } else if (response.status == 401) {
        /*if (response.status == 401) {
                    console.log(">>> 401");
                    callback(responseText, null);
                    return;
                }*/
        if (url == '/auth/logout') {
          callback(responseText, null, response.status);
          return;
        }

        let resData;

        try {
          resData = JSON.parse(responseText);
        } catch (e) {}

        // console.error("---- forbidden ----", url, method, params);
        //console.log('text forbidden', responseText,url, method, params);
        callback(responseText, resData, response.status);
        if (API.isAuthorized()) {
          console.log('log me out A!', responseText, url, method, params);
          APIEvents.call('logout');
        }
        return;
      } else if (response.status === 404) {
        if (callbackall) {
          return callback(responseText, null, response.status);
        }
        throw new Error('Status 404!');
        //return callback(responseText, null);
      } else if (response.status === 500) {
        if (callbackall) {
          return callback(responseText, null, response.status);
        }

        console.log('error 500', url, method, params, responseText);

        throw new Error('Status 500!');
        // return callback(responseText, null);
      } else {
        if (callbackall) {
          return callback(responseText, null, response.status);
        }
      }

      // console.log(">>> "+response.status);
    })
      .catch(error => {
        //   console.log('eerrrr',requestUrl);
        if (!silent) Alert.alert('error ' + url + ' ' + error);

        callback(error, null, 998);
      })
      .done();
  },
};

export const showPrice = (p, sign) => {
  return (sign ? '£' : '') + (p / 100).toFixed(2);
};

const sizeMeUp = (fontSize, styleSetupSize) => {
  if (styleSetupSize == 'normal') {
    return fontSize;
  }

  let styleSetupSizeF = parseFloat(styleSetupSize) / 100.0;
  if (isNaN(styleSetupSizeF)) {
    styleSetupSizeF = 1.0;
  }
  return styleSetupSizeF * fontSize;
};

export const Layout = {
  textStyle: (styleSetup, extras) => {
    if (!extras) extras = {};
    if (styleSetup) {
      if (!extras.color) {
        if (styleSetup.font_color == 'black') {
          extras.color = 'white';
        } else {
          extas.color = styleSetup.font_color || extras.color;
        }
      }
      if (extras.fontSize) {
        extras.fontSize = sizeMeUp(extras.fontSize, styleSetup.size);
      }

      let font = null;
      switch (styleSetup.font_family) {
        case 'Roboto':
          font = 'Roboto-Regular';
          break;
        case 'Overpass':
          font = 'Overpass-Regular';
          break;
        case 'Poppins':
          font = 'Poppins-Regular';
          break;
      }

      if (font !== null) {
        extras.fontFamily = font;
      }
    }
    if (setup.isDev) {
      extras.color = 'red';
    }

    return extras;
  },

  pairOut: (elems, item, row) => {
    let pairs = [];
    let pairBuffer = [];
    for (let i in elems) {
      pairBuffer.push(item(i, elems[i]));
      if (i > 0 && i % 2 == 1) {
        pairs.push(row(i, pairBuffer));
        pairBuffer = [];
      }
    }

    if (pairBuffer.length > 0) {
      pairs.push(row(elems.length + 1, pairBuffer));
    }

    return pairs;
  },

  getElementStyle: (page, defaultsx) => {
    'use strict';

    const styles = defaultsx ? defaultsx : {};

    return styles;
  },

  getViewStyle: page => {
    'use strict';

    let styles = {
      backgroundColor: '#323231',
      flex: 1,
    };

    switch (page) {
      case 'Join':
      case 'BarberList':
        styles.backgroundColor = '#181818';
        break;
      case 'Services':
      case 'Reviews':
        styles.backgroundColor = '#323231';
        break;
    }

    return styles;
  },

  getElementSource: page => {
    'use strict';
    /*
        switch(page){
            case 'login-logo-source':
                return undefined;//require('../../assets/logo.png');
                break;
            case 'join-logo-source':
                return undefined;// require('../../assets/championmalegroomers_crestlogogold_250418_v5.png');
                break;
        }*/
  },
};
