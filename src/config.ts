// tslint:disable-next-line:variable-name

const baseAliceUrl = 'https://api.magellan2018.aerem.in/';
const baseEconomyUrl = baseAliceUrl;

export const GlobalConfig = {
  getViewmodelBaseUrl: baseAliceUrl + 'viewmodel',
  sendEventsBaseUrl: baseAliceUrl + 'events',

  sendEventsEveryMs: 60 * 1000,
  recalculateVrTimerEveryMs: 500,
  vrTimerYellowThresholdMs: 10 * 60 * 1000,
  recalculateUpdateStatusEveryMs: 100,
  viewModelLagTimeMsYellowStatus: 3 * 60 * 1000,
  viewModelLagTimeMsRedStatus: 15 * 60 * 1000,

  numHpQuickActionIcons: 12,

  remoteLoggingDbUrl: 'no-logging-in-prod',

  timeServerUrl: baseAliceUrl + 'time',
  fetchTimeFromServerEveryMs: 60000,

  passportQrLifespan: 60000, // 1 min
  transactionQrLifespan: 86400000, // 5 days

  economyGetDataUrl: baseEconomyUrl + '/economy/',
  economyTransferMoneyUrl: baseEconomyUrl + '/economy/transfer',

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
