/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   11-08-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 11-08-2017
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaveFormComponent } from './wave-form/wave-form';
@NgModule({
	declarations: [WaveFormComponent],
	imports: [CommonModule],
	exports: [WaveFormComponent]
})
export class ComponentsModule {}
