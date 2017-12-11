import { Injectable }     from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
}                           from '@angular/router';
import { AuthService }      from './auth.service';
import { Global } from './global';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private authService: AuthService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    return this.checkLogin(url);
  }
  checkLogin(url: string): boolean {
    //console.log('Login: ' + this.authService.isLoggedIn);
    if (this.authService.isLoggedIn) { 
    	this.authService.redirectUrl = url;
    	return true;
    } else{
    	this.router.navigate(['/']);
    	return false;
    }   
    
  }
}
@Injectable()
export class TypeUserGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router,public global:Global) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    let typeUserId:number = this.global.getLocal('User').UserProfileId;
    return this.check(url,typeUserId);
  }
  check(url: string,Id): boolean {
    //console.log('Login: ' + this.authService.isLoggedIn);
    if (this.authService.isLoggedIn) {
      if (Id !== 1) {
         return false;
       }else {
         return true;
       }     
    } else{
      this.router.navigate(['/']);
      return false;
    }   
    
  }
}