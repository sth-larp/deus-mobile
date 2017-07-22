// tslint:disable-next-line:variable-name
export const GlobalConfig = {
  getViewmodelBaseUrl: 'http://dev.alice.digital:8157/viewmodel',
  sendEventsBaseUrl: 'http://dev.alice.digital:8157/events',

  // TODO: Use seconds instead of milliseconds
  recalculateVrTimerEveryMs: 500,
  vrTimerYellowThresholdMs: 600000,
  recalculateUpdateStatusEveryMs: 1000,
  viewModelLagTimeMsYellowStatus: 30000,
  viewModelLagTimeMsRedStatus: 30000,

  numHpQuickActionIcons: 12,

  remoteLoggingDbUrl: 'no-logging-in-prod',

  timeServerUrl: 'http://dev.alice.digital:8157/time',
  fetchTimeFromServerEveryMs: 60000,

  passportQrLifespan: 60000, // 1 min
  transactionQrLifespan: 300000, // 5 min

  economyGetBalanceBaseUrl: 'https://alice.digital/econ/api/accounts/profile?login=',
  economyTransferMoneyUrl: 'https://alice.digital/econ/api/transfer',
  economyTransactionsUrl: 'https://alice.digital/econ/api/transactions',

  useProductionAPNSChannel: false,
};

// Apparently, SCSS variables cannot be used in typescript, so copying here.
// Must stay in sync with variables.scss!
// tslint:disable-next-line:variable-name
export const Colors = {
  standard: '#F3F5F8',
  primary:  '#4990E2',
  green:    '#68BB0D',
  yellow:   '#B2901D',
  red:      '#FF373F',

  progressBarDefault: '#6987A4',
};
