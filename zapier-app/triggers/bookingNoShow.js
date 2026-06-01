const subscribeHook = async (z, bundle) => {
  const response = await z.request({
    method: 'POST',
    url: `${bundle.authData.apiBase}/api/scheduling/zapier/subscribe`,
    headers: { 'X-Api-Key': bundle.authData.apiKey },
    body: { hookUrl: bundle.targetUrl, event: 'booking.no_show' }
  });
  return response.data;
};

const unsubscribeHook = async (z, bundle) => {
  await z.request({
    method: 'DELETE',
    url: `${bundle.authData.apiBase}/api/scheduling/zapier/subscribe`,
    headers: { 'X-Api-Key': bundle.authData.apiKey },
    body: { id: bundle.subscribeData.id }
  });
};

const getSample = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiBase}/api/scheduling/zapier/sample/booking.no_show`,
    headers: { 'X-Api-Key': bundle.authData.apiKey }
  });
  return response.data;
};

module.exports = {
  key: 'booking_no_show',
  noun: 'Booking',
  display: {
    label: 'No-Show Booking',
    description: 'Triggers when a host marks an invitee as a no-show.'
  },
  operation: {
    type: 'hook',
    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,
    perform: (z, bundle) => [bundle.cleanedRequest.data],
    performList: getSample,
    sample: {
      id: 'evt_example',
      title: 'Strategy Consultation with Jane Smith',
      startTime: new Date(Date.now() - 3600000).toISOString(),
      markedAt: new Date().toISOString(),
      invitee: { name: 'Jane Smith', email: 'jane@example.com' }
    },
    outputFields: [
      { key: 'id',             label: 'Booking ID' },
      { key: 'title',          label: 'Title' },
      { key: 'startTime',      label: 'Start Time',  type: 'datetime' },
      { key: 'markedAt',       label: 'Marked At',   type: 'datetime' },
      { key: 'invitee__name',  label: 'Invitee Name' },
      { key: 'invitee__email', label: 'Invitee Email' }
    ]
  }
};
