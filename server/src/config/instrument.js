import Sentry from '@sentry/node';

Sentry.init({
  dsn: 'https://fc76b282fe1b164a67978a4d7b7b1513@o4510340646567936.ingest.us.sentry.io/4510340649058304',
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});

