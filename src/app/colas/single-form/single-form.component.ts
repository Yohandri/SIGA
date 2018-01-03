import { Component, OnInit ,ElementRef, ViewChild,ViewContainerRef } from '@angular/core';
import { Global } from '../../global';
import { AdminTable } from '../../admin-table';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { fadeInAnimation } from '../../_animations';
import { tableSingle } from '../interfaces';
import { httpService } from "../../http.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { element } from 'protractor';
declare var moment:any;

@Component({
  selector: 'app-single-form',
  templateUrl: './single-form.component.html',
  styleUrls: ['./single-form.component.scss'],
  animations: [fadeInAnimation]
})
export class SingleFormComponent implements OnInit {
  @ViewChild('btnBack') btnBack:ElementRef;
  @ViewChild('ModalDelete') ModalDelete:ElementRef;
  @ViewChild('ModalWarning') ModalWarning:ElementRef;
  constructor(
    public global: Global,
    public aTable: AdminTable,
    public aRouter: ActivatedRoute,
    public router: Router,
    public api: httpService,
    public fb: FormBuilder
  ) {
    this.aRouter.params.subscribe( params => {
      //console.log(params);
      //console.log(this.aRouter.snapshot.params.id);
      this.entityName = params.entityname;
      this.id = params.id;
      this.getData(this.entityName,this.id);
      this.restForm();
      this.inputs = this.aTable.setEntityName(this.entityName).inputs;
      this.title = this.aTable.setEntityName(this.entityName).titleTable;
      this.titles = this.aTable.setEntityName(this.entityName).title;
      this.inputs.forEach((element,index) => {
        if(element.option){
          this.getOption(element.option, index);
        }
      });
    } );
   }
  ngOnInit() {
  }
  entityName:string;
  id:string;
  form:FormGroup;
  inputs:any = [];
  title:string = '';
  titles:any = [];
  onEdit:boolean = false;
  onLoad:boolean = false;
  data:any = {};
  fechaInvalida:boolean = false;
  fnDelete = () => {
    let idModal = this.ModalDelete.nativeElement.id;
    this.global.removeClass('#'+idModal, 'modal-success');
    this.global.addClass('#'+idModal, 'modal-danger');
    this.global.openModal(idModal);
  }
  confirmarDelete = () => {
    let idModal = this.ModalDelete.nativeElement.id;
    this.api.deleteEntity(this.entityName + 'Client', this.id).then(res => {
      console.log(res);
      let status:boolean = res.Status;
      if(status){
        this.global.removeClass('#'+idModal, 'modal-danger');
        this.global.addClass('#'+idModal, 'modal-success');
        this.global.msj('Eliminado con éxito', 'success');
        setTimeout(()=>{
          this.global.closeModal(idModal);
          this.btnBack.nativeElement.click();
        },1000);
      } else {
        this.global.msj('No se pudo eliminar', 'danger');
        setTimeout(()=>{
          this.global.closeModal(idModal);
        },2000);
      }
    });
    
  }
  getText = (id):string => {
    let cadena:string = '';
    this.inputs.forEach(element => {
      if(element.type == 'selectSearch'){
        element.data.forEach(val => {
          if(id == val.id){
            cadena = val.text;
          }
        });
      }
    });
    return cadena;
  }
  getOption = (entityName, index):void => {
    let data:any = [];
    let path:string = 'api/WebServices/SelectRecord?sParamsIn={"Id": 0,"EntityName": "'+ entityName +'Client","page":0, "pageSize": 1}';
    this.api.get(path).then(res => {
      //console.log(res);
      if(res.Status){
        if(this.inputs[index].type == 'select'){
          this.inputs[index].data = res.Object.ListItems;
          
        } else if(this.inputs[index].type == 'selectSearch'){
          console.log(this.inputs[index]);
          let campo = this.inputs[index].campoName;
          res.Object.ListItems.forEach((element)=>{
            this.inputs[index].data.push({id:element.Id,text:eval('element.' + campo)})
          });
        }
      }
    });
  }
  public selected = (val, campo):void =>{
    this.form.controls[campo].setValue(val.id);
  }
  getData = (entityName, id) => {
    if(id != 'Nuevo'){
      this.onEdit = true;
      this.onLoad = true;
      let path:string = 'api/WebServices/FindOneRecord?sParamsIn={"Id": '+ id +',"EntityName": "'+ entityName +'Client"}';
      ////console.log(path);
      this.api.get(path).then(res => {
        //console.log(res);
        this.onLoad = false;
        let status = res.Status;
        let self = this;
        if(status){
          let obj = res.Object;
          this.data = obj;
          if(obj != null){
            this.aTable.setEntityName(this.entityName).inputs.forEach(element => {
              Object.keys(obj).forEach(function(key,index) {
                if(key == element.campo){
                  if(element.type == 'date'){
                    self.form.controls[key].setValue(moment(obj[key]).format('DD/MM/YYYY'));
                  } else {
                    self.form.controls[key].setValue(obj[key]);
                  }
                }
              });
            });
          } else if(obj == null){
            this.global.msj('No existe', 'danger');
            this.btnBack.nativeElement.click();
          }
          
        }
      });
    }
  }
  submit = (form) => {
    console.log(form);
    this.onLoad = true;
    let path:string = '';
    let body:any = {};
    let id = this.id;
    let entityName = this.entityName;

    path = 'api/WebServices/UpsertEntity';
    body = {"EntityName": entityName +'Client',entityJson:form};
    this.api.post(path,body).then((res)=>{
      this.onLoad = false;
      console.log(res);
      let status = res.Status;
      if(status){
        this.global.msj('Guardado con éxito', 'success');
        if(this.id != 'Nuevo'){
          this.form.reset();
          this.getData(this.entityName,this.id);
          this.restForm();
        } else {
          let id = res.Object.Id;
          let p = this.router.url.split('/');
          let url:string = p[1] + '/' + p[2] + '/' + id;
          this.router.navigate([url]);
        }
      } else {
        this.global.msj(res.Object, 'danger');
      }
    });
  }
  nuevo = () => {
    let p = this.router.url.split('/');
    let url:string = p[1] + '/' + p[2] + '/Nuevo';
    this.router.navigate([url]);
    this.onEdit = false;
  }
  restForm = () => {
    let form:any = {};
    this.aTable.setEntityName(this.entityName).inputs.forEach(element => {
      if(element.required){
        //console.log(element.minLength);
        if(element.minLength != undefined){
          if(element.init){
            form[element.campo] = [element.init,Validators.compose([Validators.required,Validators.minLength(element.minLength)])];
          } else {
            form[element.campo] = ['',Validators.compose([Validators.required,Validators.minLength(element.minLength)])];
          } 
        } else {
          if(element.type == 'checkbox'){
            form[element.campo] = [false,Validators.required];
          } else {
            if(element.init){
              form[element.campo] = [element.init,Validators.required];
            } else {
              form[element.campo] = ['',Validators.required];
            }
          }         
        }
      } else{
        if(element.type == 'checkbox'){
          if(element.disabled){
            form[element.campo] = {value: false, disabled: true};
          }else {
            form[element.campo] = false;
          }
        } else {
          if(element.disabled){
            if(element.init){
              form[element.campo] = {value: element.init, disabled: true};
            } else {
              form[element.campo] = {value: '', disabled: true};
            }
          }else {
            if(element.init){
              form[element.campo] = element.init;
            } else {
              form[element.campo] = '';
            }
          }
          
        }
      }
      if(element.campo == 'Id'){
        form[element.campo] = 0;
      }
    });
    //console.log(form);
    this.form = this.fb.group(form);
  }
  fnBack = (accion) => {
    //console.log(accion);
    if(accion){
      let idModal = this.ModalWarning.nativeElement.id;
      this.global.openModal(idModal);    
    } else {
      this.btnBack.nativeElement.click();
    }
  }
  confirmarWarning = () => {
    let idModal = this.ModalWarning.nativeElement.id;
    this.global.closeModal(idModal);  
    setTimeout(()=>{
      this.btnBack.nativeElement.click();
    },400)
  }
  validarFecha = (event) => {
    let target = event.target;
    let fecha = target.value;
    let isValid = moment(this.parseDMY(fecha)).isValid();
    if (!isValid) {
      this.global.msj('Fecha invalida','danger');
      this.fechaInvalida = true;
      setTimeout(()=>{
        this.global.removeClass('.validateDate', 'has-success');
        this.global.addClass('.validateDate', 'has-error');
      },500);
		} else {
      this.global.removeClass('.validateDate', 'has-error');
      this.fechaInvalida = false;
      this.global.addClass('.validateDate', 'has-success');      
		}
  }
  parseDMY = (value) => {
		let date = value.split("/");
		let d = parseInt(date[0], 10),
		m = parseInt(date[1], 10),
		y = parseInt(date[2], 10);
		return (y + '-' + (m) + '-' + d);
	}
}
