import { Component } from '@stencil/core';
import firebase from 'firebase/app';

import { ConfigService } from '../../services/config';
import { DatabaseService } from '../../services/database';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css'
})
export class AppRoot {

  globalProps: {
    config: any;
    database: DatabaseService,
    firebase: firebase.app.App
  };

  componentDidLoad() {
    const config = (new ConfigService).get();
    const app = firebase.initializeApp(config.firebase);
    this.globalProps = {
      config,
      database: new DatabaseService(app),
      firebase: app
    };

    console.log(this.globalProps);
  }

  render() {
    return (
      <ion-app>
        <ion-router useHash={false}>
          <ion-route url="/" component="app-home" componentProps={this.globalProps} />
          <ion-route url="/profile/:name" component="app-profile"  componentProps={this.globalProps} />
        </ion-router>
        <ion-nav />
      </ion-app>
    );
  }
}
