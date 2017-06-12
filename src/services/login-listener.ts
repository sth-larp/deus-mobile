export interface LoginListener {
  onSuccessfulLogin(username: string);
  onLogout();
}