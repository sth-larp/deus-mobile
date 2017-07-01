export interface ILoginListener {
  onSuccessfulLogin(username: string);
  onLogout();
}
