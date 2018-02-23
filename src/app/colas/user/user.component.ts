import { Component, OnInit } from '@angular/core';
import {tableSingle} from '../interfaces';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  tableConfig:any = {
    "title":["Campo 1","Campo 2"],
    "data":["data 1","data 2"],
    "filter":true,
    "titleTable":"User"
  }

}
