import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
//import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router : Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):  boolean {
      if (localStorage.getItem('userToken') != null)
      return true;
      this.router.navigateByUrl('/login');
      //this.navCtrl.push(LoginPage);
      return false;
  }
}
