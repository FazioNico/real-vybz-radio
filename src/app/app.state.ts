/**
* @Author: Nicolas Fazio <webmaster-fazio>
* @Date:   13-09-2017
* @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 14-09-2017
*/

import { Observable, AsyncSubject, ReplaySubject, Subject} from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface IAppState extends Object {
  src: BehaviorSubject<string>;
  playing: BehaviorSubject<boolean>;
  loading: BehaviorSubject<boolean>;
  ready: BehaviorSubject<boolean>;
  readyToLoad: BehaviorSubject<boolean>;
  load: BehaviorSubject<boolean>;
  play: BehaviorSubject<boolean>;
  pause: BehaviorSubject<boolean>;
  error: BehaviorSubject<Array<IError>>;
}

export interface IError extends Object {
  type:string;
  message:string;
}

export function combineStates(_state:IAppState):Observable<IAppState>{
  console.log(_state)
  // let keys = []
  // let values = []
  // for (let key in _state) {
  //   keys = [...keys, key]
  //   values = [...values, _state[key]]
  // }
  //console.log(values)
  return Observable.combineLatest(
    _state.src,
    _state.playing,
    _state.loading,
    _state.ready,
    _state.readyToLoad,
    _state.load,
    _state.play,
    _state.pause,
    _state.error,
    (src, playing,loading,ready,readyToLoad,load,play,pause, error):IAppState => (
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
