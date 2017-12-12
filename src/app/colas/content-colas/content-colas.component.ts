import { Component, OnInit } from '@angular/core';
import {Global} from '../../global';


@Component({
  selector: 'app-content-colas',
  templateUrl: './content-colas.component.html',
  styleUrls: ['./content-colas.component.scss']
})
export class ContentColasComponent implements OnInit {

  constructor(
  	public global:Global
  	) { }

  ngOnInit() {
  }

}
