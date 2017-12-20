import { Component, OnInit, Input } from '@angular/core';
import { Global } from '../../global';
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
  search:string = '';
  onLoad:boolean = false;
  getData = (entityName:string) => {
    this.onLoad = true;
    let path:string = 'api/WebServices/SelectRecord?sParamsIn={"Id": 0,"EntityName": "'+ entityName +'Client","page":'+ this.page +', "pageSize": '+ this.global.itemShow +'}';
    ////console.log(path);
    this.api.get(path).then((res:any) => {
      //console.log(res);
      this.onLoad = false;
      let status:boolean = res.Status;
      let self = this;
      if(status){
        this.data.title = [];
        this.data.data = [];
        this.data.campos = [];
        this.LastPage = res.Object.LastPage;
        this.arrayPage = [];
        let object:any = res.Object;
        let listItems:any = object.ListItems;
        self.data.campos = this.global.setEntityName(entityName).campos;
        self.data.title = this.global.setEntityName(entityName).title;
        self.data.titleTable = this.global.setEntityName(entityName).titleTable;
        self.data.data = listItems;
        this.getPagination();      
        //console.log(self.data.data);
      }
    });
  }
  show = (p,i) => {
    let dato:any = p + ' ' + i;
    this.data.data.forEach((val,index)=>{
      this.data.campos.forEach((value,inde)=>{
          if(p == index && i == inde){
            dato = eval('val.' + value);
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
  	this.getData(this.entityName);
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
  	this.getData(this.entityName);
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