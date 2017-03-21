import Templates from './Templates';
import VirtualPort from './VirtualPort';
import VirtualServer from './VirtualServer';

export default {
  path: 'adc',
  pages: { Templates, VirtualPort, VirtualServer },
  license: {
    'source2-module':'SLB',
    'source2-expiry':'None',
    'source2-notes':''
  }
};
