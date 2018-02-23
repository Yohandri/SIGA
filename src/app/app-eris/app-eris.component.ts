import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {Global} from '../global';
import {httpService} from '../http.service';
import { Router } from '@angular/router';
import { fadeInAnimation } from '../_animations';
declare var $:any;

@Component({
  selector: 'app-app-eris',
  templateUrl: './app-eris.component.html',
  styleUrls: ['./app-eris.component.css'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})
export class AppErisComponent implements OnInit {

  constructor(public authService:AuthService,
  			public global:Global,public httpService:httpService,
  			public router:Router) {
					this.httpService.validarToken();
  	if (!this.authService.isLoggedIn) {
        this.router.navigate(['/']);
	}
	let tipoUser = this.global.getUserProfileId();
  	setTimeout(()=>{
      if (tipoUser == 1 ) {
        this.global.entorno = 'Administrador';
      } else if(tipoUser == 2){
        this.global.entorno = 'Admisión';
      } else if(tipoUser == 3){
        this.global.entorno = 'Triaje';
      } else if(tipoUser == 4){
        this.global.entorno = 'Pantalla';
      } else if(tipoUser == 5){
        this.global.entorno = 'Enfermería emergencia';
      } else if(tipoUser == 6){
        this.global.entorno = 'Super administrador';
      }
    },2000);
				 }

  ngOnInit() {
  	this.httpService.validarToken();
  	if (!this.authService.isLoggedIn) {
        this.router.navigate(['/']);
	}
	let tipoUser = this.global.getUserProfileId();
  	setTimeout(()=>{
      if (tipoUser == 1 ) {
        this.global.entorno = 'Administrador';
      } else if(tipoUser == 2){
        this.global.entorno = 'Admisión';
      } else if(tipoUser == 3){
        this.global.entorno = 'Triaje';
      } else if(tipoUser == 4){
        this.global.entorno = 'Pantalla';
      } else if(tipoUser == 5){
        this.global.entorno = 'Enfermería emergencia';
      } else if(tipoUser == 6){
        this.global.entorno = 'Super administrador';
      }
    },2000);
   
  }
	typeEntorno:string = 'Adminsion';
  closeSession() {
  	this.global.loading('in');
		this.httpService.logout(this.global.User.Nickname).then((response) => {
			let status:boolean = response.Status;
	  		let statusCode:number = response.HttpStatusCode;
	  		let data:any = response.Object;
	  		let errorAuth:boolean = response.ResultIsObject;
			this.global.loading('out');
     ////console.log(response);
			if (status) {
				if (statusCode == 200) {

					this.global.saveLocal('User', {});
					this.global.saveLocal('Login', {});
					this.router.navigate(["/"]);
					//this.global.act();
					this.authService.logout();
					this.global.msj('Hasta pronto', null);
          //this.facebook.logout().then(() => //console.log('Logged out!'));
				}
			} else {
				//Materialize.toast(data, 5000, 'red');
				this.global.saveLocal('User', {});
				this.global.saveLocal('Login', {});
			}
			
		});
		
	}

}
