import { Component, OnInit } from '@angular/core';
import { httpService } from '../http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Global } from '../global';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent implements OnInit {

  constructor(public global:Global,
  			  public httpService:httpService) { }

  ngOnInit() {
  	let tipoUser = this.global.getUserProfileId();
  	if (tipoUser == 1 ) {
  		this.entorno = 'Administrador';
  	} else if(tipoUser == 2){
  		this.entorno = 'Admision';
  	} else if(tipoUser == 3){
  		this.entorno = 'Triaje';
  	}
  	this.get();
  }
  entorno:string = '';
  fichaPaciente:any = {};
  listPatients:any = [];
  table:any = {}

  get = () => {
  	let path:string = 'api/WebServices/SelectRecord?sParamsIn={"Id": 0,"EntityName": "PatientClient","page":0, "pageSize":1}';
  	this.httpService.get(path).then(res => {
  		
  		this.listPatients = res.Object.ListItems;
  		////console.log(this.listPatients);
  		this.table = {
  				'headers':['Nombre','Apellido','Cedula'],
  				'body':['Name1'],
  				'data':this.listPatients
  			}

  	});
  }
  fnGestionar = (accion) => {

  }
  cerrarFicha = () => {

  }

}
