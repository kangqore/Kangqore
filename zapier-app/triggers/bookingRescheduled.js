const subscribeHook = async (z, bundle) => {
  const response = await z.request({
    method: 'POST',
    url: `${bundle.authData.apiBase}/api/scheduling/zapier/subscribe`,
    headers: { 'X-Api-Key': bundle.authData.apiKey },
    body: { hookUrl: bundle.targetUrl, event: 'booking.rescheduled' }
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
    url: `${bundle.authData.apiBase}/api/scheduling/zapier/sample/booking.rescheduled`,
    headers: { 'X-Api-Key': bundle.authData.apiKey }
  });
  return response.data;
};

module.exports = {
  key: 'booking_rescheduled',
  noun: 'Booking',
  display: {
    label: 'Rescheduled Booking',
    description: 'Triggers when a booking is moved to a new date or time.'
  },
  operation: {
    type: 'hook',
    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,
    perform: (z, bundle) => [bundle.cleanedRequest.data],
    performList: getSample,
    sample: {
      id: 'evt_new',
      title: 'Strategy Consultation with Jane Smith',
      startTime: new Date(Date.now() + 172800000).toISOString(),
      endTime:   new Date(Date.now() + 172800000 + 1800000).toISOString(),
      previousEventId: 'evt_old',
      invitee: { name: 'Jane Smith', email: 'jane@example.com' }
    },
    outputFields: [
      { key: 'id',              label: 'New Booking ID' },
      { key: 'title',           label: 'Title' },
      { key: 'startTime',       label: 'New Start Time', type: 'datetime' },
      { key: 'endTime',         label: 'New End Time',   type: 'datetime' },
      { key: 'previousEventId', label: 'Previous Booking ID' },
      { key: 'invitee__name',   label: 'Invitee Name' },
      { key: 'invitee__email',  label: 'Invitee Email' }
    ]
  }
};
