import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { httpService } from './http.service';
declare var $:any;
declare var Materialize:any;
declare var kendo:any;
@Injectable()
export class Global {
	public title: string = 'ERIS';
	public dominio:string = 'http://dev-marco-01-pc/apiERIS/';
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
                {required:false,campo:'Id', label:'Id', type:'text'},
                {required:true,campo:'Name', label:'Nombre', type:'text'},
                {required:true,campo:'Description', label:'Descripción', type:'text'}
		    ];
		} else if(entityname == 'User'){
            titleTable = 'Usuario';
            inputs = [
                {required:false,campo:'Id', label:'Id', type: 'text'},
                {required:false,campo:'Code', label:'Codigo', type: 'text'},
                {required:true,campo:'Username', label:'Usuario', type: 'text'},
                {required:true, minLength:8,campo:'IdentityCard', label:'Cedula', type: 'text'},
                {required:true,campo:'Name', label:'Nombre', type: 'text'},
                {required:false,campo:'LastName', label:'Apellido', type: 'text'},
                {required:true,campo:'UserProfileName', label:'Tipo de usuario', type: 'select', option: 'UserProfile', campoName:'Name'} 
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
	public msj(text, estado) {
		//Materialize.toast(text,5000, estado);
		if (estado == 'success' || estado == null) {
			$('.alertCustom').addClass('callout-success');
		}
		if (estado == 'danger') {
			$('.alertCustom').addClass('callout-danger');
		}
		$('.alertCustom h4').text(text);
	  	$('.alertCustom').addClass('Show');
	  	setTimeout(function(){
	  		$('.alertCustom').removeClass('Show');
	  		$('.alertCustom').removeClass('callout-danger');
	  		$('.alertCustom').removeClass('callout-success');
	  		$('.alertCustom h4').text('');
	  	}, 5000);
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