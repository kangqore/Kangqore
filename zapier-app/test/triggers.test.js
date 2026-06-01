const zapier = require('zapier-platform-core');
const App = require('../index');

const appTester = zapier.createAppTester(App);
zapier.tools.env.inject(); // loads .env

describe('Authentication', () => {
  test('valid API key passes', async () => {
    const bundle = {
      authData: {
        apiKey: process.env.API_KEY,
        apiBase: process.env.API_BASE
      }
    };
    const result = await appTester(App.authentication.test, bundle);
    expect(result).toBeTruthy();
  });
});

describe('Trigger: booking_created', () => {
  test('returns sample data', async () => {
    const bundle = {
      authData: {
        apiKey: process.env.API_KEY,
        apiBase: process.env.API_BASE
      }
    };
    const results = await appTester(App.triggers.booking_created.operation.performList, bundle);
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty('id');
    expect(results[0]).toHaveProperty('invitee');
  });
});

describe('Trigger: booking_cancelled', () => {
  test('returns sample data', async () => {
    const bundle = {
      authData: {
        apiKey: process.env.API_KEY,
        apiBase: process.env.API_BASE
      }
    };
    const results = await appTester(App.triggers.booking_cancelled.operation.performList, bundle);
    expect(Array.isArray(results)).toBe(true);
    expect(results[0]).toHaveProperty('cancelledAt');
  });
});

describe('Trigger: booking_rescheduled', () => {
  test('returns sample data', async () => {
    const bundle = {
      authData: {
        apiKey: process.env.API_KEY,
        apiBase: process.env.API_BASE
      }
    };
    const results = await appTester(App.triggers.booking_rescheduled.operation.performList, bundle);
    expect(Array.isArray(results)).toBe(true);
    expect(results[0]).toHaveProperty('startTime');
  });
});

describe('Trigger: booking_no_show', () => {
  test('returns sample data', async () => {
    const bundle = {
      authData: {
        apiKey: process.env.API_KEY,
        apiBase: process.env.API_BASE
      }
    };
    const results = await appTester(App.triggers.booking_no_show.operation.performList, bundle);
    expect(Array.isArray(results)).toBe(true);
    expect(results[0]).toHaveProperty('markedAt');
  });
});
