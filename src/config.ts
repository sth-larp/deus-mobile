// tslint:disable-next-line:variable-name

const baseAliceUrl = "http://magellan2018.aerem.in:8157/"
const baseEconomyUrl = "http://magellan2018.aerem.in:8157"

export const GlobalConfig = {
  getViewmodelBaseUrl: baseAliceUrl + 'viewmodel',
  sendEventsBaseUrl: baseAliceUrl + 'events',

  sendEventsEveryMs: 60 * 1000,
  recalculateUpdateStatusEveryMs: 100,
  viewModelLagTimeMsYellowStatus: 3 * 60 * 1000,
  viewModelLagTimeMsRedStatus: 15 * 60 * 1000,

  numHpQuickActionIcons: 12,

  remoteLoggingDbUrl: 'no-logging-in-prod',

  timeServerUrl: baseAliceUrl + 'time',
  fetchTimeFromServerEveryMs: 60000,

  passportQrLifespan: 60000, // 1 min
  transactionQrLifespan: 300000, // 5 min

  economyGetBalanceBaseUrl: baseEconomyUrl + '/economy/',
  economyTransferMoneyUrl: baseEconomyUrl + '/economy/transfer',
  economyTransactionsUrl: baseEconomyUrl + '/economy/',

  useProductionAPNSChannel: false,
};

// Apparently, SCSS variables cannot be used in typescript, so copying here.
// Must stay in sync with variables.scss!
// tslint:disable-next-line:variable-name
export const Colors = {
  standard: '#F0F2F4',
  primary:  '#4990E2',
  green:    '#68BB0D',
  yellow:   '#B2901D',
  red:      '#FF373F',

  progressBarDefault: '#6987A4',
};
