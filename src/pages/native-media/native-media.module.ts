/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   10-08-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 11-08-2017
 */

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NativeMediaPage } from './native-media';
import { Media } from '@ionic-native/media';
//import { MusicControls } from '@ionic-native/music-controls';
import { ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    NativeMediaPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(NativeMediaPage),
  ],
  providers: [
    Media,
    //MusicControls
  ]
})
export class NativeMediaPageModule {}
