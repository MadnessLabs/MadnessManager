import { Component, State } from '@stencil/core';
import firebase from 'firebase/app';

import { AuthService } from '../../services/auth';
import { ConfigService } from '../../services/config';
import { DatabaseService } from '../../services/database';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css'
})
export class AppRoot {

  @State() globalProps: {
    auth: AuthService;
    config: any;
    database: DatabaseService;
    firebase: firebase.app.App;
    router: HTMLIonRouterElement;
    session?: any;
  };

  componentDidLoad() {
    const config = (new ConfigService).get();
    const app = firebase.initializeApp(config.firebase);
    this.globalProps = {
      auth: new AuthService(app, config),
      config,
      database: new DatabaseService(app),
      firebase: app,
      router: document.querySelector("ion-router")
    };
    this.globalProps.auth.onAuthChanged(async session => {
      if (session) {
        this.globalProps = { ...this.globalProps, session };
        if (["/", "/login"].indexOf(window.location.pathname) > -1) {
          this.globalProps.router.push("/profile/ionic");
        }
      }
    });
  }

  render() {
    return (
      <ion-app>
        <ion-router useHash={false}>
          <ion-route url="/" component="app-home" componentProps={this.globalProps} />
          <ion-route url="/login" component="app-login"  componentProps={this.globalProps} />
          <ion-route url="/profile/:name" component="app-profile"  componentProps={this.globalProps} />
        </ion-router>
        <ion-nav />
      </ion-app>
    );
  }
}
