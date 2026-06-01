const { version: zapierVersion } = require('zapier-platform-core');
const { version: appVersion } = require('./package.json');

const authentication  = require('./authentication');
const bookingCreated      = require('./triggers/bookingCreated');
const bookingCancelled    = require('./triggers/bookingCancelled');
const bookingRescheduled  = require('./triggers/bookingRescheduled');
const bookingNoShow       = require('./triggers/bookingNoShow');

const addApiKeyHeader = (request, z, bundle) => {
  request.headers['X-Api-Key'] = bundle.authData.apiKey;
  return request;
};

const App = {
  version: appVersion,
  platformVersion: zapierVersion,

  authentication,

  beforeRequest: [addApiKeyHeader],

  triggers: {
    [bookingCreated.key]:     bookingCreated,
    [bookingCancelled.key]:   bookingCancelled,
    [bookingRescheduled.key]: bookingRescheduled,
    [bookingNoShow.key]:      bookingNoShow
  },

  creates:  {},
  searches: {}
};

module.exports = App;
