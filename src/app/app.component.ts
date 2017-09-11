/**
* @Author: Nicolas Fazio <webmaster-fazio>
* @Date:   30-05-2017
* @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 11-09-2017
*/

import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { BackgroundMode } from '@ionic-native/background-mode';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { APP_CONFIG } from "./app.config";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = 'NativeMediaPage';

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private backgroundMode: BackgroundMode,
    private ga: GoogleAnalytics
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      // init added Native Plugins
      this.backgroundMode.enable();
      this.initGa()
    });
  }

  initGa():void{
    this.ga.startTrackerWithId(APP_CONFIG.gaID)
    .then(() => {
      console.log('Google analytics is ready now');
      this.ga.trackView('Real Vybz Radio - HomePage');
    })
    .catch(e => console.log('Error starting GoogleAnalytics', e));
  }

}
