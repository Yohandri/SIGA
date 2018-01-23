import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { httpService } from './http.service';
declare var $:any;
declare var Materialize:any;
declare var kendo:any;
declare var appConfig:any;
@Injectable()
export class Global {
	public title: string = 'ERIS';
	public dominio:string = appConfig.Dominio;
	public itemShow:string = '10';
	public textTitleModal:string = 'Aggiungi';
	public titleRequiered:string = 'es requerido';
	public erisListTable:any[] = [
		//{table:'VitalSigns', label:'Signos vitales'}
		{table:'Emergency', label:'Admisión'},
		{table:'StageParams', label:'StageParams'},
		{table:'ServiceRequestParams', label:'ServiceRequestParams'},
	];
	public colasListTable:any[] = [
		{table:'TipoCola', label:"Tipos de cola", sAdmin:false},
		{table:'TipoSeguro', label:"Tipos de seguro", sAdmin:false},
		{table:'TipoUsuario', label:"Tipos de usuario", sAdmin:false},
		{table:'Usuario', label:"Usuarios", sAdmin:false},
		{table:'Servicio', label:"Servicíos", sAdmin:false},
		{table:'TipoServicio', label:"Tipos de Servicío", sAdmin:false},
		{table:'Colectivo', label:"Colectivo", sAdmin:false},
		{table:'Seguro', label:"Seguro", sAdmin:false},
		{table:'Cola', label:"Cola", sAdmin:false},
		{table:'TaquillaPC', label:"Taquilla PC", sAdmin:true},
		{table:'Settings', label:"Settings", sAdmin:true},
		{table:'TEST', label:"TEST", sAdmin:true},
		{table:'TextoEnPantalla', label:"Texto en pantalla", sAdmin:false},
		{table:'VideoEnPantalla', label:"Video en pantalla", sAdmin:false},
	];
	public adminListTable:any[] = [
		{table:'UserProfile', label:'Tipos de usuario', sAdmin:false},
		{table:'User', label:'Usuarios', sAdmin:false},
		{table:'Assured', label:"Seguros", sAdmin:false},
		{table:'Collective', label:"Colectivo", sAdmin:false},
		{table:'Location', label:"Ubicaciones", sAdmin:false},
		{table:'Parameters', label:"Parámetros", sAdmin:true},
		{table:'WorkPlace', label:"Puesto de trabajo", sAdmin:false},
		{table:'Patient', label:"Paciente", sAdmin:false},
		{table:'Familiar', label:"Familiar", sAdmin:false},
		{table:'Log', label:"Log", sAdmin:false},
		{table:'Test', label:"Test", sAdmin:true},
	];
	public loading = (accion) => {
		if (accion == 'in') {
			//$('a,button,input').prop("disabled", true);
			$('.cortina').css('display', 'block');
		}
		if (accion == 'out') {
			//$('a,button,input').prop("disabled", false);
			$('.cortina').css('display', 'none');
		}
	};
	public entorno:string = '';
	public User:any = this.getLocal('User');
	public Login:any= this.getLocal('Login');
	public Msj:string;
	public saveLocal(collection,obj) {
		localStorage.setItem(collection,JSON.stringify(obj));
	}
	public getUserId = () => {
		let id = this.getLocal('User').Id;
		return id;
	}
	public getUserProfileId = () => {
		let id = this.getLocal('User').UserProfileId;
		return id;
	}
	public getLocal(collection:string) {
		let data = localStorage.getItem(collection);
		if (data == null || data == {}) {
			return {}
		} else {
			return JSON.parse(data);
		}
	}
	public act() {
		this.User = this.getLocal('User');
		this.Login = this.getLocal('Login'); 
	}
	public getData() {
		// let data = localStorage.getItem('Session');
		// if (data == null) {
		// 	return {email: 'Usuario',password:'', token:''};
		// }
		// if (data != null) {
		// 	return JSON.parse(data);
		// }
	}
	public msj(text:string, estado:string, time?:number) {
		//Materialize.toast(text,5000, estado);
		if (estado == 'success' || estado == null) {
			$('.alertCustom').addClass('callout-success');
		}
		if (estado == 'danger') {
			$('.alertCustom').addClass('callout-danger');
		}
		if(time == undefined){
			time = 5000;
		}
		$('.alertCustom h4').text(text);
	  	$('.alertCustom').addClass('Show');
	  	setTimeout(function(){
	  		$('.alertCustom').removeClass('Show');
	  		$('.alertCustom').removeClass('callout-danger');
	  		$('.alertCustom').removeClass('callout-success');
	  		$('.alertCustom h4').text('');
	  	}, time);
	}
	public openModal = (modal) => {
	  	$('#' + modal).modal({
	  		backdrop: true,
	  		keyboard: false
		},'show');
	  }
	public closeModal = (modal) => {
	  	$('#' + modal).modal('hide');
	  }
	  public addClass = (element:string, clase:string) => {
		$(element).addClass(clase);
	  }
	  public removeClass = (element:string, clase:string) => {
		$(element).removeClass(clase);
	  }
	public   generatePDF = (name,section) => {
     kendo.drawing.drawDOM($("#"+ section)).then(function(group) {
            group.options.set("pdf", {
              multiPage: true,
              paperSize: 'auto',
                margin: {
                    left   : "10mm",
                    top    : "20mm",
                    right  : "10mm",
                    bottom : "20mm"
                }
            });
            //console.log(group);
     kendo.drawing.pdf.saveAs(group, "HM_"+name+".pdf");
  })
}
public toggle = () => {
	
}

	constructor(private router: Router, public authService: AuthService) {}
}
export interface Session {
	email:string;
	usuario:string;
	password:string;
	token:string;
}