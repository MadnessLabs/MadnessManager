import { Component } from '@stencil/core';
import firebase from 'firebase/app';

import { ConfigService } from '../../services/config';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css'
})
export class AppRoot {

  globalProps: {
    config: any;
    firebase: firebase.app.App
  };

  componentDidLoad() {
    const config = (new ConfigService).get();
    this.globalProps = {
      config,
      firebase: firebase.initializeApp(config.firebase)
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
