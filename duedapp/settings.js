/**
 * Created by jedrzej on 01/10.
 */

import {Platform} from 'react-native';

const isProduction = false;

export default (setup = {
  name: 'Dued',

  isProduction: isProduction,
  apiDomain: isProduction ? 'admin.dued.uk' : 'test-admin.dued.uk',

  os: Platform.OS,

  isDev: false,

  bespoked: false,
  single: false,
  bespokedIdent: undefined,
  showApiErrors: false,

  layout: {
    gradient: ['#0087CB', '#161617'],
    windowGradient: ['#404040', '#161617'],
    windowBg: '#161617',
  },

  stripe: {
    publishableKey: isProduction ? '..' : '..',
    merchantId: 'dfgfgdfg', // Optional
    androidPayMode: isProduction ? 'production' : 'test',
  },
});
