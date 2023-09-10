/**
 * Created by jedrzej on 1/06/2020.
 */

import * as React from 'react';

import {
  ActivityIndicator,
  Animated as AnimatedX,
  AppState,
  AppStateStatus,
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

import FormsListDetail from '../components/FormsListDetail';

import AlertText from '../components/AlertText';
import Lock from '../components/Lock';

const initialLayout = {width: Dimensions.get('window').width};

class CurrentView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabs: ['All Forms'],
      index: 0,
      list: null,
      routes: [{key: 'Loading', title: 'Loading'}],
      /*routes: [
                {key: 'Details', title: 'Details'},
                {key: 'Services', title: 'Services'},
                {key: 'Reviews', title: 'Reviews'},
                {key: 'Gallery', title: 'Gallery'},
            ],*/
      loading: false,
    };

    APIEvents.addListener('reloadList', 'FormList', () => {
      this.componentDidMount();
    });
  }

  setinterval = () => {
    if (this.interval) {
      clearTimeout(this.interval);
      this.interval = null;
    }

    this.interval = setTimeout(() => {
      this.componentDidMount();
    }, 1000 * 60 * 30);
  };
  clearinterval = () => {
    if (this.interval) {
      clearTimeout(this.interval);
      this.interval = null;
    }
  };

  onAppStateChange = state => {
    //console.log('state',state);
    if (state === 'active') {
      // Add code to check your wallet here
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        // console.log('rere');
        this.setState({
          rand: Math.random(),
          loading: false,
        });

        this.timeout = null;
        this.componentDidMount();
      }, 200);
    } else {
      this.setState({loading: true});
    }
  };

  componentWillUnmount() {
    this.clearinterval();
    AppState.removeEventListener('change', this.onAppStateChange);
    APIEvents.removeListener('reloadList', 'FormList');
  }

  componentDidMount = async () => {
    AppState.addEventListener('change', this.onAppStateChange);
    this.props.navigation.setOptions({title: 'Forms'});

    API.postForms({}, (err, dt, showApiErrors) => {
      //console.log('reloaded',dt,err);

      this.setinterval();

      if (err || !dt || !dt.success) {
        if (showApiErrors) {
          alert(err || dt.message || 'Error in API');
        }
        console.log('error forms', err, dt);
        this.setState({loading: false});
        return;
      }

      if (dt.list && dt.tabs) {
        console.log(
          'hi routes',
          dt.tabs,
          Object.keys(dt.list).map(e => {
            return {key: e, title: e};
          }),
        );

        if (dt.tabs.length == 0) {
          this.setState({
            loading: false,
            routes: [{key: 'No forms', title: 'No forms found'}],
          });

          return;
        }

        this.setState({
          loading: false,
          ...dt,
          routes: dt.tabs.map(e => {
            return {key: e, title: e};
          }),
        });
      }
    });
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

  task = e => {
    /*

        API.saveTask(
            {
                name: 'Hot Cupboard', id: Math.random() + ''

            });

        setTimeout(()=>{


            this.props.navigation.navigate('Home');
           // this.props.navigation.switchToTab({tabIndex:1});
            /*setTimeout(()=>{
            },500);* /
        },500);*/
  };

  setIndex = i => {
    this.setState({index: i});
  };

  render() {
    const {navigator, route} = this.props;
    let {index, routes, data} = this.state;

    const renderScene = ({route}) => {
      //console.log('rrr',route.key,(this.state.list && this.state.list[route.key]) || []);
      return (
        <FormsListDetail
          key={route.key}
          reload={this.componentDidMount}
          keyr={route.key}
          list={(this.state.list && this.state.list[route.key]) || []}
          navigation={this.props.navigation}
        />
      );
    };

    return (
      <>
        <TabView
          key={this.state.rand}
          navigationState={{index, routes}}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={this.setIndex}
          indicatorStyle={{backgroundColor: 'white'}}
          style={{backgroundColor: '#323231'}}
          tabBarPosition="top"
          initialLayout={initialLayout}
        />
        {this.state.loading ? (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              backgroundColor: '#18264c',
            }}>
            <ActivityIndicator style={{marginTop: 100}} />
          </View>
        ) : (
          undefined
        )}
      </>
    );
    /*

        return (<Background scrolls={true} style={{flex:1}} offsetCall={this.offsetCall}>


            <ScrollView style={{marginTop:30,paddingBottom:10}}  >


                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    renderTabBar={renderTabBar}
                    onIndexChange={this.setIndex}
                    indicatorStyle={{ backgroundColor: 'white' }}
                    style={{ backgroundColor: '#323231' }}
                    tabBarPosition="bottom"
                    initialLayout={initialLayout}
                    />





                {!this.state.list || this.state.list.length==0?<Para style={{textAlign:'center',marginBottom:300,marginTop:30,flex:1}}>Nothing found</Para>:undefined}

            {this.state.list && this.state.list.map((e,i)=>{

                return <TaskButton key={"b"+i} onPress={()=>this.task(e)} plan={e} />;
            })}


                <View style={{height:50}}></View>
            </ScrollView>

        </Background>);*/
  }
}

const renderTabBar = props => {
  const {width} = Dimensions.get('window');
  // console.log('render');
  return (
    <TabBar
      {...props}
      getLabelText={({route}) => route.title}
      scrollEnabled={true}
      indicatorStyle={{backgroundColor: '#96a825', height: 0}}
      tabContainerStyle={(a, b, c) => {
        console.log('xxx', a, b, c);
      }}
      indicatorContainerStyle={{}}
      renderLabel={({route, focused, color}) => {
        return (
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
                margin: 10,
                fontWeight: 'bold',
                fontFamily: 'Overpass-Regular',
              }}>
              {route.title}
            </Text>
          </View>
        );
      }}
      tabStyle={{width: 'auto'}}
      style={{height: 46, width: width, backgroundColor: '#121B36'}}
      labelStyle={{
        height: 30,
        fontWeight: 'bold',
        fontSize: 14,
        textTransform: 'none',
      }}
    />
  );
};

const renderItem = ({}) => {
  return <TouchableOpacity />;
};

const styles = StyleSheet.create({});

export default CurrentView;
