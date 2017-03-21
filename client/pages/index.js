
import ADC from './ADC';
import Security from './Security';
import Dashboard from './Dashboard';
import Dev from './Dev';
import Common from './Common';

export default {
  app: [Dashboard, ADC, Security, Dev],
  common: [Common]
}
