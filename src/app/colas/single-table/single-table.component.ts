import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Global } from '../../global';
import { AdminTable } from '../../admin-table';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { fadeInAnimation } from '../../_animations';
import { tableSingle } from '../interfaces';
import { httpService } from '../../http.service';
import { setTimeout } from 'timers';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var $:any;

@Component({
  selector: 'app-single-table',
  templateUrl: './single-table.component.html',
  styleUrls: ['./single-table.component.scss'],
  animations: [fadeInAnimation]
})
export class SingleTableComponent implements OnInit {
  @Input() tableConfig: any;
  @ViewChild('ModalAdd') ModalAdd: ElementRef;
  @ViewChild('ModalAddAE') ModalAddAE: ElementRef;
  constructor(
  public global: Global,
  public aTable: AdminTable,
  public aRouter: ActivatedRoute,
  public router: Router,
  public api: httpService,
  public fb: FormBuilder
  ) {
      this.aRouter.params.subscribe( params => {
        this.entityName = params.entityname;
        ////console.log(this.entityName);
        this.getData(this.entityName);
        this.addModal = this.aTable.setEntityName(this.entityName).config.addModal;
        this.create = this.aTable.setEntityName(this.entityName).config.create;
        if (this.addModal) {
          this.btnNew = false;
        } else {
          this.btnNew = true;
        }
        if (!this.create) {
          this.btnNew = false;
        }
        this.getUser();
      } );
    }
  ngOnInit() { }
  entityName: string;
  data:any = {
    title:[],
    data:[],
    campos:[],
    filter:true,
    titleTable:this.entityName
  };
  page:number = 1;
  LastPage:number;
  arrayPage:any[] = [];
  CountItems:number = 0;
  btnNew:boolean = true;
  search:string = '';
  onLoad:boolean = false;
  inputs:any = [];
  addModal:boolean = false;
  create:boolean = false;
  filterLog:boolean = false;
  FromLog:string = '';
  ToLog:string = '';
  LevelLog:string = '';
  SourceLog:string = '';
  filterTable:any = [];
  filterTable2:any = [];
  strFilter:string = '';
  keyUp = (e) => {
    let keycode = e.keyCode;
    
    if(keycode == 13){
      this.global.saveLocal('Page', [this.entityName,1]);
      this.ArrayStrFilter();
      this.getData(this.entityName);
    } else {
      let filters = this.aTable.setEntityName(this.entityName).inputs;
      
      let a:any = [];
      this.filterTable2 = [];
      filters.forEach(i => {
        if (i.campo){
          let z = i.campo;
          let obj = {z:$('#'+ z +'_filter').val()};
          a[z] = $('#'+ z +'_filter').val();
          this.filterTable2.push(z);
        }       
      });
      this.filterTable = a; 
      }
      if(e.type == 'change'){
        this.global.saveLocal('Page', [this.entityName,1]);
        this.ArrayStrFilter();
        this.getData(this.entityName);
      }
  }
  ArrayStrFilter = () => {
    let strFilters:string = "";
    let len = this.filterTable2.length - 1;
    for(let i = 0;i <= len;i++){
      let propiedad = this.filterTable2[i];
      let value = this.filterTable[this.filterTable2[i]];
      if (value != ''){
        strFilters += propiedad + ":" + value + "|";
      }
    }
    strFilters = strFilters.substring(0, strFilters.length -1)
    this.strFilter = strFilters;
  }
  fnFilter = () => {
    let strn:string = this.strFilter;
    let strn2:any = strn.split("|");
    if(strn2 != ''){
      strn2.forEach((i,index) => {
        let pro = i.split(":");
        setTimeout(()=>{
          $("#"+ pro[0] + '_filter').val(pro[1]);
          this.filterActive = true;
        },10);
      });
    }
  }
  getData = (entityName:string, changePage?:boolean) => {
    this.onLoad = true;
    let rePage = this.global.getLocal('Page');
    //console.log(rePage);
    if(!changePage){
      if(rePage[0] == entityName){
        this.page = rePage[1];
        //console.log(rePage[0], entityName);
      } else {
        this.page = 1;
        this.strFilter = '';
      }
    }
    this.filterLog = this.aTable.setEntityName(this.entityName).config.filterLog;
    let path:string;
    if(this.filterLog){
      let from:string = this.FromLog;
      let to:string = this.ToLog;
      let level = this.LevelLog;
      let source = this.SourceLog;
      
      let filter:string = '';
      if (from != "") {
        filter += 'dateFrom:' + from + '|';
        //filter += 'dateFrom:' + from + '|';
        }
      if (to != '') {
        filter += 'dateTo:' + to + '|';
        //filter += 'dateTo:' + to + '|';
        }
      if (level != '') {
        filter += 'Level:' + level + '|';
        }
      if (source != '') {
        filter += 'Source:' + source + '|';
      }
      if (filter !== '') {
       filter = filter.substring(0, filter.length -1);
       path = 'api/WebServices/SelectRecord?sParamsIn={"strFilters": '+ JSON.stringify(filter) +' ,"Id": 0,"EntityName":"'+ entityName +'Client","page":'+ this.page +', "pageSize":'+ this.global.itemShow +'}';
      } else if(filter == ''){
        path = 'api/WebServices/SelectRecord?sParamsIn={"Id": 0,"EntityName":"'+ entityName +'Client","page":'+ this.page +', "pageSize":'+ this.global.itemShow +'}';
      }
    } else {
         if(this.strFilter != ''){
          path = 'api/WebServices/SelectRecord?sParamsIn={"strFilters": '+ JSON.stringify(this.strFilter) +' ,"Id": 0,"EntityName": "'+ entityName +'Client","page":'+ this.page +', "pageSize": '+ this.global.itemShow +'}';
         } else {
          path = 'api/WebServices/SelectRecord?sParamsIn={"Id": 0,"EntityName": "'+ entityName +'Client","page":'+ this.page +', "pageSize": '+ this.global.itemShow +'}';
         }
    }
    //let path:string = 'api/WebServices/SelectRecord?sParamsIn={"Id": 0,"EntityName": "'+ entityName +'Client","page":'+ this.page +', "pageSize": '+ this.global.itemShow +'}';
    //console.log(path);
    this.api.get(path).then((res:any) => {
      //console.log(res);
      this.onLoad = false;
      let status:boolean = res.Status;
      let self = this;
      if(status){
        this.global.saveLocal('Page', [entityName,this.page]);
        this.data.title = [];
        this.data.data = [];
        this.data.campos = [];
        this.LastPage = res.Object.LastPage;
        this.arrayPage = [];
        let object:any = res.Object;
        let listItems:any = object.ListItems;
        this.CountItems = object.CountItems;
        this.fnFilter();

        self.inputs = this.aTable.setEntityName(this.entityName).inputs;
        self.data.titleTable = this.aTable.setEntityName(entityName).titleTable;
        
        self.data.data = listItems;
        this.getPagination();
        if(self.inputs.length == 0){
          this.global.msj('La tabla "' + this.entityName + '" no esta configurada en "Admin-Tables.ts"','danger');
          this.btnNew = false;
          this.addModal = false;
        }  
        //console.log(self.data.data);
      } else {
        this.btnNew = false;
        this.addModal = false;
        this.data.title = [];
        this.data.data = [];
        this.data.campos = [];
        this.arrayPage = [];
        self.inputs = [];
        self.data.titleTable = '';
        console.log('Tabla no encontrada => ', self.inputs);
      }
    });
  }
  filterActive:boolean = false;
  clearFilter = () => {
    let strn:string = this.strFilter;
    let strn2:any = strn.split("|");
    if(strn2 != ''){
      strn2.forEach((i,index) => {
        let pro = i.split(":");
        setTimeout(()=>{
          $("#"+ pro[0] + '_filter').val('');
          this.filterActive = false;
          this.strFilter = '';
          this.getData(this.entityName);
        },10);
      });
    }
  }
  chageFormat = (_date,_format?,_delimiter?):any => {
    var formatLowerCase=_format.toLowerCase();
    var formatItems=formatLowerCase.split(_delimiter);
    var dateItems=_date.split(_delimiter);
    var monthIndex=formatItems.indexOf("mm");
    var dayIndex=formatItems.indexOf("dd");
    var yearIndex=formatItems.indexOf("yyyy");
    var month=parseInt(dateItems[monthIndex]);
    month-=1;
    var formatedDate;
    //var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
    if ((month + 1) < 10) {
      formatedDate = dateItems[yearIndex] + '0'+(month + 1) + dateItems[dayIndex];
    } else {
      formatedDate = dateItems[yearIndex] + (month + 1) + dateItems[dayIndex];
    }
    return formatedDate;
  }
  User:any = [];
  Usuario:any = {
    IdTipoUsuario:8,
    Username:'temporal'
  }
  UsuarioAE:any = {
    IdTipoUsuario:2,
    Nominativo:['', Validators.compose([Validators.required,Validators.minLength(3)])],
    Email:'',
    Telefono:'',
    TelInterno:''
  }
  formUsuarioAE = this.fb.group(this.UsuarioAE);
  public selected = (val) => {
    this.Usuario.Username = val.text;
  }
  public removed = (val) => {
    this.Usuario.Username = 'temporal';
  }
  getText = (id):string => {
    let cadena:string = '';
    this.User.forEach(element => {
      if(element.id == id){
        cadena = element.text;
      }
    });
    return cadena;
  }
  changeSelect = () => {
    this.Usuario.Username = 'temporal';
    let temp = this.Usuario.IdTipoUsuario;
    this.Usuario.IdTipoUsuario = 8;
    setTimeout(()=>{
      this.Usuario.IdTipoUsuario = temp;
    },1);
  }
  changeSelectAE = () => {

  }
  fnNewModal = ():void => {
    let idModal = this.ModalAdd.nativeElement.id;
    this.global.openModal(idModal);
  }
  fnNewModalAE = ():void => {
    let idModal = this.ModalAddAE.nativeElement.id;
    this.global.openModal(idModal);
  }
  submit = (obj:any, idModal:string) => {
    console.log(obj);
    this.api.addEntity('UsuarioClient', obj).then(res=>{
      console.log(res);
      let status = res.Status;
      if(status){
        this.global.msj('Guardado con éxito', 'success');
        this.global.closeModal(idModal);
        this.getData(this.entityName);
      } else {
        this.global.msj(res.Object, 'danger');
      }
    });
  }
  getUser = () => {
    let path:string = 'api/WebServices/SelectRecord?sParamsIn={"Id": 0,"EntityName": "UserClient","page":0, "pageSize": 1}'
    this.api.get(path).then((res)=>{
      let status:boolean = res.Status;
      //console.log(res);
      if(status){
        res.Object.ListItems.forEach(element => {
          this.User.push({id:element.Id,text:element.Username});
        });
      } 
    });
    //console.log(this.User);
  }
  show = (p,i) => {
    let dato:any = p + ' ' + i;
    this.data.data.forEach((val,index)=>{
      this.inputs.forEach((value,inde)=>{
          if(p == index && i == inde){
            dato = eval('val.' + value.campo);
          }
      });
    });
    return dato;
  }
  fnSelect = (obj) => {
    let state: string = this.router.routerState.snapshot.url;
    //console.log(state);
    this.router.navigate([state, obj.Id]);
  }
  getPage = (page) => {
  	this.page = page;
  	this.getData(this.entityName, true);
  }
  getPagination = () => {
  	let cont:number = 2;
  	let pActual:number = this.page;
  	for (var i = 1; i <= this.LastPage; i++) {
  		let v = (i - pActual);
  		if (v < 0) { v = v * (-1);}
  		if (v <= cont) {
  			this.arrayPage.push(i);
  		}
  	}
  }
  moverPage = (accion) => {
  	if (accion == 'next') {
  		this.page = this.calPage(accion);
  	}
  	if (accion == 'prev') {
  		this.page = this.calPage(accion);
  	}
  	this.getData(this.entityName, true);
  }
  calPage = (accion) => {
  	let pageTop = this.LastPage;
  	if (accion == 'next') {
	  	let pageResul = this.page + 1;
	  	if (pageResul > pageTop) {
	  		return pageTop;
	  	} else {
	  		return pageResul;
	  	}
  	}
  	if (accion == 'prev') {
	  	let pageResul = this.page - 1;
	  	if (pageResul < 1) {
	  		return 1;
	  	} else {
	  		return pageResul;
	  	}
  	}
  	
  }
}