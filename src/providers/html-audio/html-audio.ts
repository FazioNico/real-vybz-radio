/**
* @Author: Nicolas Fazio <webmaster-fazio>
* @Date:   13-09-2017
* @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 17-09-2017
*/

import { Injectable } from '@angular/core';
import { Observable, AsyncSubject, ReplaySubject, Subject} from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import { IAppState, combineStates } from "../../app/app.state";

/*
Generated class for the HtmlAudioProvider provider.

See https://angular.io/guide/dependency-injection for more info on providers
and Angular DI.
*/

export interface IHtmlEvents extends Object{
  ready: Observable<boolean>,
  canplay: Observable<boolean>,
  play: Observable<boolean>,
  pause: Observable<boolean>,
  ended: Observable<boolean>,
  error: Observable<any>,
  timeupdate: Observable<any>,
  progress: Observable<any>,
  seeking: Observable<any>,
  seeked: Observable<any>,
  loadedMetaData: Observable<any>,
  waiting: Observable<any>,
}

export const initialEventState:IHtmlEvents = {
  ready: Observable.of(false),
  canplay: Observable.of(false),
  play: Observable.of(false),
  pause: Observable.of(null),
  ended: Observable.of(null),
  error: Observable.of([]),
  timeupdate: Observable.of(),
  progress: Observable.of(),
  seeking:Observable.of(),
  seeked: Observable.of(),
  loadedMetaData: Observable.of(),
  waiting: Observable.of(false),
}

@Injectable()
export class HtmlAudioProvider {

  private _streamFile:HTMLAudioElement;
  private _state:IAppState;
  public state: Observable<IAppState>;
  // public events:IHtmlEvents;
  // public eventNames:string[];

  constructor() {
    //this.events = initialEventState;
    // this.eventNames = [
    //   'ready','canplay', 'play', 'pause', 'ended', 'error',
    //   'timeupdate', 'progress', 'seeking', 'seeked', 'loadedMetaData', 'waiting'
    // ];

    this._state = {
      src: new BehaviorSubject(''),
      playing: new BehaviorSubject(false),
      loading: new BehaviorSubject(false),
      ready: new BehaviorSubject(false),
      readyToLoad: new BehaviorSubject(false),
      load: new BehaviorSubject(false),
      play: new BehaviorSubject(false),
      pause: new BehaviorSubject(false),
      error: new BehaviorSubject([]),
    }
    this.state = combineStates(this._state)
  }
  init(url) {
      this._streamFile = new Audio(url)
      console.log('_streamFile->', this._streamFile)
      //this._streamFile.play();

      // Handling Audio Events:
      // 1st event
      this._streamFile.addEventListener('loadstart', () => {
        this._state.ready.next(true)
        console.log('1: loadstart')
      });
      // 2th event (already handling on playing audio)
      this._streamFile.addEventListener('progress', () => {
        this._state.ready.next(true)
        console.log('2: progress...')
      });
      // 3th event
      this._streamFile.addEventListener('waiting', () => {
        this._state.ready.next(false)
        this._state.playing.next(false)
        console.log('3: waiting')
      });
      // 4th event
      this._streamFile.addEventListener('canplay', () => {
        this._state.ready.next(true)
        console.log('4: canplay')
      });
      // 5th event
      this._streamFile.addEventListener('playing', () => {
        this._state.play.next(true)
        this._state.playing.next(true)
        this._state.pause.next(false)
        console.log('5: playing')
      });
      // pause event
      this._streamFile.addEventListener('pause', () => {
        this._state.play.next(false)
        this._state.playing.next(false)
        this._state.pause.next(true)
        console.log('pause')
      });
      // error event
      this._streamFile.addEventListener('error', () => {
        this.onErrorHTMLAPI()
      });

  }

  // Handle Error message
  private onError(err){
    console.log('onError', err)
    this._state.ready.next(false)
    this._state.play.next(false)
    this._state.playing.next(false)
    this._state.loading.next(false)
    this._state.pause.next(true)
    this._state.error.next([
      {
        type:err.type,
        message: (err.path[0].error)? err.path[0].error.message || 'Network connection loast... waiting... audio load again...' : 'Unknow error with HTML Audio API'}
    ])
    return err
  }

  private onErrorHTMLAPI(){
    console.log('onError', this._streamFile.error)
    let err:number = this._streamFile.error.code
    this._state.ready.next(false)
    this._state.play.next(false)
    this._state.playing.next(false)
    this._state.pause.next(true)
    this._state.error.next([
      {
        type:'error',
        message: this.extractError(err)}
    ])
  }

  private extractError(err){
    switch(err) {
      case 1:
        return 'Aborded action'
      case 2:
        return 'Network connection loast... waiting... audio load again...'
      case 3:
          return 'Encoding source is not supported'
      case 4:
        return 'Media source format is not supported'
      default:
       return  'Unknow error with HTML Audio API'
    }

  }
  // controle methode
  play(){
    this._streamFile.play()
  }
  pause(){
    this._streamFile.pause()
  }
  stop(){
    this._streamFile.pause()
  }

  // state formater
  private combineStates() {
    let keys = []
    let values = []
    for (let key in this._state) {
      keys = [...keys, key]
      values = [...values, this._state[key]]
    }
    //console.log(values)
    return Observable.combineLatest(
      this._state.src,
      this._state.playing,
      this._state.loading,
      this._state.ready,
      this._state.readyToLoad,
      this._state.load,
      this._state.play,
      this._state.pause,
      this._state.error,
      (src, playing,loading,ready,readyToLoad,load,play,pause, error) => (
      {
        src,
        playing,
        loading,
        ready,
        readyToLoad,
        load,
        play,
        pause,
        error
      })
    )
    // return Observable.combineLatest(
    //     // this._state.ready,
    //     // this._state.play,
    //     ...values.map(e=>e)
    // )
  }


    //// Not working with Native
    // init(url){
    //   this._streamFile = new Audio(url);
    //   this._state.src.next(url)
    //   //this._state.load.next(true)
    //   this.eventNames.forEach((event:string) => {
    //     this.events[event] = Observable.fromEvent(this._streamFile, event);
    //   });
    //
    //   // listen audio events:
    //   this.events.canplay.subscribe(
    //     (res) => {
    //       //console.log('canplay', res)
    //       this._state.ready.next(true)
    //       this._state.loading.next(false)
    //       //this._state.load.next(false)
    //     },
    //     err => this.onError(err)
    //   );
    //   this.events.play.subscribe(
    //     (res) => {
    //       //console.log('play', res)
    //       this._state.play.next(true)
    //       this._state.playing.next(true)
    //       this._state.loading.next(true)
    //       this._state.pause.next(false)
    //     },
    //     err => this.onError(err)
    //   );
    //   this.events.pause.subscribe(
    //     (res) => {
    //       //console.log('pause', res)
    //       this._state.play.next(false)
    //       this._state.playing.next(false)
    //       this._state.pause.next(true)
    //     },
    //     err => this.onError(err)
    //   );
    //   this.events.waiting.subscribe(
    //     (res) => {
    //       //console.log('waiting', res)
    //       this.stop()
    //       this._state.ready.next(false)
    //       this._state.play.next(false)
    //       this._state.playing.next(false)
    //       this._state.loading.next(false)
    //       this._state.pause.next(true)
    //       this._state.error.next([
    //         {
    //           type:'Network',
    //           message: 'Network connection loast... waiting... audio load again...'}
    //       ])
    //       //this._state.load.next(false)
    //     },
    //     err => this.onError(err)
    //   );
    //   this.events.error.subscribe(
    //     (err) => {
    //       console.log('error', err)
    //       this.onError(err)
    //     },
    //     err => alert(err)
    //   );
    //
    // }
}
