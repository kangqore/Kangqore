/**
 * API Key authentication.
 *
 * The user pastes their Kangqore API key (found at /dashboard/settings).
 * We include it as `X-Api-Key` on every request.
 */

const testAuth = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiBase}/api/scheduling/zapier/events`,
    headers: { 'X-Api-Key': bundle.authData.apiKey }
  });

  if (response.status === 401) {
    throw new z.errors.Error('Invalid API key. Check your Kangqore account settings.', 'AuthenticationError', 401);
  }

  return { authenticated: true };
};

module.exports = {
  type: 'custom',
  fields: [
    {
      key: 'apiKey',
      label: 'API Key',
      required: true,
      type: 'password',
      helpText:
        'Found in your Kangqore dashboard under **Settings → API Access**. ' +
        'Your key starts with your user ID.'
    },
    {
      key: 'apiBase',
      label: 'API Base URL',
      required: true,
      type: 'string',
      default: 'https://api.kangqore.com',
      helpText:
        'Leave as default unless you are on a self-hosted or custom-domain deployment.'
    }
  ],
  test: testAuth,
  connectionLabel: '{{bundle.authData.apiKey}}'
};
