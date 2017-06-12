export interface LoginListener {
  onSuccessfulLogin(username: string, sid: string);
  onLogout();
}