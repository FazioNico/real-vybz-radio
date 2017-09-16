/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   13-09-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 16-09-2017
 */

import { Injectable } from '@angular/core';
import { Observable, AsyncSubject, ReplaySubject, Subject} from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import { IAppState, combineStates } from "../../app/app.state";
import { Media, MediaObject, MediaError, MediaStatusUpdateCallback } from '@ionic-native/media';

// https://github.com/apache/cordova-plugin-media#constants
export const mediaSuccessType = [
  {type: 'MEDIA_NONE'}, // 0
  {type: 'MEDIA_STARTING'}, // 1
  {type: 'MEDIA_RUNNING'}, // 2
  {type:'MEDIA_PAUSED'} , // 3
  {type:'MEDIA_STOPPED'} // 4
]
// https://github.com/apache/cordova-plugin-media#constants-1
export const mediaErrorType = [
  {type: 'MEDIA_ERR_ABORTED'},
  {type: 'MEDIA_ERR_NETWORK'},
  {type: 'MEDIA_ERR_DECODE'},
  {type:'MEDIA_ERR_NONE_SUPPORTED'}
]

export interface INativeEvents extends Object{
  state: Observable<number>,
  error: Observable<any>,
}
export const initialEventState:INativeEvents = {
  state: Observable.of(0),
  error: Observable.of([]),
}

/*
Generated class for the NativeAudioProvider provider.

See https://angular.io/guide/dependency-injection for more info on providers
and Angular DI.
*/
@Injectable()
export class NativeAudioProvider {

  private _streamFile:MediaObject;
  private _state:IAppState;
  public state: Observable<IAppState>;

  constructor(
  private media: Media,) {
    this._state = {
      src: new BehaviorSubject(''),
      playing: new BehaviorSubject(false),
      loading: new BehaviorSubject(false),
      ready: new BehaviorSubject(true),
      readyToLoad: new BehaviorSubject(false),
      load: new BehaviorSubject(false),
      play: new BehaviorSubject(false),
      pause: new BehaviorSubject(false),
      error: new BehaviorSubject([]),
    }
    this.state = combineStates(this._state)
  }

  init(url){
    this._streamFile = this.media.create(url);
    console.log('init->', this._streamFile, url)
    // listen plugin events:
    this._streamFile.onStatusUpdate.subscribe(status => {
      console.log('onStatusUpdate-> ', status)
      this.checkOnSuccess(status)
    }); // fires when file status changes
    this._streamFile.onSuccess.subscribe((result) => {
      //this.checkOnSuccess(result)
      console.log('onSuccess-> Action is successful ', result)
    });
    this._streamFile.onError.subscribe(error => {
      console.log('onError-> Error! ', error)
    });

  }

  private checkOnSuccess(status){
    console.log('checkOnSuccess', status)
    switch(status){
      case 1:

      break;

      case 2:
        this._state.play.next(true)
        this._state.playing.next(true)
        this._state.pause.next(false)
      break;
      case 3:
        this._state.play.next(false)
        this._state.playing.next(false)
        this._state.pause.next(true)
      break;
      case 4:
        this._state.play.next(false)
        this._state.playing.next(false)
        this._state.pause.next(true)
      break;
      default:

    }
  }
  // controle methode
  play(){
    this._streamFile.play()
    this._streamFile.getCurrentPosition()
                    .then(res=> {
                      console.log('getCurrentPosition->', res)
                      return res
                    })
                    .catch(err => console.log('Error getCurrentPosition->', err))
  }
  pause(){
    this._streamFile.pause()
  }
  stop(){
    this._streamFile.pause()
  }

  // // state formater
  // private combineStates() {
  //   let keys = []
  //   let values = []
  //   for (let key in this._state) {
  //     keys = [...keys, key]
  //     values = [...values, this._state[key]]
  //   }
  //   //console.log(values)
  //   return Observable.combineLatest(
  //     this._state.src,
  //     this._state.playing,
  //     this._state.loading,
  //     this._state.ready,
  //     this._state.readyToLoad,
  //     this._state.load,
  //     this._state.play,
  //     this._state.pause,
  //     this._state.error,
  //     (src,playing,loading,ready,readyToLoad,load,play,pause, error) => (
  //       {
  //         src,
  //         playing,
  //         loading,
  //         ready,
  //         readyToLoad,
  //         load,
  //         play,
  //         pause,
  //         error
  //       })
  //     )
  //     // return Observable.combineLatest(
  //     //     // this._state.ready,
  //     //     // this._state.play,
  //     //     ...values.map(e=>e)
  //     // )
  // }
}
