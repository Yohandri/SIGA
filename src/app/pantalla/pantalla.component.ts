import { Component, OnInit } from '@angular/core';
import { Global } from '../global';
import { httpService } from '../http.service';
import { Router } from '@angular/router';
declare var $:any;
declare var moment:any;

@Component({
  selector: 'app-pantalla',
  templateUrl: './pantalla.component.html',
  styleUrls: ['./pantalla.component.css']
})
export class PantallaComponent implements OnInit {

  constructor(public httpService:httpService,
              public router:Router,
              public global:Global) { }

  ngOnInit() {
  	this.get();
    let self = this;
    let typeUser = this.global.User.UserProfileId;
    let redirect:string = '';
    if (typeUser == 2) {
           redirect = '/dashboard';
           this.router.navigate([redirect]);
    }
    var ctrlPressed = false;
      var teclaCtrl = 17, teclaC = 67;
      $(document).keyup(function (e) {
          if (e.keyCode == teclaCtrl)
              ctrlPressed = false;
      });
      $(document).keydown(function (e) {
          if (e.keyCode == teclaCtrl)
              ctrlPressed = true;
          if (ctrlPressed && (e.keyCode == teclaC)){
            self.global.openModal('modal-confirmar-cerrarSession');
          }
              
      });  
  }
  listPantalla:any = [];
  llamada:any = {};
  get = () => {
    let path = 'api/WebServicesERIS/ShowScreenTicket';
  	this.httpService.get(path).then((res)=>{
  		console.log(res);
      let status = res.Status;
      let datos = res.Object.ListItems;
      //this.listPantalla = datos;
      if (status) {
        this.listPantalla = [];
        //this.llamada = {};
        datos.forEach((val)=>{
          if (val.Id == 0) {
            this.llamada = val;
            this.sonido();
          } 
          this.listPantalla.push(val);
        });
        let e:boolean = false;
        this.listPantalla.forEach(val=>{
          if (val.Ticket == this.llamada.Ticket) {
            e = true;
          }
        });
        if (!e) {
          this.llamada = {};
        }
        setTimeout(()=>{
          this.get();
        },10000)
      }
  	});
  }
  sonido = () => {
  	let audio = new Audio();
  	audio.src = "assets/tono.mp3";
  	audio.load();
  	audio.play();
  	//console.log(audio);
  }
  public closeSession() {
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
          this.global.closeModal('modal-confirmar-cerrarSession');
          this.global.saveLocal('User', {});
          this.global.saveLocal('Login', {});
          this.router.navigate(["/"]);
          //this.act();
          this.global.authService.logout();
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
