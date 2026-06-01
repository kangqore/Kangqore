const subscribeHook = async (z, bundle) => {
  const response = await z.request({
    method: 'POST',
    url: `${bundle.authData.apiBase}/api/scheduling/zapier/subscribe`,
    headers: { 'X-Api-Key': bundle.authData.apiKey },
    body: { hookUrl: bundle.targetUrl, event: 'booking.created' }
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

const getBooking = async (z, bundle) => {
  // Called during Zap setup to load sample data for field mapping
  const response = await z.request({
    url: `${bundle.authData.apiBase}/api/scheduling/zapier/sample/booking.created`,
    headers: { 'X-Api-Key': bundle.authData.apiKey }
  });
  return response.data;
};

module.exports = {
  key: 'booking_created',
  noun: 'Booking',
  display: {
    label: 'New Booking',
    description: 'Triggers when a new consultation or meeting is booked.',
    important: true
  },
  operation: {
    type: 'hook',
    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,
    perform: (z, bundle) => [bundle.cleanedRequest.data],
    performList: getBooking,
    sample: {
      id: 'evt_example',
      title: 'Strategy Consultation with Jane Smith',
      startTime: new Date(Date.now() + 86400000).toISOString(),
      endTime:   new Date(Date.now() + 86400000 + 1800000).toISOString(),
      timezone: 'America/New_York',
      joinUrl: 'https://meet.jit.si/kangqore-example',
      invitee: { name: 'Jane Smith', email: 'jane@example.com', phone: '+1-555-0100', company: 'Acme Corp' }
    },
    outputFields: [
      { key: 'id',               label: 'Booking ID' },
      { key: 'title',            label: 'Title' },
      { key: 'startTime',        label: 'Start Time',    type: 'datetime' },
      { key: 'endTime',          label: 'End Time',      type: 'datetime' },
      { key: 'timezone',         label: 'Timezone' },
      { key: 'joinUrl',          label: 'Join URL' },
      { key: 'invitee__name',    label: 'Invitee Name' },
      { key: 'invitee__email',   label: 'Invitee Email' },
      { key: 'invitee__phone',   label: 'Invitee Phone' },
      { key: 'invitee__company', label: 'Invitee Company' }
    ]
  }
};
