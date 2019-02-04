import { Component, Prop } from '@stencil/core';
import { AuthService } from '../../services/auth';

@Component({
  tag: 'app-login',
  styleUrl: 'app-login.css' 
})
export class AppLogin {

  @Prop() auth: AuthService;
  @Prop() firebase: firebase.app.App;

  loginWithGithub() {
    this.auth.withSocial('github');
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-buttons slot="start">
            <ion-back-button defaultHref="/" />
          </ion-buttons>
          <ion-title>Login</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content padding>
        <ion-button color="dark" onClick={() => this.loginWithGithub()}>
          <ion-icon name="logo-github" slot="start" />
          <ion-label>Login with Github</ion-label>
        </ion-button>
      </ion-content>
    ];
  }
}
