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
        console.log(params);
        this.entityName = params.entityname;
        //console.log(this.entityName);
        this.getData(this.entityName);
      } );
    }
  ngOnInit() {    
  }
  entityName:string;
  data:tableSingle = {
    title:[],
    data:[],
    filter:false,
    titleTable:""
  };
  getData = (entityName:string) => {
    this.data.title = [];
    this.data.data = [];
    let path:string = 'api/WebServices/SelectRecord?sParamsIn={"Id": 0,"EntityName": "'+ entityName +'Client","page":0, "pageSize":1}';
    //console.log(path);
    this.api.get(path).then((res:any) => {
      console.log(res);
      let status:boolean = res.Status;
      let self = this;
      if(status){
        let object:any = res.Object;
        let listItems:any = object.ListItems;
        self.data.title = this.setEntityName(entityName);
        self.data.data = listItems;
        console.log(self.data.data);
      }
    });
  }
  setEntityName = (entityname):any[string] => {
    if(entityname == 'UserProfile'){
      return ['Id','Name','Description'];
    }else if(entityname == 'User'){
      return ['Id','Code','Username','IdentityCard','Name','LastName','UserProfileName'];
    }
  }
  show = (p,i) => {
    let dato:any = p + ' ' + i;
    this.data.data.forEach((val,index)=>{
      this.data.title.forEach((value,inde)=>{
          if(p == index && i == inde){
            dato = eval('val.' + value);
          }
      });
    });
    return dato;
  }
}