import { Component, OnInit } from '@angular/core';
import { Global } from '../../global';
import { Router } from '@angular/router';


@Component({
  selector: 'app-content-colas',
  templateUrl: './content-colas.component.html',
  styleUrls: ['./content-colas.component.scss']
})
export class ContentColasComponent implements OnInit {

  constructor(
    public global:Global,
    public aRouter: Router
  	) { 
      this.title = this.aRouter.url.split('/')[1];
    }

  ngOnInit() {
  }
  title:string = '';
}
