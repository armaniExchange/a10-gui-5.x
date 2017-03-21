import React from 'react';

function LicenseManager(props) {
  const { children } = props;
  return (
    <div>
      {children}
    </div>
  );
}

LicenseManager.displayName = 'LicenseManager';

LicenseManager.defaultPropTypes = {
  component: LicenseManager,
  license: {
    'source2-module':'WEBROOT',
    'source2-expiry':'N/A',
    'source2-notes':'Requires an additional Webroot license.'
  }
};

export default LicenseManager;
