/**
* @Author: Nicolas Fazio <webmaster-fazio>
* @Date:   10-08-2017
* @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 17-09-2017
*/

import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, Alert } from 'ionic-angular';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { WaveFormComponent} from "../../components/wave-form/wave-form";
//import { MusicControls } from '@ionic-native/music-controls';

import { HtmlAudioProvider } from '../../providers/html-audio/html-audio';
import { NativeAudioProvider } from '../../providers/native-audio/native-audio';
import { MediaObject } from '@ionic-native/media';

import { IAppState, IError } from "../../app/app.state";

/**
* Generated class for the NativeMediaPage page.
*
* See http://ionicframework.com/docs/components/#navigation for more info
* on Ionic pages and navigation.
*/

@IonicPage({
  name: 'NativeMediaPage',
  segment: 'native-media'
})
@Component({
  selector: 'page-native-media',
  templateUrl: 'native-media.html',
})
export class NativeMediaPage {

  public url:string;
  public stream:any;
  public audioState:Observable<IAppState>;
  public alert:Alert|null;

  @ViewChild('ngzioWave') ngzioWave:WaveFormComponent

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    private _htmlAudio:HtmlAudioProvider,
    private _nativeAudio:NativeAudioProvider,
    private _alertCtrl:AlertController
    //private musicControls: MusicControls
  ) {

    this.url = 'https://www.radioking.com/play/real-vybz'//'http://195.154.156.183/radio/67507/stream/105202';
    this.platform.ready().then(_=> {
      if(this.platform.is('core') || this.platform.is('mobileweb')){
        this.useAudioHTML()
      }
      else {
        /**
         * Bug Report:
         * Cordova Native Plugin currently not working propely
         * No state handling to manage audioState
         * See issue: https://github.com/ionic-team/ionic-native/issues/1886
         *
         * Fix by using Audio HTML5 API to load & play audio in IOS and Android
         */
        //this.useAudioNativePlugin()
        this.useAudioHTML()
      }
      this.audioState = this.audioState.map((state:IAppState)=> {
        if(state.error[0]) this.displayError(state.error[0]) //console.log('Error alert->', state.error[0])
        return state
      })
    })
  }

  controle(playing):void{
    if(!playing){
      if(!this.ngzioWave.animationFrame){
        this.ngzioWave.drawWave()
      }
      this.stream.play()
    }
    else {
      this.stream.pause()
    }
  }

  useAudioHTML():void{
    this._htmlAudio.init(this.url)
    this.audioState = this._htmlAudio.state//.subscribe(res=> console.log(res))
    this.stream = this._htmlAudio
  }

  useAudioNativePlugin():void{
    this._nativeAudio.init(this.url)
    this.audioState = this._nativeAudio.state//.subscribe(res=> console.log(res))
    this.stream = this._nativeAudio
    //this.initNativeMusicControl()
  }

  displayError(err:IError):IError{
    if(this.alert) return err;
    this.alert = this._alertCtrl.create({
      title: 'Error:',
      subTitle: `${err.message}<hr/>Check your internet connection and try to restart application if audio is not working.`,
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel',
          handler: () => {
            this.alert = null
          }
        }
      ]
    });
    this.alert.present();
    return err
  }

  // initNativeMusicControl(){
  //   this.musicControls.create({
  //     track       : 'Live Streaming',        // optional, default : ''
  //     artist      : 'Real Vybz Radio',                       // optional, default : ''
  //     cover       : './assets/imgs/logo-real-vybz-radio.jpg',      // optional, default : nothing
  //     // cover can be a local path (use fullpath 'file:///storage/emulated/...', or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
  //     //           or a remote url ('http://...', 'https://...', 'ftp://...')
  //     isPlaying   : true,                         // optional, default : true
  //     dismissable : true,                         // optional, default : false
  //
  //     // hide previous/next/close buttons:
  //     hasPrev   : false,      // show previous button, optional, default: true
  //     hasNext   : false,      // show next button, optional, default: true
  //     hasClose  : true,       // show close button, optional, default: false
  //
  //     // iOS only, optional
  //     album       : 'Absolution',     // optional, default: ''
  //     duration : 60, // optional, default: 0
  //     elapsed : 10, // optional, default: 0
  //
  //     // Android only, optional
  //     // text displayed in the status bar when the notification (and the ticker) are updated
  //     ticker    : 'Now playing "Real Vybz Radio" live streaming'
  //   });
  //
  //   this.musicControls.subscribe().subscribe(action => {
  //     function events(action) {
  //       const message = JSON.parse(action).message;
  //       switch(message) {
  //         case 'music-controls-pause':
  //             // Do something
  //             console.log('pause')
  //             break;
  //         case 'music-controls-play':
  //             console.log('play')
  //             // Do something
  //             break;
  //         case 'music-controls-destroy':
  //             // Do something
  //             console.log('ddestroy')
  //             break;
  //         // External controls (iOS only)
  //         case 'music-controls-toggle-play-pause' :
  //             // Do something
  //             console.log('toggle play/pause')
  //             break;
  //         default:
  //       }
  //     }
  //   })
  //   this.musicControls.listen(); // activates the observable above
  //   this.musicControls.updateIsPlaying(true);
  // }
}
