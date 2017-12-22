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
	public itemShow:string = '3';
	public textTitleModal:string = 'Aggiungi';
	public titleRequiered:string = 'es requerido';
	public colasListTable:any[] = [
		{table:'UserProfile', label:'Tipos de usuario'},
		{table:'User', label:'Usuarios'}
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
	public setEntityName = (entityname):any[string] => {
        let campos = [];
        let title = [];
        let inputs = [];
        let titleTable = '';
		if(entityname == 'UserProfile'){
            titleTable = 'Tipo de usuario';
            inputs = [
                {required:false,showGrip:false,showForm:false,campo:'Id', label:'Id', type:'text'},
                {required:true,showGrip:true,showForm:true,campo:'Name', label:'Nombre', type:'text'},
                {required:true,showGrip:true,showForm:true,campo:'Description', label:'Descripción', type:'text'}
		    ];
		} else if(entityname == 'User'){
            titleTable = 'Usuario';
            inputs = [
                {required:false,showGrip:false,showForm:false,campo:'Id', label:'Id', type: 'text'},
                {required:false,showGrip:true,showForm:false,readonly:true,campo:'Code', label:'Código', type: 'text'},
                {required:false,showGrip:true,showForm:false,readonly:true,campo:'Username', label:'Usuario', type: 'text'},
                {required:true, showGrip:true,showForm:true,minLength:7,campo:'IdentityCard', label:'Cédula', type: 'number'},
                {required:true,showGrip:true,showForm:true,readonly:false, campo:'Name', label:'Nombre', type: 'text'},
				{required:false,showGrip:true,showForm:true,campo:'LastName', label:'Apellido', type: 'text'},
				{required:false, showGrip:false,showForm:true,campo:'Email', label:'Correo', type:'email'},
				{required:false,showGrip:false, showForm:true,campo:'Phone', label:'Telefono', type:'text'},
				{required:false,showGrip:false,showForm:true,campo:'BirthDate', label:'Fecha de nacimiento',type:'date'},
                {required:true,showGrip:false,showForm:true,campo:'UserProfileName', label:'Tipo de usuario', type: 'select', option: 'UserProfile', campoName:'Name'} 
            ];
        }
        inputs.forEach(element => {
			campos.push(element.campo);
		});
		inputs.forEach(element => {
			if(element.label != 'Id'){
			    title.push(element.label);
			}
		});
		let ret = {campos:campos,title:title,titleTable:titleTable,inputs:inputs};
		return ret;
	  }
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