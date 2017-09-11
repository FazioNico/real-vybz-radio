/**
* @Author: Nicolas Fazio <webmaster-fazio>
* @Date:   10-08-2017
* @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 11-09-2017
*/

import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Media } from '@ionic-native/media';
import { WaveFormComponent} from "../../components/wave-form/wave-form";
//import { MusicControls } from '@ionic-native/music-controls';

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
  public isPlaying:boolean;
  @ViewChild('ngzioWave') ngzioWave:WaveFormComponent

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    private media: Media,
    //private musicControls: MusicControls
  ) {

    this.url = 'http://195.154.156.183/radio/67507/stream/105202';
    this.isPlaying = false;
    this.platform.ready().then(_=> {
      if(this.platform.is('core') || this.platform.is('mobileweb')){
        this.stream = new Audio(this.url);
        // listen plugin events:
        new Promise((resolve,reject) => {
          this.stream.addEventListener('playing', () => {
            resolve(true);
          });
          this.stream.addEventListener('error', () => {
            reject(false);
          });
        })
        .then(res => {console.log('playing->', res)})
        .catch(err => {console.log('error->', err)})
      }
      else {
        this.stream = this.media.create(this.url);
        // listen plugin events:
        this.stream.onStatusUpdate.subscribe(status => console.log('onStatusUpdate-> ', status)); // fires when file status changes
        this.stream.onSuccess.subscribe((result) => console.log('onSuccess-> Action is successful ', result));
        this.stream.onError.subscribe(error => console.log('onError-> Error! ', error));
        //this.initNativeMusicControl()
      }
    })
  }

  controle():void{
    this.isPlaying = !this.isPlaying
    if(this.isPlaying){
      if(!this.ngzioWave.animationFrame){
        this.ngzioWave.drawWave()
      }
      this.stream.play()
    }
    else {
      this.stream.pause()
    }
  }
  //
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
