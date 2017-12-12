import { Component, OnInit } from '@angular/core';
import {Global} from '../../global';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { fadeInAnimation } from '../../_animations';

@Component({
  selector: 'app-single-table',
  templateUrl: './single-table.component.html',
  styleUrls: ['./single-table.component.scss'],
  animations: [fadeInAnimation]
})
export class SingleTableComponent implements OnInit {

  constructor(
  	public global:Global,
  	public aRouter: ActivatedRoute,
  	public router: Router
  	) { }
  parametro:string = '';
  path:string = '';
  ngOnInit() {
  	this.parametro = this.aRouter.snapshot.paramMap.get('table');
  	this.setParametro();
  	this.setURL();
    
    console.log(this.parametro);
  }
  private setParametro = () => {
  	
  	// this.aRouter.params.subscribe(params => {
   //     this.parametro = params['table'];
   //  });
  }
  private setURL = () => {
  	this.global.colasListTable.forEach((val)=>{
  		if (val.table === this.parametro) {
  			this.path = val.Path;
  		}
  	});
  }

}