import asyncComponent from 'helpers/asyncComponent';

const WizardPage = asyncComponent(() =>
  System.import('./Wizard').then(module => module.default)
);

const ServiceListPage = asyncComponent(() =>
  System.import('./List').then(module => module.default)
);

const ReportSolutionPage = asyncComponent(() =>
  System.import('./Solutions/ReportSolution').then(module => module.default)
);

const SummarySolutionPage = asyncComponent(() =>
  System.import('./Solutions/SummarySolution').then(module => module.default)
);

const SolutionWizardPage = asyncComponent(() =>
  System.import('./Solutions/Wizard').then(module => module.default)
);

export default {
  path: 'ssli',
  pages: {
    wizard: {
      component: WizardPage,
      menuPath: [ 'Security', 'SSLi', 'Wizard' ]
    },
    list: {
      component: ServiceListPage,
      menuPath: [ 'Security', 'SSLi', 'List' ]
    },
    report: {
      component: ReportSolutionPage,
      menuPath: [ 'Security', 'SSLi', 'Solutions - Report' ]
    },
    summary: {
      component: SummarySolutionPage,
      menuPath: [ 'Security', 'SSLi', 'Solutions - Summary' ]
    },
    solutionWizard: {
      component: SolutionWizardPage,
      menuPath: [ 'Security', 'SSLi', 'Solutions - Wizard' ]
    }
  }
};
