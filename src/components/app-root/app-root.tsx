import { Component } from '@stencil/core';

// import * as firebase from 'firebase';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css'
})
export class AppRoot {

  globalProps: {
    firebase: any
  };

  componentDidLoad() {
    this.globalProps = {
      firebase: null
    };
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
