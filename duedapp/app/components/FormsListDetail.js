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
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import FastImage from 'react-native-fast-image';
import SplashScreen from 'react-native-splash-screen';

var moment = require('moment');

import {SearchBar} from 'react-native-elements';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';

import LinearGradient from 'react-native-linear-gradient';

import settings from '../../settings';

import {API, Layout, _} from '../api/API';
import APIEvents from '../api/APIEvents';

import Background from '../components/Background';
import Button from '../components/Button';
import Heading from '../components/Heading';
import MembershipButton from '../components/MembershipButton';
import OfferBox from '../components/OfferBox';
import Para from '../components/Para';
import TaskButton from '../components/TaskButton';
import VoucherBox from '../components/VoucherBox';
import Window from '../components/Window';

import AlertText from '../components/AlertText';
import Lock from '../components/Lock';

const initialLayout = {width: Dimensions.get('window').width};

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

class CurrentView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
    };
  }
  componentWillUnmount() {}

  componentDidMount = async () => {
    /*
        API.postForms({category: this.props.keyr, page:this.state.page},(err,dt,showApiErrors)=>{

            console.log('eee',err,dt);
            if(err || !dt.success){

                if(showApiErrors){
                    alert(err || dt.message || "Error in API");
                }

                return;
            }

            if(dt.list){
console.log('hi list',dt.list,{...dt});
                this.setState({...dt});

            }


        });*/
  };

  get pagination() {
    const {entries, activeSlide} = this.state;
    return (
      <Pagination
        dotsLength={3}
        activeDotIndex={activeSlide}
        containerStyle={{marginTop: -80, backgroundColor: 'transparent'}}
        dotStyle={{
          width: 8,
          height: 8,
          borderRadius: 5,
          marginHorizontal: -10,
          backgroundColor: '#0087CB',
        }}
        inactiveDotStyle={{
          width: 8,
          height: 8,
          backgroundColor: '#161617',
          // Define styles for inactive dots here
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={1}
      />
    );
  }

  offsetCall = a => {
    if (a == 0) {
      return this.setState({height: 200});
    }

    this.setState({
      height: Math.max(0, 200 - a),
    });
  };

  task = async e => {
    console.log('data tabs :->>>>> ', e);
    if (await API.haveTaskType(e)) {
      Alert.alert(
        'Form',
        'There is already an instance of this form on the dashboard, do you wish to create a duplicate',
        [
          {
            text: 'NO',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => {
              this.createTask(e);
            },
            style: 'default',
          },
        ],
        {
          cancelable: true,
        },
      );
    } else {
      this.createTask(e);
    }
  };

  createTask = e => {
    console.log('create :->>> ', e);
    let newTask = API.createTask(e);
    // API.saveTask(e,true);

    // setTimeout(()=>{
    /*
            this.props.navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });*/
    /*
This does crazy things on some old devices https://app.asana.com/0/1200932353231814/1202261673443832 : */
    /*this.props.navigation.navigate('Forms',{
                screen: 'Task',
                params: {id:e.id,pack:JSON.stringify(newTask)}
            })*/
    // this might be crazier ;)
    const payload = {
      id: e.id,
      rand: Math.random(),
      pack: JSON.stringify(newTask),
    };
    APIEvents.call('TaskReload', payload);

    this.props.navigation.navigate('Task', payload);

    //  this.props.navigation.navigate('Home');
    // this.props.navigation.switchToTab({tabIndex:1});
    /*setTimeout(()=>{
            },500);*/
    // },500);
  };

  setIndex = i => {
    this.setState({index: i});
  };

  onRefresh = () => {
    this.state.refreshing = true;
    this.setState({refreshing: true});
    wait(2000).then(() => this.setState({refreshing: false}));
  };

  render() {
    const list = this.props.list;

    return (
      <Background scrolls={true} style={{flex: 1}} offsetCall={this.offsetCall}>
        <ScrollView
          style={{marginTop: 10, paddingBottom: 10}}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }>
          {!list || list.length == 0 ? (
            <Para
              style={{
                textAlign: 'center',
                marginBottom: 300,
                marginTop: 30,
                flex: 1,
              }}>
              {this.props.keyr == 'Loading' ? 'Loading...' : 'Nothing found'}
            </Para>
          ) : (
            undefined
          )}

          {list &&
            list.map((e, i) => {
              return (
                <TaskButton
                  key={'b' + i}
                  onPress={() => this.task(e)}
                  plan={e}
                />
              );
            })}

          <View style={{height: 100}} />
        </ScrollView>
      </Background>
    );
  }
}

const renderTabBar = props => (
  <View style={{backgroundColor: '#1D1D1D'}}>
    <TabBar
      {...props}
      getLabelText={({route}) => route.title}
      indicatorStyle={{backgroundColor: '#96a825', height: 5}}
      style={{
        backgroundColor: 'transparent',
        marginBottom: 22,
        marginLeft: 10,
        marginRight: 10,
      }}
      labelStyle={{fontWeight: 'bold', fontSize: 14, textTransform: 'none'}}
    />
  </View>
);

const styles = StyleSheet.create({});

export default CurrentView;
