/**
 * Created by jedrzej on 15/06/2020.
 */

import {Link} from '@react-navigation/native';
import * as React from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
const moment = require('moment');

import {API, Layout, _} from '../api/API';
import APIEvents from '../api/APIEvents';
import Timer from '../api/Timer';

import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import CheckboxReveal from '../components/CheckboxReveal';
import Heading from '../components/Heading';
import Input from '../components/Input';
import Para from '../components/Para';
import Select from '../components/Select';

import Images from '../components/Images';
import Tabs from '../components/Tabs';
import Question from './Question';
import Section from './Section';
import SubSection from './SubSection';

export default class FormRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorsSet: {},
      rer: Math.random(),
      events: {},
      subQuesHide: false,
    };
  }

  componentWillUnmount() {
    APIEvents.removeListener('selectedTab', 'formrenderer' + this.state.rer);
    APIEvents.removeListener('resetformsizes', 'formrenderer' + this.state.rer);
    for (let i in this.state.events) {
      APIEvents.removeListener(
        this.state.events[i].name,
        this.state.events[i].value,
      );
    }
  }

  componentDidMount = async () => {
    APIEvents.addListener('selectedTab', 'formrenderer' + this.state.rer, a => {
      if (this && this.state) {
        //console.log('selected',a);
        this.state.selected = a;
      }
    });

    APIEvents.addListener(
      'resetformsizes',
      'formrenderer' + this.state.rer,
      a => {},
    );

    if (this.props.fields) {
      for (let i in this.props.fields) {
        const field = this.props.fields[i];

        let value = this.props.plan[field.id];

        let valueExists =
          (typeof value == 'boolean' && value) || (value && value.length > 0);

        if (field.unrequire_field_name) {
          const otherfield = this.props.fields.find(e => {
            return e.id == field.unrequire_field_name;
          });
          // console.log('unrequirea a field', value,field.unrequire_field_name,otherfield);

          if (otherfield) {
            if (valueExists) {
              //console.log('unrequirex a field', value.length,otherfield);
              otherfield.required = false;
              if (field.unrequire_field_comment) {
                otherfield.name =
                  'CCCC' + (otherfield.originalname || otherfield.name);
              }
            } else {
              //console.log('rerequire a field', typeof (value),otherfield);
              otherfield.required = true;
              if (field.unrequire_field_comment) {
                otherfield.originalname = otherfield.name;
                otherfield.name = field.unrequire_field_comment;
              }
            }
          } else {
            console.log(
              '!! Unreq field',
              field.unrequire_field_name,
              'not found',
            );
          }
        }
      }
    }
  };

  extraFillCascadeData = (
    cascadeData,
    fields,
    ii,
    cascadeFieldI,
    cascadeFieldC,
  ) => {
    // add extra fields to cascade if runnning for first time
    // console.log('hi ii cascadeFieldC',ii,fields,cascadeFieldC);
    const cascadeNew = JSON.parse(JSON.stringify(cascadeData));

    //  if(ii==0){

    if (cascadeFieldC == 0)
      for (let i in fields) {
        //console.log('hi i', i, fields[i]);
        // console.log('hi nx', fields[i].cascadable, cascadeNew);
        if (fields[i].cascadable) {
          const specialField = JSON.parse(JSON.stringify(fields[i]));

          specialField.id += '@@SpecialSubfield@@';
          if (i < cascadeFieldI) {
            cascadeNew.fields.unshift(specialField);
          } else {
            cascadeNew.fields.push(specialField);
          }

          //console.log('added to cascadable', ii, i, fields[i],cascadeFieldI);
        }
      }
    // }

    //  console.log('hi cascadeData',cascadeNew);
    return cascadeNew;
  };

  resurgeCascadedData = (subField, item, ii) => {
    let newSubField = {};

    for (let i in subField) {
      let splt = i.split('@@SpecialSubfield');
      if (splt.length > 1 && splt[1] == '@@') {
        item[splt[0]] = subField[i];
      } else {
        newSubField[i] = subField[i];
      }
    }

    return newSubField;
  };

  showTaskDetail = (field, item, group, ii, tracerid) => {
    console.log(
      'hi fill A',
      field,
      ', item :->>> ',
      item,
      ' , group :->>> ',
      group,
      ' , ii :->>>  ',
      ii,
      ' , tracerId :->>>',
      tracerid,
    );

    let hasActiveCascade = null;
    let cascadeFieldI = null;
    let hasCascade = false;
    let cascadeData = null;
    let cascadeFieldC = 0;
    console.log('nav 222', field.fields);
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

    //console.log('hi ee', field, item, JSON.stringify(hasCascade ? hasActiveCascade : field));

    if (hasCascade && !hasActiveCascade) {
      alert('You have no more fields to fill');
      return;
    }

    if (hasCascade) {
      hasActiveCascade = this.extraFillCascadeData(
        hasActiveCascade,
        field.fields,
        ii,
        cascadeFieldI,
        cascadeFieldC,
      );
    }
    //console.log('hi group',group);
    /*console.log('nav nav TaskDetail',hasActiveCascade && hasActiveCascade.name ? hasActiveCascade.name : field.name,
    {
        position: ii,
        pack: JSON.stringify( hasCascade ? (cascadeData||{}) : item),//hasCascade ? cascadeData : group),
        item: JSON.stringify(hasCascade ? hasActiveCascade : field)});*/

    this.props.navigation.navigate('TaskDetail', {
      title:
        hasActiveCascade && hasActiveCascade.name
          ? hasActiveCascade.name
          : field.name,
      saveMe: (subField, xfield, tracerid) => {
        if (hasCascade) {
          subField = this.resurgeCascadedData(subField, item, ii);
          item[hasActiveCascade.id] = subField;
        } else {
          group[ii] = subField;
        }
        if (group[ii] && group[ii].__is_just_added) {
          group[ii].__is_just_added = false;
        }
        console.log('saved?', ii, JSON.stringify(subField));
        //console.log('saved?',JSON.stringify(this.props.plan));
        /*for(let i in subField){
                 item[i] = subField[i];
                 }*/

        this.props.saveMe(this.props.plan, xfield, tracerid);

        this.setState({random: Math.random()});
      },
      tracerid: tracerid,
      position: ii,
      pack: JSON.stringify(hasCascade ? cascadeData || {} : item), //hasCascade ? cascadeData : group),
      item: JSON.stringify(hasCascade ? hasActiveCascade : field),
      styleSetup: JSON.stringify(this.props.styleSetup),
    });
  };

  populateNew = (pop, fields) => {
    // console.log('-------------------- populateNew');

    let iix = 0;

    let newonetable = {
      __is_new: true,
      __is_just_added: true,
    };

    for (let ii in fields) {
      let field2 = fields[ii];

      if (field2 && field2.prefill) {
        // console.log('prefill22', field.id);

        if (field2.type == 'no') {
          newonetable[field2.id] = pop[field.id].length + 1;
        }
        if (field2.type == 'date') {
          newonetable[field2.id] = moment().unix();
        }
        if (field2.type == 'datetime') {
          newonetable[field2.id] = moment().unix();
        }
        if (field2.type == 'time') {
          newonetable[field2.id] = moment().unix();
        }
      }
    }

    // console.log('new field :----> ', newonetable);

    iix = pop.length;
    pop.push(newonetable);

    this.setState({random: Math.random()});

    return iix;
  };

  fieldCheck = (field, value) => {
    // console.log('check field details :->>> ', field, value);
    let errmsg = undefined;
    //
    if (field && field.confirmation_message && value) {
      errmsg = field.confirmation_message;
    }

    let recommendation = undefined;

    if (field.type == 'tempc' || field.type == 'uint') {
      let vv = parseInt(value);
      let require_field_name = field.require_field_name;
      let require_if_higher = field.require_if_higher;
      let require_if_lower = field.require_if_lower;

      if (field.min && vv < field.min) {
        if (!field.recommendation) {
          errmsg =
            'The ' +
            field.name +
            ' specified is less than ' +
            field.min +
            ' degrees C.';
        } else {
          recommendation = field.recommendation;
        }
      }
      if (field.max && vv >= field.max) {
        if (!field.recommendation) {
          errmsg =
            'The ' +
            field.name +
            ' specified is more than ' +
            field.max +
            ' degrees C.';
        } else {
          recommendation = field.recommendation;
        }
      }

      if (
        require_field_name &&
        require_if_higher &&
        parseFloat(value) > require_if_higher
      ) {
        let require_field_nameLabel = this.props.fields.find(
          e => e.id == require_field_name,
        ).name;
        errmsg =
          '' +
          require_field_nameLabel +
          ' ' +
          (require_field_nameLabel.substring(
            require_field_nameLabel.length - 1,
            require_field_nameLabel.length,
          ) == 's'
            ? 'are'
            : 'is') +
          ' required, because ' +
          field.name +
          ' is too high!';
      }
      if (
        require_field_name &&
        require_if_lower &&
        parseFloat(value) < require_if_lower
      ) {
        // console.log('hello field', require_field_name);
        let require_field_nameLabel = this.props.fields.find(
          e => e.id == require_field_name,
        ).name;

        errmsg =
          '' +
          require_field_nameLabel +
          ' ' +
          (require_field_nameLabel.substring(
            require_field_nameLabel.length - 1,
            require_field_nameLabel.length,
          ) == 's'
            ? 'are'
            : 'is') +
          ' required, because ' +
          field.name +
          ' is too low!';
      }
    } else if (field.min || field.max) {
      if (field.min && value < field.min) {
        errmsg =
          'The ' + field.name + ' specified is less than ' + field.min + '.';
      }
      if (field.max && value >= field.max) {
        errmsg =
          'The ' + field.name + ' specified is more than ' + field.max + '.';
      }
    }

    let valueExists =
      (typeof value == 'boolean' && value) || (value && value.length > 0);

    // console.log('valueExists a field', valueExists);

    if (field.required && !valueExists) {
      //(!value || !value.length)){

      errmsg = 'Field  ' + field.name + ' is required.';
    }
    if (field.requiredsoft && !valueExists) {
      //(!value || !value.length)){
      errmsg = 'Field  ' + field.name + ' need to be filled.';
    }

    if (field.hide_field) {
      const otherfield = this.props.fields.find(e => {
        return e.id == field.hide_field;
      });

      // console.log('hide other?', otherfield, valueExists);

      if (valueExists) {
        // console.log('unrequirex a field', value.length, otherfield);

        otherfield.hidden = true;
      } else {
        //console.log('rerequire a field', typeof (value),otherfield);
        otherfield.hidden = false;
      }
    }

    if (field.unrequire_field_name) {
      const otherfield = this.props.fields.find(e => {
        return e.id == field.unrequire_field_name;
      });
      //console.log('unrequirea a field', field.unrequire_field_name,otherfield);

      if (otherfield) {
        if (valueExists) {
          //console.log('unrequirex a field', value.length,otherfield);
          otherfield.required = false;
          if (field.unrequire_field_comment) {
            otherfield.name = otherfield.originalname || otherfield.name;
          }
        } else {
          //console.log('rerequire a field', typeof (value),otherfield);
          otherfield.required = true;
          if (field.unrequire_field_comment) {
            if (!otherfield.originalname)
              otherfield.originalname = otherfield.name;
            otherfield.name = field.unrequire_field_comment;
          }
        }
      } else {
        console.log('!! Unreq field', field.unrequire_field_name, 'not found');
      }
    }

    let errSet = JSON.parse(JSON.stringify(this.state.errorsSet || {}));

    if (errmsg) {
      errSet[field.id] = errmsg;

      if (this.props.updateErrorsSet) {
        this.props.updateErrorsSet(field, errSet);
      }

      //alert(""+errmsg);
    } else {
      errSet[field.id] = undefined;

      if (this.props.updateErrorsSet) {
        this.props.updateErrorsSet(field, errSet);
      }
    }
    if (recommendation) {
      // console.log('hi recommendation',recommendation);
      //alert(recommendation);
    }
  };

  faceFill = (e, val) => {
    let fieldIndex = {};
    if (e.fields)
      for (let isubtable in e.fields) {
        fieldIndex[e.fields[isubtable].id] = e.fields[isubtable];
      }

    return (
      e.face &&
      e.face.map(fc => {
        if (val && typeof val[fc] != 'undefined') {
          if (fieldIndex[fc]) {
            if (fieldIndex[fc].type == 'time') {
              return moment(val[fc]).format('HH:mm');
            }
            if (fieldIndex[fc].type == 'date') {
              return moment(val).format('DD/MM/YYYY');
            }
            if (fieldIndex[fc].type == 'datetime') {
              return moment(val).format('DD/MM/YYYY HH:mm');
            }
            if (fieldIndex[fc].type == 'tempc') {
              return val[fc] + '°C';
            }
            if (fieldIndex[fc].type == 'checkbox') {
              return val[fc] ? 'Y' : 'N';
            }
          }

          return val[fc] + '';
        } else {
          return '-';
        }
      })
    );
  };

  createCheckboxSub = (fields, is_edit, tracerid) => {
    let newonetable = {};

    for (let i in fields) {
      let field2 = fields[i];
      // console.log('prefill77', field2.id);

      if (
        field2 &&
        field2.prefill &&
        (is_edit || !field2.enabled_only_on_edit)
      ) {
        //  console.log('prefill subcheck',field2.id, is_edit, field2.enabled_only_on_edit, newonetable[field2.id] );
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
            tracerid: tracerid,
            timer: field2.timer,
            timer_message: field2.timer_message,
          });
        }
        if (field2.timer_unset) {
          console.log('unset API 510');
          APIEvents.call('callTimerUnset', {
            fieldId: field2.id,
            tracerid: tracerid,
            timer: field2.timer,
            timer_message: field2.timer_message,
          });
        }
      }
    }

    return newonetable;
  };

  updateCheckboxSub = (fields, newonetable, is_new) => {
    if (!is_new) {
      for (let ii in fields) {
        let field2 = fields[ii];

        if (
          field2 &&
          field2.prefill &&
          field2.enabled_only_on_edit &&
          !newonetable[field2.id]
        ) {
          // console.log('prefill88', field2.id);

          //   console.log('prefill subcheck2',field2.id,newonetable[field2.id]);
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
        }
      }
    }
  };

  populateField = field => {
    let arr = [];

    // console.log('populate?', field.type, field.populate_rows);

    if (
      (field.type == 'table' || field.type == 'table-inline') &&
      typeof field.populate_rows != 'undefined' &&
      field.populate_rows > 0
    ) {
      for (let i = 0; i < field.populate_rows; i++) {
        this.populateNew(arr, field.fields);
      }

      // console.log('populate!',arr);
    }

    return arr;
  };

  updateErrorsSet = (field, errs) => {
    let errorsSet = this.props.errorsSet || {};

    errorsSet[field.id] = errs;
    if (this.props.updateErrorsSet) {
      //console.log('update errors',this.props.id,errs);
      this.props.updateErrorsSet({id: this.props.id}, errorsSet);
    }
  };

  render = () => {
    let fields = [];

    let errors = this.props.errorsSet ? this.props.errorsSet : {};
    // console.log("props props",this.props)
    //  console.log('current errors',errors,this.props.errorsSet);

    if (this.props.fields) {
      for (let i in this.props.fields) {
        let field = this.props.fields[i];

        // console.log('check fields :->>>>> ',field)

        let tracerid = this.props.tracerid; // +"."+field.id

        let error = errors && errors[field.id];
        // console.log('current error',field.id,error,error+'');

        if (field && field.hidden) {
          continue;
        }
        /*
                if(field && field.timer){
                    console.log('field with timer',field.id);
                }*/
        //console.log('hi field',field.id);

        let fieldName =
          '' +
          (field.name || '') +
          (field.required || field.requiredsoft ? '*' : '');

        let disabledOnFirstTry = false;
        let disabledAfterFirstTry = false;

        //console.log('is new?',field.id,this.props.isNew,field.enabled_only_on_edit);

        if (this.props.isNew && field.required && field.enabled_only_on_edit) {
          fieldName =
            '' + (field.name || '') + (field.required ? '* (* in edit)' : '');
          disabledOnFirstTry = true;
        }
        if (
          this.props.isNew &&
          field.requiredsoft &&
          field.enabled_only_on_edit
        ) {
          fieldName =
            '' + (field.name || '') + (field.required ? '* (* in edit)' : '');
          disabledOnFirstTry = true;
        }

        if (field.after_first_lock) {
          fieldName += this.props.isNew
            ? ' (once saved cannot be edited)'
            : ' (cannot edit)';

          disabledOnFirstTry = !this.props.isNew;
        }

        if (field.type == 'form') {
          if (!this.props.plan[field.id]) this.props.plan[field.id] = {};

          if (field.main_text) {
            fields.push(
              <Para
                key={'fieldtxt' + field.id + 'e' + i}
                size={5}
                styleSetup={this.props.styleSetup}
                style={{paddingTop: 20, paddingBottom: 6}}>
                {(field.main_text + '').trim()}
              </Para>,
            );
          }

          fields.push(
            <FormRenderer
              key={'field' + field.id + 'e' + i}
              setScrollEnabling={this.props.setScrollEnabling}
              mediaOption={this.props.mediaOption}
              tracerid={tracerid}
              id={field.id}
              styleSetup={this.props.styleSetup}
              navigation={this.props.navigation}
              is_new={this.props.__is_new}
              isEditable={this.props.isEditable}
              saveMe={(plan, fieldx, tracerid) => {
                this.props.plan[field.id] = plan;
                this.props.saveMe(this.props.plan, fieldx, tracerid);
              }}
              updateErrorsSet={this.updateErrorsSet}
              errorsSet={error}
              plan={this.props.plan[field.id]}
              fields={field.fields}
              formCheck={this.formCheck}
              isNew={this.props.isNew}
              formFill={(subfield, value) => {
                this.props.plan[field.id][subfield.id] = value;
                this.setState({rand: Math.random()});

                this.props.saveMe(
                  this.props.plan,
                  subfield,
                  tracerid + '.' + subfield.id,
                );
              }}
            />,
          );
        } else if (field.type == 'table' || field.type == 'table-inline') {
          if (!this.props.plan[field.id]) {
            this.props.plan[field.id] = this.props.__is_new
              ? this.populateField(field)
              : []; //populate new one in task detail

            console.log('popu', this.props.plan[field.id]);
          }

          const group = this.props.plan[field.id];
          console.log('group data check :--> ', group);

          if (field.name)
            fields.push(
              <Heading
                key={'fieldtxt' + field.id + 'e' + i}
                size={5}
                styleSetup={this.props.styleSetup}
                style={{paddingTop: 20, paddingBottom: 6}}>
                {fieldName}
              </Heading>,
            );

          this.state.events['formrenderer' + field.id] = {
            name: 'TableOpen',
            value: 'formrenderer' + field.id,
          };
          // if(field.type=='table'){
          APIEvents.addListener(
            'TableOpen',
            'formrenderer' + field.id,
            ({i, fieldId}) => {
              //console.log('this && this.props.selected',this && this.props.selected,i,fieldId,field.id);
              if (
                this &&
                (this.props.selected ||
                  typeof this.props.selected == 'undefined')
              ) {
                if (group && (!fieldId || fieldId == field.id)) {
                  this.showTaskDetail(
                    field,
                    group[i],
                    group,
                    i,
                    tracerid + '.' + i,
                  );
                }
              }
            },
          );
          // }

          const facing =
            field.face && field.face.map
              ? field.face
              : field.fields.map(e => e.id);

          fields.push(
            <View
              key={'fieldtxt' + field.id}
              style={{
                marginTop: !field.name ? 20 : 0,
                backgroundColor: 'transparent',
              }}>
              <View
                style={{
                  backgroundColor: '#4A5677',
                  flex: 1,
                  flexDirection: 'row',
                }}>
                {facing &&
                  facing.map((ekey, i) => {
                    let e = field.fields && field.fields[i];

                    if (ekey && ekey.match(/[\+\,]/)) {
                      let ff = ekey.split('.');
                      let egroup = field.fields.find(e => e.id == ff[0]);

                      if (egroup && egroup.fields) {
                        e = egroup.fields.find(e => e.id == ff[1]);
                      }
                    }

                    if (e) {
                      if (
                        e.type == 'signature' ||
                        e.type == 'images' ||
                        e.table_hide
                      )
                        return;
                      return (
                        <Text
                          key={'tablef' + i}
                          style={{
                            color: '#FFF',
                            padding: 10,
                            flex: e.flex || 2,
                          }}>
                          {e.name}
                        </Text>
                      );
                    } else if (ekey.match(/[\,\+]/)) {
                      const kk = ekey.match(/[\.]([a-zA-Z0-9]*)$/);
                      if (kk.length > 0) {
                        return (
                          <Text
                            key={'tablef' + i}
                            style={Layout.textStyle(this.props.styleSetup, {
                              color: '#FFF',
                              padding: 10,
                              flex: 2,
                            })}>
                            {kk[1].replace(/[0-9]/g, '')}
                          </Text>
                        );
                      }
                    } else {
                      return (
                        <Text
                          key={'tablef' + i}
                          style={Layout.textStyle(this.props.styleSetup, {
                            color: '#FFF',
                            padding: 10,
                            flex: 2,
                          })}>
                          {i + '?'}
                        </Text>
                      );
                    }
                  })}
              </View>

              {!group ||
              group.filter(item => !item.__is_just_added).length == 0 ? (
                <Para style={{marginLeft: 0, marginTop: 20}}>
                  Nothing found. Try adding more.
                </Para>
              ) : (
                undefined
              )}

              <View style={{flexGrow: 1}}>
                {group && group
                  ? group.map((item, i) => {
                      // console.log("group data check :->>>>>> ",item)
                      let datex = moment(item.date * 1000).format('DD/MM');

                      if (item.__is_just_added === true) return;

                      return (
                        <TouchableOpacity
                          onPress={() =>
                            this.showTaskDetail(
                              field,
                              item,
                              group,
                              i,
                              tracerid + '.' + i,
                            )
                          }
                          key={'ii' + item.id + Math.random()}
                          style={{
                            backgroundColor:
                              i % 2 == 0
                                ? 'rgba(255,255,255,0.18)'
                                : 'rgba(255,255,255,0.33)',
                            flexDirection: 'row',
                          }}>
                          {facing &&
                            facing.map((ekeyx, i) => {
                              let flexValue = undefined;
                              //   let e = field.fields && field.fields[i];

                              let isPlusPlus = ekeyx.match(/\+/);

                              let splitKey = ekeyx
                                .replace(/\+/g, ',')
                                .split(',');
                              let valval = [];

                              let e =
                                splitKey.length > 1
                                  ? undefined
                                  : field.fields && field.fields[i];

                              //  console.log('-----------------------------------');
                              //  console.log('hi fc',e);

                              for (let splitKeyI in splitKey) {
                                let val = '??';
                                let itemfield = e ? item[e.id] : null;

                                // console.log('hi subform-cascade',item[e.id]," , :-> ",item);

                                const ekey = splitKey[splitKeyI];
                                if (splitKey.length > 1) e = null;

                                if (!flexValue && e && e.flex) {
                                  flexValue = e.flex;
                                }

                                //  console.log('hi ekey',i,ekey);

                                if (!e && ekey && ekey.match(/[\.]/)) {
                                  let ff = ekey.split('.');
                                  let egroup = field.fields.find(
                                    ex => ex.id == ff[0],
                                  );

                                  // console.log(' !! hi egroupx',ff[0],field.fields);

                                  if (egroup && egroup.fields) {
                                    e = egroup.fields.find(e => e.id == ff[1]);
                                    if (
                                      egroup.type == 'checkbox' ||
                                      egroup.type == 'checkboxreveal' ||
                                      egroup.type == 'radio'
                                    ) {
                                      if (item[ff[0] + 'Sub'] && ff[1]) {
                                        itemfield = item[ff[0] + 'Sub'][ff[1]];
                                      }
                                    } else if (
                                      egroup.type == 'subform-cascade'
                                    ) {
                                      // console.log('hi subform-cascade',ff,egroup.type,item[ff[0]]);
                                      if (item[ff[0]]) {
                                        itemfield = item[ff[0]][ff[1]];
                                      }
                                    }
                                  }
                                }
                                // console.log('hi itemfield',e,itemfield);

                                if (e) {
                                  //{field.fields && field.fields.map((e,i)=>{
                                  // console.log('hi item val',e.id,itemfield);

                                  //console.log(' hi casc e',e.type,e.face,itemfield);
                                  if (
                                    e.type == 'signature' ||
                                    e.type == 'images' ||
                                    e.table_hide
                                  )
                                    return;

                                  val = itemfield;
                                  if (e.type == 'time') {
                                    val = itemfield
                                      ? moment(val).format('HH:mm')
                                      : '';
                                  }
                                  if (e.type == 'date') {
                                    val = itemfield
                                      ? moment(val).format('DD/MM/YYYY')
                                      : '';
                                  }
                                  if (e.type == 'datetime') {
                                    val = itemfield
                                      ? moment(val).format('DD/MM/YYYY HH:mm')
                                      : '';
                                  }
                                  if (e.type == 'select') {
                                    // alert('hello ')
                                    let esearch =
                                      e &&
                                      e.fields &&
                                      e.fields.find(
                                        child => child.id == itemfield,
                                      );
                                    if (esearch && esearch.name) {
                                      val = esearch.name;
                                    }
                                  }

                                  if (e.type == 'radio') {
                                    const obj = item[e.id + 'Sub'];

                                    for (const i in obj) {
                                      let esearch =
                                        e &&
                                        e.fields &&
                                        e.fields.find(child => child.id === i);

                                      if (esearch && esearch.name) {
                                        let newObj = obj[i + 'Sub'];
                                        if (newObj !== undefined) {
                                          let findId =
                                            esearch &&
                                            esearch.fields &&
                                            esearch.fields.map((item, i) => {
                                              return item.fields.find(
                                                child =>
                                                  child.id === newObj[item.id],
                                              );
                                            });
                                          // console.log("data",newObj,findId)

                                          val = findId[0].name;
                                        }
                                      }
                                    }
                                  }
                                  if (
                                    e.type == 'checkbox' ||
                                    e.type == 'checkboxreveal'
                                  ) {
                                    if (itemfield) {
                                      // console.log(' face fill');
                                      let valx = this.faceFill(
                                        e,
                                        item[e.id + 'Sub'],
                                      );
                                      let valx2 = this.faceFill(e, itemfield);

                                      if (!valx) {
                                        if (isPlusPlus) val = itemfield ? 1 : 0;
                                        else val = itemfield ? 'Yes' : 'No';
                                      } else {
                                        val = valx ? '' + valx.join(', ') : '';
                                      }
                                    } else if (typeof itemfield == 'boolean') {
                                      if (isPlusPlus) val = itemfield ? 1 : 0;
                                      else val = itemfield ? 'Yes' : 'No';
                                    } else {
                                      if (isPlusPlus) val = 0;
                                      else val = '-';
                                    }
                                  }
                                  if (e.type == 'subform-cascade') {
                                    if (e.face) {
                                      let valx = this.faceFill(e, val);

                                      val = '' + valx.join(', ');
                                    } else {
                                      val = '---';
                                    }
                                  }
                                }

                                valval.push(val);
                              }

                              if (isPlusPlus) {
                                let valx = 0;
                                for (let i in valval) {
                                  if (typeof valval[i] == 'number') {
                                    valx += valval[i];
                                  }
                                }
                                valval = [valx > 0 ? 'Yes' : 'No'];
                              }

                              return (
                                <Text
                                  key={'tablev' + i}
                                  style={Layout.textStyle(
                                    this.props.styleSetup,
                                    {
                                      color: '#FFF',
                                      padding: 10,
                                      flex: flexValue || 2,
                                    },
                                  )}>
                                  {valval.join(', ')}
                                </Text>
                              );
                            })}
                        </TouchableOpacity>
                      );
                    })
                  : undefined}
              </View>

              {field.type == 'table-inline' && !field.cant_add ? (
                <View style={{marginTop: 30}}>
                  <Button
                    type={'black-wide'}
                    styleSetup={this.props.styleSetup}
                    onPress={() => {
                      let iix = this.populateNew(group, field.fields);
                      // console.log('hi populate',iix,field.id);
                      APIEvents.call('TableOpen', {i: iix, fieldId: field.id});
                    }}
                    label={field.button || 'Add record'}
                  />
                </View>
              ) : (
                undefined
              )}

              <View style={{height: 120}} />
            </View>,
          );
        } else if (
          field.type == 'date' ||
          field.type == 'datetime' ||
          field.type == 'time'
        ) {
          fields.push(
            <Input
              navigation={this.props.navigation}
              key={'field' + field.id}
              tracerid={tracerid}
              id={field.id}
              type={field.type}
              placeholder={fieldName}
              disabled={disabledOnFirstTry || !!field.prefill}
              onBlur={v => this.fieldCheck(field, v)}
              error={error}
              styleSetup={this.props.styleSetup}
              onSubmitEditing={v => {
                this.props.formFill(field, v);
              }}
              text={this.props.plan[field.id]}
            />,
          );
        } else if (field.type == 'int') {
          fields.push(
            <Input
              navigation={this.props.navigation}
              key={'field' + field.id}
              id={field.id}
              tracerid={tracerid}
              error={error}
              type={'number'}
              keyboardType={'number-pad'}
              validation={'int'}
              placeholder={fieldName}
              disabled={disabledOnFirstTry || field.prefill}
              text={
                this.props.plan[field.id] ? this.props.plan[field.id] + '' : ''
              }
              styleSetup={this.props.styleSetup}
              autoCorrect={false}
              onSubmitEditing={v => this.props.formFill(field, v, tracerid)}
              onBlur={v => this.fieldCheck(field, v)}
            />,
          );
        } else if (field.type == 'uint') {
          fields.push(
            <Input
              navigation={this.props.navigation}
              key={'field' + field.id}
              id={field.id}
              tracerid={tracerid}
              error={error}
              type={'number'}
              keyboardType={'number-pad'}
              validation={'uint'}
              placeholder={fieldName}
              disabled={disabledOnFirstTry || field.prefill}
              text={
                this.props.plan[field.id] ? this.props.plan[field.id] + '' : ''
              }
              styleSetup={this.props.styleSetup}
              autoCorrect={false}
              onSubmitEditing={v => this.props.formFill(field, v, tracerid)}
              onBlur={v => this.fieldCheck(field, v)}
            />,
          );
        } else if (field.type == 'tempc') {
          fields.push(
            <Input
              navigation={this.props.navigation}
              key={'field' + field.id}
              id={field.id}
              tracerid={tracerid}
              error={error}
              type={'number'}
              keyboardType={'numbers-and-punctuation'}
              validation={'number'}
              placeholder={fieldName}
              disabled={disabledOnFirstTry || field.prefill}
              text={
                this.props.plan[field.id] ? this.props.plan[field.id] + '' : ''
              }
              styleSetup={this.props.styleSetup}
              autoCorrect={false}
              onSubmitEditing={v => {
                console.log('hihi field form', tracerid);
                this.props.formFill(field, v, tracerid + 'X');
              }}
              onBlur={v => this.fieldCheck(field, v)}
            />,
          );
        } else if (field.type == 'signature') {
          fields.push(
            <Input
              navigation={this.props.navigation}
              key={'field' + field.id}
              id={field.id}
              disabled={disabledOnFirstTry || field.prefill}
              tracerid={tracerid}
              error={error}
              type={'signature'}
              placeholder={fieldName}
              signature={this.props.plan[field.id]}
              style={{marginBottom: 20}}
              styleSetup={this.props.styleSetup}
              autoCorrect={false}
              scrollEnable={e => {
                if (typeof this.props.setScrollEnabling !== 'undefined') {
                  this.props.setScrollEnabling(e);
                }
              }}
              onSubmitEditing={v => this.props.formFill(field, v, tracerid)}
            />,
          );
        } else if (field.type == 'no') {
          fields.push(
            <Input
              navigation={this.props.navigation}
              key={'field' + field.id}
              type={'text'}
              tracerid={tracerid}
              error={error}
              placeholder={fieldName}
              disabled={disabledOnFirstTry || field.prefill}
              text={
                this.props.plan[field.id] ? this.props.plan[field.id] + '' : ''
              }
              styleSetup={this.props.styleSetup}
              autoCorrect={false}
              onSubmitEditing={v => this.props.formFill(field, v, tracerid)}
              onBlur={v => this.fieldCheck(field, v)}
            />,
          );
        } else if (field.type == 'text') {
          fields.push(
            <Input
              navigation={this.props.navigation}
              key={'field' + field.id}
              id={field.id}
              tracerid={tracerid}
              type={'text'}
              error={error}
              placeholder={fieldName}
              styleSetup={this.props.styleSetup}
              disabled={disabledOnFirstTry || field.prefill}
              text={
                this.props.plan[field.id] ? this.props.plan[field.id] + '' : ''
              }
              autoCorrect={false}
              onSubmitEditing={v => {
                this.props.formFill(field, v, tracerid);
              }}
              onBlur={v => this.fieldCheck(field, v)}
            />,
          );
        } else if (field.type == 'textfield') {
          fields.push(
            <Input
              navigation={this.props.navigation}
              key={'field' + field.id}
              type={'text'}
              id={field.id}
              tracerid={tracerid}
              error={error}
              placeholder={fieldName}
              disabled={disabledOnFirstTry || field.prefill}
              text={
                this.props.plan[field.id] ? this.props.plan[field.id] + '' : ''
              }
              styleSetup={this.props.styleSetup}
              autoCorrect={false}
              onSubmitEditing={v => this.props.formFill(field, v, tracerid)}
              onBlur={v => this.fieldCheck(field, v)}
            />,
          );
        } else if (field.type == 'images') {
          fields.push(
            <Images
              navigation={this.props.navigation}
              mediaOptions={e => {
                alert('image');
                // if (typeof this.props.mediaOption !== 'undefined') {
                //   this.props.mediaOption(e);
                // }
              }}
              key={'field' + field.id}
              type={'text'}
              id={field.id}
              tracerid={tracerid}
              error={error}
              placeholder={fieldName}
              disabled={disabledOnFirstTry || field.prefill}
              images={this.props.plan[field.id]}
              styleSetup={this.props.styleSetup}
              autoCorrect={false}
              onSubmitEditing={v => this.props.formFill(field, v)}
            />,
          );
        } else if (field.type == 'tabs') {
          if (!this.props.plan[field.id]) this.props.plan[field.id] = {};

          fields.push(
            <Tabs
              key={'field' + field.id}
              setScrollEnabling={this.props.setScrollEnabling}
              mediaOption={this.props.mediaOption}
              tracerid={tracerid}
              id={field.id}
              navigation={this.props.navigation}
              plan={this.props.plan[field.id]}
              fields={field.fields}
              styleSetup={this.props.styleSetup}
              updateErrorsSet={this.updateErrorsSet}
              errorsSet={error}
              isNew={this.props.isNew}
              saveMe={(plan, fieldx, traceridx) => {
                this.props.plan[field.id] = plan;
                this.props.saveMe(this.props.plan, fieldx, traceridx);
              }}
              formFill={(subfield, value) => {
                this.props.plan[field.id] = value;
                this.setState({rand: Math.random()});

                this.props.saveMe(this.props.plan, subfield || field, tracerid);
              }}
              onSubmitEditing={v => this.props.formFill(field, v)}
            />,
          );
        } else if (field.type == 'audit') {
          if (!this.props.plan[field.id]) this.props.plan[field.id] = {};

          fields.push(
            <Tabs
              key={'field' + field.id}
              setScrollEnabling={this.props.setScrollEnabling}
              mediaOption={this.props.mediaOption}
              id={field.id}
              tracerid={tracerid}
              styleSetup={this.props.styleSetup}
              navigation={this.props.navigation}
              plan={this.props.plan[field.id]}
              fields={field.fields}
              field={field}
              dynamicHeight={true}
              parentIsSection={this.props.parentIsSection}
              updateErrorsSet={this.updateErrorsSet}
              errorsSet={error}
              isNew={this.props.isNew}
              saveMe={(plan, fieldx, traceridx) => {
                this.props.plan[field.id] = plan;
                this.props.saveMe(this.props.plan, fieldx, traceridx);
              }}
              formFill={(subfield, value) => {
                this.props.plan[field.id] = value;
                this.setState({rand: Math.random()});
                this.props.saveMe(this.props.plan, subfield || field, tracerid);
              }}
              onSubmitEditing={v => this.props.formFill(field, v)}
            />,
          );
        } else if (field.type == 'section') {
          if (!this.props.plan[field.id]) this.props.plan[field.id] = {};

          fields.push(
            <Section
              key={'field' + field.id}
              id={field.id}
              tracerid={tracerid}
              styleSetup={this.props.styleSetup}
              navigation={this.props.navigation}
              plan={this.props.plan[field.id]}
              fields={field.fields}
              field={field}
              parentIsSection={this.props.parentIsSection}
              updateErrorsSet={this.updateErrorsSet}
              errorsSet={error}
              isNew={this.props.isNew}
              saveMe={(plan, fieldx, traceridx) => {
                this.props.plan[field.id] = plan;
                this.props.saveMe(this.props.plan, fieldx, traceridx);
              }}
              formFill={(subfield, value) => {
                this.props.plan[field.id] = value;
                this.setState({rand: Math.random()});

                this.props.saveMe(
                  this.props.plan,
                  subfield || field,
                  tracerid + '.' + field.id,
                );
              }}
              onSubmitEditing={v => this.props.formFill(field, v)}
            />,
          );
        } else if (field.type == 'subsection') {
          if (!this.props.plan[field.id]) this.props.plan[field.id] = {};

          fields.push(
            <SubSection
              key={'field' + field.id}
              mediaOption={e => {
                if (typeof this.props.mediaOption !== 'undefined') {
                  this.props.mediaOption(e);
                }
              }}
              mediaData={e => {
                console.log('mediaData :->> ', this.props.mediaData),
                  this.props.mediaData;
              }}
              id={field.id}
              tracerid={tracerid}
              styleSetup={this.props.styleSetup}
              navigation={this.props.navigation}
              plan={this.props.plan[field.id]}
              fields={field.fields}
              field={field}
              parentIsSection={this.props.parentIsSection}
              updateErrorsSet={this.updateErrorsSet}
              errorsSet={error}
              isNew={this.props.isNew}
              saveMe={(plan, fieldx, traceridx) => {
                this.props.plan[field.id] = plan;
                this.props.saveMe(this.props.plan, fieldx, traceridx);
              }}
              // tabValue={(v)=>{alert(v)}}
              formFill={(subfield, value) => {
                this.props.plan[field.id] = value;
                this.setState({rand: Math.random()});

                this.props.saveMe(
                  this.props.plan,
                  subfield || field,
                  tracerid + '.' + field.id,
                );
              }}
              onSubmitEditing={v => this.props.formFill(field, v)}
            />,
          );
        } else if (field.type == 'auditscore') {
          /*
                    fields.push(
                        <View key={"fieldtxt"+field.id+"e"+i+API.score} style={{marginBottom:40}}>
                            <Text style={Layout.textStyle(this.props.styleSetup,{fontFamily:"Roboto-Regular",color:"white",marginBottom:10,fontSize:17})}>{field.name}</Text>
                            <Text style={Layout.textStyle(this.props.styleSetup,{fontFamily:"Roboto-Regular",color:"white",marginBottom:10,fontSize:17})}>{isNaN(API.score)?0:parseFloat(API.score).toFixed(2)}%</Text>
                        </View>
                    );*/
          fields.push(
            <Input
              navigation={this.props.navigation}
              key={'field' + field.id}
              id={field.id}
              tracerid={tracerid}
              type={'text'}
              error={error}
              placeholder={field.name}
              styleSetup={this.props.styleSetup}
              style={{marginBottom: 40}}
              disabled={true}
              text={
                (isNaN(API.score) ? 0 : parseFloat(API.score).toFixed(2)) + '%'
              }
              autoCorrect={false}
              onSubmitEditing={v => {}}
              onBlur={v => {}}
            />,
          );
        } else if (field.type == 'select') {
          if (field.name)
            fields.push(
              <Text
                key={'fieldtxt' + field.id + 'e' + i}
                style={{
                  fontFamily: 'Roboto-Regular',
                  color: 'white',
                  marginBottom: 10,
                  fontSize: 17,
                }}>
                {fieldName}
              </Text>,
            );

          fields.push(
            <Select
              navigation={this.props.navigation}
              key={'fieldx' + field.id}
              id={field.id}
              tracerid={tracerid}
              mediaOption={this.props.mediaOption}
              error={error}
              placeholder={fieldName}
              disabled={disabledOnFirstTry || field.prefill}
              text={this.props.plan[field.id]}
              options={field.fields}
              styleSetup={this.props.styleSetup}
              style={{marginBottom: 20}}
              autoCorrect={false}
              onSubmitEditing={v => {
                this.fieldCheck(field, v);
                this.props.formFill(field, v, tracerid);
              }}
            />,
          );
        } else if (field.type == 'checkbox' || field.type == 'checkboxreveal') {
          // console.log('field checkbox :->>>', field.name, fieldName);
          if (field.type == 'checkboxreveal') {
            fields.push(
              <CheckboxReveal
                navigation={this.props.navigation}
                key={'fieldx' + field.id}
                type={'text'}
                id={field.id}
                placeholder={fieldName}
                disabled={disabledOnFirstTry || field.prefill}
                tracerid={tracerid}
                text={this.props.plan[field.id]}
                error={error}
                styleSetup={this.props.styleSetup}
                style={{paddingBottom: 10}}
                revealState={this.state['reveal_' + field.id]}
                revealResponse={revealStatus => {
                  // console.log('reveal',field.id,revealStatus);
                  const status = {};
                  status['reveal_' + field.id] = revealStatus;
                  this.setState(status);

                  if (field && field.timer) {
                    console.log(
                      'HELLO TIMER OF CHECKOUT REVEAL ELEMENT!',
                      this.state.item,
                    );
                    APIEvents.call('callTimer', {
                      fieldId: field.id,
                      tracerid: tracerid,
                      timer: field.timer,
                      timer_message: field.timer_message,
                    });
                  }
                  if (field && field.timer_unset) {
                    console.log(
                      'HELLO TIMER OF CHECKOUT REVEAL ELEMENT!2',
                      this.state.item,
                    );
                    APIEvents.call('callTimerUnset', {
                      fieldId: field.id,
                      tracerid: tracerid,
                      timer: field.timer,
                      timer_message: field.timer_message,
                    });
                  }
                }}
                autoCorrect={false}
                onSubmitEditing={v => {
                  this.props.formFill(field, v);
                }}
                onBlur={v => {
                  this.fieldCheck(field, v);
                }}
              />,
            );
          } else {
            fields.push(
              <Checkbox
                navigation={this.props.navigation}
                key={'fieldx' + field.id}
                type={'text'}
                id={field.id}
                placeholder={fieldName}
                disabled={disabledOnFirstTry || field.prefill}
                text={this.props.plan[field.id]}
                tracerid={tracerid}
                error={error}
                styleSetup={this.props.styleSetup}
                style={{paddingBottom: 10}}
                autoCorrect={false}
                // placeholderFunction={v=>alert(v)}
                onSubmitEditing={v => {
                  // console.log('check field name :- ', field);
                  this.props.formFill(field, v, tracerid);
                }}
                onBlur={v => {
                  this.fieldCheck(field, v);
                  // console.log('field data :->>>>>', field);
                }}
              />,
            );
          }

          if (
            this.props.plan[field.id] &&
            field.fields &&
            field.fields.length > 0 &&
            (field.type != 'checkboxreveal' || this.state['reveal_' + field.id])
          ) {
            if (!this.props.plan[field.id + 'Sub']) {
              this.props.plan[field.id + 'Sub'] = this.createCheckboxSub(
                field.fields,
                undefined,
                tracerid,
              );
            } else {
              this.updateCheckboxSub(
                field.fields,
                this.props.plan[field.id + 'Sub'],
                this.props.isNew,
              );
            }

            let errorx = errors && errors[field.id + 'Sub'];
            // console.log('field.fields 1' + field.name);

            fields.push(
              <FormRenderer
                key={'fieldsubform' + field.id}
                setScrollEnabling={this.props.setScrollEnabling}
                mediaOption={this.props.mediaOption}
                navigation={this.props.navigation}
                tracerid={tracerid}
                styleSetup={this.props.styleSetup}
                id={field.id}
                isNew={this.props.isNew}
                isEditable={this.props.isEditable}
                updateErrorsSet={(fieldx, errs) => {
                  this.updateErrorsSet({id: field.id + 'Sub'}, errs);
                }}
                errorsSet={errorx}
                saveMe={(plan, fieldx, traceridx) => {
                  this.props.plan[field.id + 'Sub'] = plan;
                  this.props.saveMe(this.props.plan, fieldx, traceridx);
                }}
                plan={this.props.plan[field.id + 'Sub']}
                fields={field.fields}
                formCheck={this.formCheck}
                formFill={(subfield, value) => {
                  this.props.plan[field.id + 'Sub'][subfield.id] = value;
                  this.setState({rand: Math.random()});
                  this.props.saveMe(
                    this.props.plan,
                    subfield || field,
                    tracerid,
                  );
                }}
              />,
            );
          }
        } else if (field.type == 'radio') {
          fields.push(
            <Heading
              key={'fieldtxt' + field.id}
              size={5}
              error={error}
              styleSetup={this.props.styleSetup}
              style={{paddingTop: 10, paddingBottom: 6}}>
              {field.name}
            </Heading>,
          );

          if (field.fields && field.fields.length > 0) {
            if (!this.props.plan[field.id + 'Sub'])
              this.props.plan[field.id + 'Sub'] = this.createCheckboxSub(
                field.fields,
              );
            else {
              this.updateCheckboxSub(
                field.fields,
                this.props.plan[field.id + 'Sub'],
                this.props.isNew,
              );
            }

            console.log('field.fields ' + field.name);

            let errorx = errors && errors[field.id + 'Sub'];
            fields.push(
              <FormRenderer
                key={'fieldsubform' + field.id}
                setScrollEnabling={this.props.setScrollEnabling}
                mediaOption={this.props.mediaOption}
                navigation={this.props.navigation}
                tracerid={tracerid}
                styleSetup={this.props.styleSetup}
                id={field.id}
                isNew={this.props.isNew}
                isEditable={this.props.isEditable}
                updateErrorsSet={(fieldx, errs) => {
                  this.updateErrorsSet({id: field.id + 'Sub'}, errs);
                }}
                errorsSet={errorx}
                saveMe={plan => {
                  console.log('hello :_> ' + plan);
                  this.props.plan[field.id + 'Sub'] = plan;
                  this.props.saveMe(this.props.plan, field, tracerid);
                }}
                plan={this.props.plan[field.id + 'Sub']}
                fields={field.fields}
                formCheck={this.formCheck}
                formFill={(subfield, value) => {
                  this.props.plan[field.id + 'Sub'] = this.createCheckboxSub(
                    field.fields,
                  );

                  console.log('check new data :->>>>>> ', value, subfield);

                  this.props.plan[field.id + 'Sub'][subfield.id] = value;
                  this.setState({rand: Math.random()});
                  this.props.saveMe(this.props.plan, field);
                }}
              />,
            );
          }

          fields.push(
            <View
              key={'fieldtxtx' + field.id}
              style={{paddingTop: 10, paddingBottom: 6}}
            />,
          );
        } else if (field.type == 'question') {
          fields.push(
            <Question
              navigation={this.props.navigation}
              mediaOption={e => {
                console.log(
                  'typeof this.props.mediaOption ',
                  typeof this.props.mediaOption,
                );
                // alert('ehllfdsf ' + e);
                if (typeof this.props.mediaOption !== 'undefined') {
                  this.props.mediaOption(e);
                }
              }}
              key={'field' + field.id}
              type={'number'}
              id={field.id}
              tracerid={tracerid}
              error={error}
              keyboardType={'number-pad'}
              validation={'phone'}
              placeholder={fieldName}
              disabled={disabledOnFirstTry || field.prefill}
              text={this.props.plan[field.id]}
              styleSetup={this.props.styleSetup}
              autoCorrect={false}
              onSubmitEditing={v => this.props.formFill(field, v)}
              onBlur={v => this.fieldCheck(field, v)}
            />,
          );
        } else if (field.type == 'phone') {
          fields.push(
            <Input
              navigation={this.props.navigation}
              key={'field' + field.id}
              type={'number'}
              id={field.id}
              tracerid={tracerid}
              error={error}
              keyboardType={'number-pad'}
              validation={'phone'}
              placeholder={fieldName}
              disabled={disabledOnFirstTry || field.prefill}
              text={this.props.plan[field.id]}
              styleSetup={this.props.styleSetup}
              autoCorrect={false}
              onSubmitEditing={v => this.props.formFill(field, v, tracerid)}
              onBlur={v => this.fieldCheck(field, v)}
            />,
          );
        } else if (field.type == 'email') {
          fields.push(
            <Input
              navigation={this.props.navigation}
              key={'field' + field.id}
              type={'email'}
              id={field.id}
              tracerid={tracerid}
              error={error}
              validation={'email'}
              placeholder={fieldName}
              disabled={disabledOnFirstTry || field.prefill}
              text={this.props.plan[field.id]}
              styleSetup={this.props.styleSetup}
              autoCorrect={false}
              onSubmitEditing={v => this.props.formFill(field, v, tracerid)}
              onBlur={v => this.fieldCheck(field, v)}
            />,
          );
        } else if (field.type == 'title') {
          fields.push(
            <Heading
              key={'fieldtxt' + field.id}
              size={5}
              numberOfLines={10}
              styleSetup={this.props.styleSetup}
              style={{paddingTop: 20, paddingBottom: 16}}>
              {field.name}
            </Heading>,
          );
        } else {
          console.log('unknown type', field.type, field);
        }
      }
    }

    return (
      <View
        key={this.props.id + 'FormRenderer'}
        style={[this.props.style, {backgroundColor: 'transparent'}]}>
        {fields}
      </View>
    );
  };
}
