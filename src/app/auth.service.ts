import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

@Injectable()
export class AuthService {
  isLoggedIn = false;
  constructor() {
  	let l:number = this.getLocal('Login');
	if (l == 0) {
		this.isLoggedIn = false;
	} else {
		this.isLoggedIn = true;
	}
	//console.log(this.isLoggedIn);
  }

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  login(): Observable<boolean> {
  		return Observable.of(true).delay(100).do(val => this.isLoggedIn = true )
  }

  logout(): void {
    this.isLoggedIn = false;
  }
  public getLocal(collection) {
		let data = localStorage.getItem(collection);
		if (data == null || data == '{}') {
			return 0
		} else {
			return 1;
		}
	}
}