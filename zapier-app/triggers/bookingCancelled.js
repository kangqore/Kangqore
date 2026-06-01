const subscribeHook = async (z, bundle) => {
  const response = await z.request({
    method: 'POST',
    url: `${bundle.authData.apiBase}/api/scheduling/zapier/subscribe`,
    headers: { 'X-Api-Key': bundle.authData.apiKey },
    body: { hookUrl: bundle.targetUrl, event: 'booking.cancelled' }
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
    url: `${bundle.authData.apiBase}/api/scheduling/zapier/sample/booking.cancelled`,
    headers: { 'X-Api-Key': bundle.authData.apiKey }
  });
  return response.data;
};

module.exports = {
  key: 'booking_cancelled',
  noun: 'Booking',
  display: {
    label: 'Cancelled Booking',
    description: 'Triggers when a booking is cancelled by the host or the invitee.'
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
      cancelledAt: new Date().toISOString(),
      cancelReason: 'Schedule conflict',
      cancelledBy: 'invitee',
      invitee: { name: 'Jane Smith', email: 'jane@example.com' }
    },
    outputFields: [
      { key: 'id',             label: 'Booking ID' },
      { key: 'title',          label: 'Title' },
      { key: 'cancelledAt',    label: 'Cancelled At',   type: 'datetime' },
      { key: 'cancelReason',   label: 'Cancel Reason' },
      { key: 'cancelledBy',    label: 'Cancelled By' },
      { key: 'invitee__name',  label: 'Invitee Name' },
      { key: 'invitee__email', label: 'Invitee Email' }
    ]
  }
};
