export interface ILoginListener {
  onSuccessfulLogin(userId: string);
  onLogout();
}
