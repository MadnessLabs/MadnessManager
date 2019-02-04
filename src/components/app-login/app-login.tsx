import { Component, Prop } from '@stencil/core';

@Component({
  tag: 'app-login',
  styleUrl: 'app-login.css'
})
export class AppLogin {

  @Prop() firebase: firebase.app.App;


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
        <ion-button color="dark">
          <ion-icon name="logo-github" slot="start" />
          <ion-label>Login with Github</ion-label>
        </ion-button>
      </ion-content>
    ];
  }
}
