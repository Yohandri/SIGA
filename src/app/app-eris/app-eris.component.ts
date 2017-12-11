import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {Global} from '../global';
import {httpService} from '../http.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-app-eris',
  templateUrl: './app-eris.component.html',
  styleUrls: ['./app-eris.component.css']
})
export class AppErisComponent implements OnInit {

  constructor(public authService:AuthService,
  			public global:Global,public httpService:httpService,
  			public router:Router) { }

  ngOnInit() {
  	this.httpService.validarToken();
  	if (!this.authService.isLoggedIn) {
        this.router.navigate(['/']);
    }
   
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
     //console.log(response);
			if (status) {
				if (statusCode == 200) {

					this.global.saveLocal('User', {});
					this.global.saveLocal('Login', {});
					this.router.navigate(["/"]);
					//this.global.act();
					this.authService.logout();
					this.global.msj('Hasta pronto', null);
          //this.facebook.logout().then(() => console.log('Logged out!'));
				}
			} else {
				//Materialize.toast(data, 5000, 'red');
				this.global.saveLocal('User', {});
				this.global.saveLocal('Login', {});
			}
			
		});
		
	}

}
