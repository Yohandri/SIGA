import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

import 'rxjs/add/operator/toPromise';

import { Session, Global } from './global';
declare var $:any;

export interface Res {
  HttpStatusCode:number;
  Object:string;
  Status:boolean;
  ResultIsObject:boolean;
}

@Injectable()
export class httpService {
	private pathUrlLogin = this.global.dominio + 'api/WebServices/LoginUser';
	private pathUrlLoginFB = this.global.dominio + 'api/WebServices/FacebookLogin';
	private pathUrlLogout = this.global.dominio + 'api/WebServices/LogoutUser';
	private pathUrlRegister = this.global.dominio + 'api/WebServices/UserRegister';
	private pathUrlActive = this.global.dominio + 'api/WebServices/ActiveUser';
	private pathUrlRecovery = this.global.dominio + 'api/WebServices/RecoveryPassword';
	private pathUrlChagePass = this.global.dominio + 'api/WebServices/ChangePassword';
	private pathUrlReset = this.global.dominio + 'api/WebServices/ResetPassword';
	private pathUrlStatus = this.global.dominio + 'api/WebServices/SetVechicleUserIsDefault';
	private pathUrlUpImgCar = this.global.dominio + 'api/WebServices/UploadFileImageVehicle';

	private pathUrlTriaje = this.global.dominio + 'api/WebServicesERIS/Triage';
	private pathUrlTraumaShock = this.global.dominio + 'api/WebServicesERIS/AdmissionTraumaShock';
	private pathUrlAdmision = this.global.dominio + 'api/WebServicesERIS/Admission';
	private pathUrlsetStatusService = this.global.dominio + 'api/WebServicesERIS/SetStatusServiceRequest';
	private pathUrlCloseManager = this.global.dominio + 'api/WebServicesERIS/CloseManageAdmission';

	
	private pathUrlParamtri = this.global.dominio + 'api/WebServices/SelectRecord?sParamsIn={"Id": 0,"EntityName": "ParametersClient","page": 1, "pageSize":5}'

	private headers3 = new Headers({"Content-Type": "application/json","Tokenkey": "fd24f3d3-1131-4cd8-83f4-651a9693ea60"});
	private pathGet = 'https://comeguidi.azurewebsites.net/api/WebServices/SelectRecord?tokenkey=fd24f3d3-1131-4cd8-83f4-651a9693ea60&sParamsIn={%20%22Id%22:%200,%20%22EntityName%22:%20%22VehicleUserClient%22,%20%22page%22:%201,%20%22pageSize%22:5,%20%22FilterJson%22:%20{%20%22UserId%22:%201,%20}%20}';
    private headers = new HttpHeaders().set("Tokenkey", "fd24f3d3-1131-4cd8-83f4-651a9693ea60");

	constructor(public router:Router, public authService:AuthService,private http: Http, private httpClient: HttpClient, public global: Global) {}
	validarToken() {
	let valid = this.global.getLocal('User');
	if (JSON.stringify(valid) !== '{}') {
		this.httpClient
	    .get(this.global.dominio + 'api/WebServices/ValidateToken',{headers: new HttpHeaders().set("Tokenkey", this.global.Login.Guid)})
	    .subscribe((res:Res) => {
	     let status:boolean = res.Status;
	      if (!status) {
	        this.global.saveLocal('User', {});
	        this.global.saveLocal('Login', {});
	        this.authService.logout();
	        setTimeout(()=>{
	          //this.global.act();
	          this.router.navigate(["/"]);
	        },2000);
	       } else {
	       	
	       	setTimeout(()=>{
	          this.validarToken();
	        }, 10000);
	       }     
	    })
	}
	
	}
	triaje(form){
		let json = form;
		return this.httpClient
		    .post(this.pathUrlTriaje, json, {headers: new HttpHeaders().set("Tokenkey", this.global.Login.Guid)})
		    .toPromise()
		    .then(res => res)
		    .catch(this.handleError);
	}
	admision(form){
		let json = form;
		return this.httpClient
		    .post(this.pathUrlAdmision, json, {headers: new HttpHeaders().set("Tokenkey", this.global.Login.Guid)})
		    .toPromise()
		    .then(res => res)
		    .catch(this.handleError);
	}
	traumaShock(){
		let json = '';
		return this.httpClient
		    .post(this.pathUrlTraumaShock, json, {headers: new HttpHeaders().set("Tokenkey", this.global.Login.Guid)})
		    .toPromise()
		    .then(res => res)
		    .catch(this.handleError);
	}
	setStatusService(form){
		let json = form;
		return this.httpClient
		    .post(this.pathUrlsetStatusService, json, {headers: new HttpHeaders().set("Tokenkey", this.global.Login.Guid)})
		    .toPromise()
		    .then(res => res)
		    .catch(this.handleError);
	}
	CloseManager(form){
		let json = form;
		return this.httpClient
		    .post(this.pathUrlCloseManager, json, {headers: new HttpHeaders().set("Tokenkey", this.global.Login.Guid)})
		    .toPromise()
		    .then(res => res)
		    .catch(this.handleError);
	}
	post(path,form){
		let json = form;
		return this.httpClient
		    .post(this.global.dominio + path, json, {headers: new HttpHeaders().set("Tokenkey", this.global.Login.Guid)})
		    .toPromise()
		    .then(res => res)
		    .catch(this.handleError);
	}
	SetVechicleUserIsDefault(pass: object) {
		let json = pass;
		return this.httpClient
		    .post(this.pathUrlStatus, json, {headers: new HttpHeaders().set("Tokenkey", this.global.Login.Guid)})
		    .toPromise()
		    .then(res => res)
		    .catch(this.handleError);
	}
	loadFileCar(file, idVehicle) {
		let json = new FormData();
		//console.log(file, idVehicle);
		json.append('uploadFile', file, file.name);
		//console.log(json);

		return this.httpClient
		    //.post(this.pathUrlUpImgCar, json, {headers:  new HttpHeaders({"Tokenkey": this.global.Login.Guid,"VehicleId": idVehicle})})'enctype', 'multipart/form-data
		    .post(this.pathUrlUpImgCar, json, {headers: new HttpHeaders().set("VehicleId", String(idVehicle)).set("Tokenkey", this.global.Login.Guid).set("enctype", 'multipart/form-data')})
		    .toPromise()
		    .then(res => res)
		    .catch(this.handleError);
	}
	getStatic(path) {
		return this.httpClient
		    .get(this.global.dominio + path,{headers: new HttpHeaders().set("Tokenkey", this.global.Login.Guid)})
		    .toPromise()
		    .then(res => res)
		    .catch(this.handleError);
	}
	login(login: object) {
		return this.httpClient
		    .post(this.pathUrlLogin, login, {headers: this.headers})
		    .toPromise()
		    .then(res => res)
		    .catch(this.handleError);
	}
	userR(login: object) {
		return this.httpClient
		    .post(this.pathUrlRegister, login, {headers: this.headers})
		    .toPromise()
		    .then(res => res)
		    .catch(this.handleError);
	}
	loginFB(login: object) {
		return this.httpClient
		    .post(this.pathUrlLoginFB, login, {headers: this.headers})
		    .toPromise()
		    .then(res => res)
		    .catch(this.handleError);
	}
	logout(user) {
		return this.httpClient
		    .post(this.pathUrlLogout, {username: user,"password": "","Source": "Web","Device": "Chrome","Version": "6.0"}, {headers: new HttpHeaders().set("Tokenkey", this.global.Login.Guid)})
		    .toPromise()
		    .then(res => res)
		    .catch(this.handleError);
	}
	activateUser(guid: string) {
		let json = {"guid":guid};
		return this.httpClient
		    .post(this.pathUrlActive + '?guid=' + guid, json, {headers: this.headers})
		    .toPromise()
		    .then(res => res)
		    .catch(this.handleError);
	}
	recoveryPass(email: string) {
		let json = {"email":email};
		////console.log(this.pathUrlRecovery, {"email":email});
		return this.httpClient
		    .post(this.pathUrlRecovery, json, {headers: this.headers})
		    .toPromise()
		    .then(res => res)
		    .catch(this.handleError);
	}
	resetPass(obj: any) {
		let json = {"guidUser": obj.guidUser, "password": obj.password};
		return this.httpClient
		    .post(this.pathUrlReset, json, {headers: this.headers})
		    .toPromise()
		    .then(res => res)
		    .catch(this.handleError);
	}
	changePass(pass: object) {
		let json = pass;
		return this.httpClient
		    .post(this.pathUrlChagePass, json, {headers: new HttpHeaders().set("Tokenkey", this.global.Login.Guid)})
		    .toPromise()
		    .then(res => res)
		    .catch(this.handleError);
	}
	addConnecttionUser(Ids: any) {
		////console.log(Ids);
		let pathUrlConnectionUser = this.global.dominio + 'api/WebServices/ConnectionRequestUsers?connectToUserClient='+ Ids.userId2;
		return this.httpClient
		    .post(pathUrlConnectionUser, Ids, {headers: new HttpHeaders().set("Tokenkey", this.global.Login.Guid)})
		    .toPromise()
		    .then(res => res)
		    .catch(this.handleError);
	}
	changeFollowUsers(Ids: any) {
		//console.log(Ids);
		let pathUrlConnectionUser = this.global.dominio + 'api/WebServices/ChangeFollowUsers?userId1='+ Ids.userId1 +'&userId2=' + Ids.userId2;
		return this.httpClient
		    .post(pathUrlConnectionUser, Ids, {headers: new HttpHeaders().set("Tokenkey", this.global.Login.Guid)})
		    .toPromise()
		    .then(res => res)
		    .catch(this.handleError);
	}
	get(path) {
		return this.httpClient
		    .get(this.global.dominio + path,{headers: new HttpHeaders().set("Tokenkey", this.global.Login.Guid)})
		    .toPromise()
		    .then(res => res)
		    .catch(this.handleError);
	}
	addEntity(tabla,obj) {
		let datos = {"EntityName": tabla,	"EntityJson": obj};
		////console.log(datos);
		////console.log({headers: new HttpHeaders().set("Tokenkey", this.global.Login.Guid)});
		return this.httpClient
			.post(this.global.dominio + 'api/WebServices/UpsertEntity', datos , {headers: new HttpHeaders().set("Tokenkey", this.global.Login.Guid)})
			.toPromise()
		    .then(res => res)
		    .catch(this.handleError);
	}
	deleteEntity(tabla,obj) {
		let datos = {Id: obj,"EntityName": tabla, "EntityJson": ''};
		////console.log('api/WebServices/RemoveRecord?paramsIn='+JSON.stringify(datos));
		return this.httpClient
			.post(this.global.dominio + 'api/WebServices/RemoveRecord',datos ,{headers: new HttpHeaders().set("Tokenkey", this.global.Login.Guid)})
			.toPromise()
		    .then(res => res)
		    .catch(this.handleError);
	}
	private handleError(error: any): Promise<any> {
	  console.error('An error occurred', error);
	  return Promise.reject(error.message || error);
	}
}

