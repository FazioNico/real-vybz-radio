/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   10-08-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 14-09-2017
 */

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NativeMediaPage } from './native-media';
//import { Media } from '@ionic-native/media';
//import { MusicControls } from '@ionic-native/music-controls';
import { ComponentsModule} from "../../components/components.module";

import { HtmlAudioProvider } from '../../providers/html-audio/html-audio';
import { Media } from '@ionic-native/media';
import { NativeAudioProvider } from '../../providers/native-audio/native-audio';

@NgModule({
  declarations: [
    NativeMediaPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(NativeMediaPage),
  ],
  providers: [
    HtmlAudioProvider,
    Media,
    NativeAudioProvider
    //MusicControls
  ]
})
export class NativeMediaPageModule {}
