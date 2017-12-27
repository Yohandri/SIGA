import { Component, OnInit, Input } from '@angular/core';
import { Global } from '../../global';
import { AdminTable } from '../../admin-table';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { fadeInAnimation } from '../../_animations';
import { tableSingle } from '../interfaces';
import { httpService } from "../../http.service";


@Component({
  selector: 'app-single-table',
  templateUrl: './single-table.component.html',
  styleUrls: ['./single-table.component.scss'],
  animations: [fadeInAnimation]
})
export class SingleTableComponent implements OnInit {
  @Input() tableConfig:any;
  constructor(
    public global: Global,
    public aTable: AdminTable,
  	public aRouter: ActivatedRoute,
    public router: Router,
    public api: httpService
  	) { 
      this.aRouter.params.subscribe( params => {
        //console.log(params);
        this.entityName = params.entityname;
        ////console.log(this.entityName);
        this.getData(this.entityName);
      } );
    }
  ngOnInit() {    
  }
  entityName:string;
  data:any = {
    title:[],
    data:[],
    campos:[],
    filter:false,
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
      }
    }
    let path:string = 'api/WebServices/SelectRecord?sParamsIn={"Id": 0,"EntityName": "'+ entityName +'Client","page":'+ this.page +', "pageSize": '+ this.global.itemShow +'}';
    ////console.log(path);
    this.api.get(path).then((res:any) => {
      //console.log(res);
      this.onLoad = false;
      let status:boolean = res.Status;
      let self = this;
      if(status){
        this.btnNew = true;
        this.global.saveLocal('Page', [entityName,this.page]);
        this.data.title = [];
        this.data.data = [];
        this.data.campos = [];
        this.LastPage = res.Object.LastPage;
        this.arrayPage = [];
        let object:any = res.Object;
        let listItems:any = object.ListItems;
        this.CountItems = object.CountItems;

        self.inputs = this.aTable.setEntityName(this.entityName).inputs;
        self.data.titleTable = this.aTable.setEntityName(entityName).titleTable;
        
        self.data.data = listItems;
        this.getPagination();      
        //console.log(self.data.data);
      } else {
        this.btnNew = false;
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