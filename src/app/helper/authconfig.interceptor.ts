import {Injectable,Injector} from '@angular/core';
import {HttpHandler, HttpInterceptor, HttpRequest,HttpEvent,HttpResponse} from '@angular/common/http';
import {AuthService} from '../services/auth.service';
import {RegisterService} from '../services/register.service';
import {environment} from '../../environments/environment';
import { Observable } from 'rxjs';
import { map, tap, catchError, filter, scan, switchMap } from 'rxjs/operators';

@Injectable()

export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService,private injector: Injector,private register: AuthService) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = this.authService.getAuthToken;
    const isLoggedIn = this.authService.isLoggedIn;
    
    const isApiUrl = req.url.startsWith(environment.url);
    //if (isLoggedIn && isApiUrl) {
    if (isLoggedIn) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`,
        }
      });
    }
    return next.handle(req).pipe(
        tap(evt => {
          //console.log(evt)
            if (evt instanceof HttpResponse) {
               let statusCode = evt.body.statusCode;
               if(statusCode === 404 || statusCode === 401){
                 this.authService.logOut()
                  //next.handle(req)
               }
            }
        }));
  }

  // intercept(req: HttpRequest<any>, next: HttpHandler) {

    
  //   return next.handle(req);
  // }
}
