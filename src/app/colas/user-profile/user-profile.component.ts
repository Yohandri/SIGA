import { Component, OnInit } from '@angular/core';
import { tableSingle } from '../interfaces';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      this.tableConfig= {
        title:["Campo 1","Campo 2"],
        data:["data 1","data 2"],
        filter:true,
        titleTable:"User profile"
      }
    }, 1000);
  }
  tableConfig:any;
}
