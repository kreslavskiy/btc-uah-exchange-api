export const SCHEDULE_CONSTANTS = Object.freeze({
  RATE_CHANGE_THRESHOLD: 0.05,
  LOCAL_TIMEZONE: 'Europe/Kyiv',
  CRON_EXPRESSION: {
    EVERY_DAY_AT_9_30_AM: '30 9 * * *',
  },
  MESSAGE: {
    EVERY_DAY_9_30_AM: 'Good morning!',
    SIGNIFICANT_RATE_CHANGE: 'The rate has changed by more than 5%',
  },
});
