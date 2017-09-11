/**
* @Author: Nicolas Fazio <webmaster-fazio>
* @Date:   11-08-2017
* @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 11-08-2017
*/

import { Component, ViewChild, OnInit, Input, Renderer, ElementRef } from '@angular/core';

export interface IPeak {
  x:number;
  y:number;
  width:number;
  height:number;
  speed:number;
  color:string;
  toggle:boolean;
}
/**
* Generated class for the WaveFormComponent component.
*
* See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
* for more info on Angular Components.
*/
@Component({
  selector: 'ngzio-waveform',
  templateUrl: 'wave-form.html'
})
export class WaveFormComponent implements OnInit{

  public ctx:CanvasRenderingContext2D;
  public animationFrame:number;
  public peaks:IPeak[] = [];
  public maxElement:number;
  public playing:boolean;

  public defaultColor:string = '34,34,34';
  public defaultMaxWidth:number = 2
  public defaultMaxHeight:number = 150
  public defaultSpaceing:number = 1

  @Input() isPlaying:boolean
  @Input() maxWidth:number
  @Input() maxHeight:number
  @Input() spaceing:number
  @Input() peakColor:string
  @Input() backgroundColor:string
  @Input() loadingTXT:string
  @ViewChild('waveContainer') waveContainer:ElementRef
  @ViewChild('waveform') waveform:ElementRef

  constructor(public renderer: Renderer) {

  }

  ngOnInit(){
    this.renderer.setElementStyle(this.waveContainer.nativeElement, 'background-color', `rgba(${this.backgroundColor||this.defaultColor}, 0.12)` )
    this.renderer.setElementStyle(this.waveform.nativeElement, 'border-top', `solid 2px rgba(${this.backgroundColor||this.defaultColor}, 1)` )
    this.renderer.setElementStyle(this.waveform.nativeElement, 'height', `${this.maxHeight||100}px` )

    this.ctx = this.waveform.nativeElement.getContext('2d')

    this.maxElement = (this.waveform.nativeElement.width-(this.spaceing||this.defaultSpaceing))/(this.maxWidth||this.defaultMaxWidth);
    let nbr:number = (this.spaceing||this.defaultSpaceing!= null||0)? this.maxElement+1:this.maxElement;
    // console.log(Math.floor(nbr))
    for (let i = 0; i < Math.floor(nbr); i++) {
      this.peaks.push({
        x: (i === 0)? i * (this.spaceing||this.defaultSpaceing||1)/2: i * (this.maxWidth||this.defaultMaxWidth ),
        y: 0,
        width: (this.maxWidth||this.defaultMaxWidth)-(this.spaceing||this.defaultSpaceing),
        height: (Math.floor(Math.random() * (this.maxHeight||this.defaultMaxHeight))),
        speed: (Math.random()  * 2)+1,
        color: ((this.spaceing||this.defaultSpaceing) === null)?`rgba(${this.peakColor||this.defaultColor},${(i/(this.maxElement)+0.05)})`: `rgb(${this.peakColor||this.defaultColor})`,
        toggle: ((Math.floor(Math.random() * 1)) === 1)? true : false,
      })
    }
  }

  drawWave():void{
    this.animationFrame =requestAnimationFrame(_=>this.drawWave());
    this.ctx.clearRect(0,0,window.screen.width,this.maxHeight||this.defaultMaxHeight);

    this.peaks.map((peak:IPeak, i:number)=> {
      //console.log('deh')
      this.ctx.beginPath();
      this.ctx.fillStyle = peak.color;
      if(!this.isPlaying && peak.height > -5){
        peak.height = peak.height - peak.speed
        this.ctx.fillRect (peak.x, peak.y, peak.width, peak.height);
        this.ctx.closePath();
      }
      else {
        if(peak.toggle){
          peak.height = peak.height - peak.speed
        }
        else {
          peak.height = peak.height + peak.speed
        }
        if(peak.height > this.maxHeight-5){
          peak.toggle = true;
        }
        if(peak.height<30){
          peak.toggle = false
        }
        //console.log(peak.height, peak.toggle)

        (this.animationFrame)?this.ctx.fillRect (peak.x, peak.y, peak.width, peak.height): null;
        this.ctx.closePath();
      }
    })

  }
}
