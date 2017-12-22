import { Component, OnInit ,ElementRef, ViewChild,ViewContainerRef } from '@angular/core';
import { Global } from '../../global';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { fadeInAnimation } from '../../_animations';
import { tableSingle } from '../interfaces';
import { httpService } from "../../http.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  constructor(
    public global: Global,
    public aRouter: ActivatedRoute,
    public router: Router,
    public api: httpService,
    public fb: FormBuilder
  ) {
    this.aRouter.params.subscribe( params => {
      //console.log(params);
      this.entityName = params.entityname;
      this.id = params.id;
      this.getData(this.entityName,this.id);
      this.restForm();
      this.inputs = this.global.setEntityName(this.entityName).inputs;
      this.title = this.global.setEntityName(this.entityName).titleTable;
      this.titles = this.global.setEntityName(this.entityName).title;
      this.inputs.forEach((element,index) => {
        if(element.option){
          this.getOption(element.option, index);
        }
      });
      setTimeout(()=>{
        //console.log(this.inputs);
      },1000);
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
  getOption = (entityName, index):void => {
    let data:any = [];
    let path:string = 'api/WebServices/SelectRecord?sParamsIn={"Id": 0,"EntityName": "'+ entityName +'Client","page":0, "pageSize": 1}';
    this.api.get(path).then(res => {
      //console.log(res);
      if(res.Status){
        this.inputs[index].data = res.Object.ListItems;
      }
    });
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
            this.global.setEntityName(this.entityName).inputs.forEach(element => {
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
      } else {
        this.global.msj(res.Object, 'danger');
      }
    });
  }
  restForm = () => {
    let form:any = {};
    this.global.setEntityName(this.entityName).inputs.forEach(element => {
      if(element.required){
        //console.log(element.minLength);
        if(element.minLength != undefined){
          form[element.campo] = ['',Validators.compose([Validators.required,Validators.minLength(element.minLength)])];
        } else {
          form[element.campo] = ['',Validators.required];
        }
      } else {
        form[element.campo] = '';
      }
      if(element.campo == 'Id'){
        form[element.campo] = 0;
      }
    });
    //console.log(form);
    this.form = this.fb.group(form);
  }

}
