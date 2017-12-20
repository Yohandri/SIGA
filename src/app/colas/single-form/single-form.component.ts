import { Component, OnInit ,ElementRef, ViewChild } from '@angular/core';
import { Global } from '../../global';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { fadeInAnimation } from '../../_animations';
import { tableSingle } from '../interfaces';
import { httpService } from "../../http.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-single-form',
  templateUrl: './single-form.component.html',
  styleUrls: ['./single-form.component.scss'],
  animations: [fadeInAnimation]
})
export class SingleFormComponent implements OnInit {
  @ViewChild('btnBack') btnBack:ElementRef;
  constructor(
    public global: Global,
    public aRouter: ActivatedRoute,
    public router: Router,
    public api: httpService,
    public fb: FormBuilder,
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
        console.log(res);
        this.onLoad = false;
        let status = res.Status;
        let self = this;
        if(status){
          let obj = res.Object;
          if(obj != null){
            this.global.setEntityName(this.entityName).campos.forEach(element => {
              Object.keys(obj).forEach(function(key,index) {
                if(key == element){
                  self.form.controls[key].setValue(obj[key]);
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
    //console.log(form);
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
