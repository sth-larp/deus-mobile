export const GlobalConfig = {
  authentificationUrl: 'http://dev.alice.digital/api-mock/master/auth',
  sendEventsBaseUrl: 'http://dev.alice.digital:8157/events',

  recalculateUpdateStatusEveryMs: 1000,
  viewModelLagTimeMsYellowStatus: 30000,
  viewModelLagTimeMsRedStatus: 30000,

  remoteLoggingDbUrl: 'http://dev.alice.digital:5984/logging-dev',

  timeServerUrl: 'http://dev.alice.digital:8157/time',
  fetchTimeFromServerEveryMs: 60000
}