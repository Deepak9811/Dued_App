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

import SplashScreen from 'react-native-splash-screen';

var moment = require('moment');

import {SearchBar} from 'react-native-elements';
import Carousel, {Pagination} from 'react-native-snap-carousel';

import CheckBox from '@react-native-community/checkbox';
import LinearGradient from 'react-native-linear-gradient';

import settings from '../../settings';

import {API, Layout, _} from '../api/API';
import APIEvents from '../api/APIEvents';

import ContainerScrollableView from '../components/ContainerScrollableView';

import Background from '../components/Background';
import Button from '../components/Button';
import Input from '../components/Input';

class CurrentView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      salons: [{name: 'Your salon (main branch)', id: 0}],
    };

    // console.log('hi mopunt',this.props.route);
  }
  componentWillUnmount() {}

  componentDidMount = async () => {
    console.log('hi mopunt 222', this.props.route);
  };

  componentDidUpdate(prevProps) {
    //  console.log('gggg',this.props.route);
  }

  submit = e => {
    if (this.state.loading) {
      alert(_('Please wait'));
      return;
    }

    this.setState({loading: true});

    //console.log('salon',this.state.selectedSalon);

    API.postContactForm(
      {
        subject: this.state.subject,
        name: this.state.name,
        email: this.state.email,
        phone: this.state.tel,
        message: this.state.message,
      },
      (err, dt, showApiErrors) => {
        console.log('hello contact', err, dt);

        this.setState({loading: false});

        if (err) {
          this.setState({error: err});
          alert(err || _('Error in API'));
          return;
        } else if (!dt.success) {
          let error = API.parseResponseErrors(dt);
          this.setState({error: error});
          alert(error || err || dt.message || _('Error in API'));

          return;
        }

        this.setState({
          rand: Math.random(),
          subject: '',
          name: '',
          email: '',
          phone: '',
          message: '',
        });

        alert(_("Thank You! We'll come back to you shortly!"));
        this.props.navigation.goBack();
      },
    );
  };

  formFill = (field, value) => {
    this.state[field] = value;
  };

  showSalon = () => {
    // onSubmitEditing={(v)=>this.form('salon',v)}
    this.props.navigation.navigate('SalonModal', {
      value: this.state.selectedSalon && this.state.selectedSalon.id,
      label: this.state.selectedSalon && this.state.selectedSalon.name,
      callback: e => this.setState({selectedSalon: e}),
    });
  };

  render() {
    let isAuthorized = API.isAuthorized();

    return (
      <Background scrolls={true} style={{flex: 1}} offsetCall={this.offsetCall}>
        <ContainerScrollableView
          keyboardAware={true}
          style={{marginLeft: 30, marginTop: 60, marginRight: 30, zIndex: 10}}>
          <View
            key={this.state.rand}
            style={{marginHorizontal: 0, marginTop: 0}}>
            <Input
              type={'name'}
              placeholder={_('Subject*')}
              onSubmitEditing={v => this.formFill('subject', v)}
            />
            <Input
              type={'name'}
              placeholder={_('Your name*')}
              onSubmitEditing={v => this.formFill('name', v)}
            />
            <Input
              type={'email'}
              placeholder={_('Your email*')}
              autoCorrect={false}
              onSubmitEditing={v => this.formFill('email', v)}
            />
            <Input
              type={'tel'}
              placeholder={_('Telephone Number')}
              autoCorrect={false}
              onSubmitEditing={v => this.formFill('tel', v)}
            />

            <Input
              type={'text'}
              placeholder={_('Message*')}
              numberOfLines={8}
              autoCorrect={false}
              onSubmitEditing={v => this.formFill('message', v)}
            />

            <Button
              label={_(this.state.loading ? 'Loading...' : 'Submit')}
              style={{marginTop: 20}}
              onPress={this.submit}
            />

            <View style={{height: 50}} />
          </View>
          <View style={{height: 80}} />
        </ContainerScrollableView>
      </Background>
    );
  }
}

const styles = StyleSheet.create({});

export default CurrentView;
