/**
 * Created by jedrzej on 15/06/2020.
 */

import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TextInput,
  Button,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Link} from '@react-navigation/native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';

import {Layout} from '../api/API';

import APIEvents from '../api/APIEvents';
import FormRenderer from '../components/FormRenderer';

const initialLayout = {width: Dimensions.get('window').width};

export default class Input extends React.Component {
  constructor(props) {
    super(props);
    console.log('constructor');
    this.state = {
      tabs: ['All Forms'],
      heights: {},
      index: 0,
      list: null,
      routes: this.props.fields.map(e => {
        return {key: e.id, title: e.name};
      }),
      loaded: false,
    };

    APIEvents.call(
      'ActiveTab',
      this.state.routes && this.state.routes.length > 0
        ? this.state.routes[0].key
        : null,
    );
  }

  componentDidMount = async () => {
    APIEvents.addListener('resetformsizes', 'Tabs' + this.props.id, a => {
      console.log('resetformsizes');
      this.setState({random: Math.random()});
    });
    APIEvents.call(
      'ActiveTab',
      this.state.routes && this.state.routes.length > 0
        ? this.state.routes[0].key
        : null,
    );
  };

  componentWillUnmount() {
    APIEvents.removeListener('resetformsizes', 'Tabs' + this.props.id);
  }

  setIndex = i => {
    const key =
      this.state.routes && this.state.routes.length > 0 && this.state.routes[i]
        ? this.state.routes[i].key
        : null;
    this.setState({index: i});
    APIEvents.call('ActiveTab', key);
  };

  updateErrorsSet = (field, errs) => {
    this.props.updateErrorsSet({id: this.props.id}, errs);
  };

  render = () => {
    let {index, routes} = this.state;
    let errors = this.props.errorsSet ? this.props.errorsSet : {};

    const indexKey =
      this.state.routes &&
      this.state.routes.length > 0 &&
      this.state.routes[index]
        ? this.state.routes[index].key
        : null;

    const renderScene = ({route, index}) => {
      for (let i in this.props.fields) {
        const field = this.props.fields[i];
        let error = errors && errors[field.id];

        if (field.id == route.key) {
          if (!this.props.plan[field.id]) this.props.plan[field.id] = {};

          const tracerid = this.props.tracerid + '.' + field.id;

          return (
            <View
              onLayout={event => {
                let {height} = event.nativeEvent.layout;
                this.state.heights[field.id] = height;

                console.log('get height :->>>>>> ', this.state.heights);

                if (!this.state.heightsset) {
                  this.state.heightsset = true;
                  setTimeout(() => {
                    this.state.heightsset = false;
                  }, 500);
                  this.setState({random: Math.random()});
                }
              }}
              key={route.key}
              style={{
                backgroundColor: 'transparent',
                marginTop: 20,
                marginLeft: 10,
                marginRight: 10,
              }}>
              <FormRenderer
                key={'fieldsubform' + field.id}
                setScrollEnabling={this.props.setScrollEnabling}
                id={field.id}
                tracerid={tracerid}
                navigation={this.props.navigation}
                isEditable={this.props.isEditable}
                isNew={this.props.isNew}
                styleSetup={this.props.styleSetup}
                selected={
                  this.props.fields[this.state.index] &&
                  this.props.fields[this.state.index].id == field.id
                }
                saveMe={(plan, fieldx, traceridx) => {
                  this.props.plan[field.id] = plan;
                  // console.log('save me',plan);
                  this.props.saveMe(this.props.plan, fieldx, traceridx);
                }}
                updateErrorsSet={(fieldx, errs) => {
                  let errorsSet = error || {};

                  errorsSet[field.id] = errs;

                  if (this.updateErrorsSet) {
                    //console.log('hi idx2',fieldx.id,field.id,errorsSet);
                    this.updateErrorsSet(field, errorsSet);
                  }
                }}
                errorsSet={error}
                plan={this.props.plan[field.id]}
                fields={field.fields}
                formFill={(subfield, value) => {
                  this.props.plan[field.id][subfield.id] = value;
                  this.setState({random: Math.random()});
                  this.props.saveMe(
                    this.props.plan,
                    subfield,
                    tracerid + '.' + subfield.id,
                  );
                }}
              />
            </View>
          );
        }
      }

      return <View style={{}} />;
    };

    //
    // console.log('indexKey',indexKey,newArray[indexKey])
    return (
      <TabView
        sceneContainerStyle={{
          height: this.state.heights[indexKey]
            ? Math.round(this.state.heights[indexKey])
            : 'auto',
        }}
        navigationState={{index, routes}}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={this.setIndex}
        indicatorStyle={{backgroundColor: 'white'}}
        style={{marginLeft: -10, marginRight: -10, marginTop: -20}}
        tabBarPosition="top"
        initialLayout={initialLayout}
      />
    );
  };
}
const renderTabBar = props => (
  <ScrollView
    horizontal={true}
    style={{flexGrow: 0, height: 56, backgroundColor: '#121B36'}}>
    <TabBar
      {...props}
      getLabelText={({route}) => route.title}
      indicatorStyle={{backgroundColor: '#96a825', height: 0}}
      tabContainerStyle={(a, b, c) => {
        // console.log('xxx',a,b,c);
      }}
      indicatorContainerStyle={{}}
      renderLabel={({route, focused, color}) => (
        <View
          style={{
            flex: 1,
            margin: -10,
            justifyContent: 'center',
            backgroundColor: focused ? '#0974DB' : 'transparent',
          }}>
          <Text
            style={{
              color: '#FFF',
              margin: 18,
              fontWeight: 'bold',
              fontFamily: 'Overpass-Regular',
            }}>
            {route.title}
          </Text>
        </View>
      )}
      style={{height: 60, width: 'auto', backgroundColor: 'transparent'}}
      labelStyle={{
        height: 30,
        fontWeight: 'bold',
        fontSize: 14,
        textTransform: 'none',
      }}
    />
  </ScrollView>
);
