import { Component, OnInit, Input } from '@angular/core';
import {Global} from '../global';
declare var kendo:any;

@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.css']
})
export class HistoriaClinicaComponent implements OnInit {

  constructor(public global:Global) { }
    @Input('name') name:string;
    @Input('obj2') obj2:any = {};
    @Input('print') print:boolean;
    obj:any = {
      Patient:{Name1:'',Name2:'',LastName1:'',LastName2:'',Years:'',Address:'',IdentityCard:''},
      RasonToConsultation:''
      ,AllergiesAndHistory:'',
        VitalSigns:{TA:'',FC:'',FR:'',TEMP:''},
        Kg:'',
        Stature:''};
  ngOnInit() {
    kendo.pdf.defineFont({
            "DejaVu Sans"             : "assets/font/DejaVuSans.ttf",
            "DejaVu Sans|Bold"        : "assets/font/DejaVuSans-Bold.ttf",
            "DejaVu Sans|Bold|Italic" : "assets/font/DejaVuSans-Oblique.ttf",
            "DejaVu Sans|Italic"      : "assets/font/DejaVuSans-Oblique.ttf",
            "WebComponentsIcons"      : "assets/font/WebComponentsIcons.ttf"
        });
    this.fecha = new Date();
    if (this.obj2 !== null) {
      this.obj = {
      Patient:{Name1:'',Name2:'',LastName1:'',LastName2:'',Years:'',Address:'',IdentityCard:''},
      RasonToConsultation:''
      ,AllergiesAndHistory:'',
        VitalSigns:{TA:'',FC:'',FR:'',TEMP:''},
        Kg:'',
        Stature:''};
    }
   this.act();
  }
  act = () =>{
    setTimeout(()=>{
      ////console.log(this.obj2,this.print);
      if (this.print) {
        this.obj = this.obj2;
        this.act();
      } else {
        this.act();
        this.obj = {
      Patient:{Name1:'',Name2:'',LastName1:'',LastName2:'',Years:'',Address:'',IdentityCard:''},
      RasonToConsultation:''
      ,AllergiesAndHistory:'',
        VitalSigns:{TA:'',FC:'',FR:'',TEMP:''},
        Kg:'',
        Stature:''};
      }
    },2000);
  }
  fnPDF = () => {
  	this.global.generatePDF('code','hojaHM_'+this.name);
  }
  fecha:any;
}
