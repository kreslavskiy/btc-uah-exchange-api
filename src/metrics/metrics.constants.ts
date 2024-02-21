export const METRICS_CONSTANTS = Object.freeze({
  DEFAULT_LABELS: {
    APP: 'btc-uah-exchange-api',
  },
  GAUGES: {
    RATE: {
      NAME: 'rate_gauge',
      HELP: 'Current exchange rate',
    },
  },
  COUNTERS: {
    SENT_EMAILS: {
      NAME: 'sent_emails_counter',
      HELP: 'Total number of sent emails',
    },
    SUBSCRIPTION: {
      NAME: 'subscribtion_counter',
      HELP: 'Total number of subscribtions to the app',
    },
    UNSUBSCRIPTION: {
      NAME: 'unsubscription_counter',
      HELP: 'Total number of unsubscriptions from the app',
    },
    SENT_EMAILS_ERROR: {
      NAME: 'sent_emails_error_counter',
      HELP: 'Total number of errors while sending emails',
    },
  },
});
