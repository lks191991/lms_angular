import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService,private router: Router){
  }
  canActivate() : Promise<boolean> {
    return new Promise((resolve, reject) => {
      if(this.auth.isLoggedIn){
        resolve(true);
      }else{
        this.auth.logOut();
        this.router.navigate(['/']);
        resolve(false);
      }
    });
  }
  
}
