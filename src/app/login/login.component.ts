import { Component, OnInit } from '@angular/core';
import { httpService } from '../http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Global } from '../global';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
declare var $:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public httpService: httpService, 
  			  private fb:FormBuilder, 
  			  public global: Global, 
  			  private router: Router,
  			  public authService:AuthService,) { }

  ngOnInit() {
  	$('#exampleInputEmail1').focus();
  	this.restFormLogin();
  	if (this.authService.isLoggedIn) {
        this.router.navigate(['/dashboard']);
    }
  }
  formLogin: FormGroup;

  restFormLogin = () => {
  	this.formLogin = this.fb.group({
      'UsernameOrEmail' : ['', Validators.required],
      'password' : ['', Validators.required],
      "Source": "Web",
	  "Device": "this.Device",
	  "Version": "this.Version",
    "IP":'192.168.0.151'
    });
  }
    submit(form) {
  	////console.log(this.rememberCheck);
  	this.global.loading('in');
  	this.httpService.login(form).then((response) => {
  		let status:boolean = response.Status;
  		let statusCode:number = response.HttpStatusCode;
  		let data:any = response.Object;
  		let errorAuth:boolean = response.ResultIsObject;
  		//console.log(response);
  		if (status) {
  			if (statusCode == 200) {
  				if (errorAuth != true) {
  					this.global.msj(data,'danger');
  				} else {
  					this.global.User = data.User;
  					this.global.Login = data;
  					this.global.saveLocal('User',this.global.User);
  					this.global.saveLocal('Login',this.global.Login);
  					let typeUser = this.global.User.UserProfileId;
  					this.authService.login().subscribe(() => {
				      if (this.authService.isLoggedIn) {
				        let redirect:string = '';
				        if (typeUser == 1) {
                 			redirect = '/dashboard';
  	  					} else if(typeUser == 4) {
                      redirect = '/Pantalla';
                } else if (typeUser == 2) {
                      redirect = '/dashboard'
                } else if (typeUser == 3) {
                      redirect = '/dashboard'
                } else if (typeUser > 4) {
                      redirect = '/dashboard'
                }
				        this.router.navigate([redirect]);
				        this.global.msj('Bienvenido','success');
				      }
				    });
  					
  				}
  			}
  		} else {
  			//this.global.msj(data,'danger');
  		}
  		this.global.loading('out');
  	}).catch((response) => {
  		//console.log(response);
  		this.global.loading('out');
  	});
  }
}
