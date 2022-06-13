import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, map, retry} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private authTokenSubject: BehaviorSubject<any>;
  private websiteData: BehaviorSubject<any>;
  private currentAuthUser: BehaviorSubject<any>;
  constructor(private http: HttpClient) { 

    this.websiteData = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('websiteData') || 'null'));
    this.authTokenSubject = new BehaviorSubject<any>(localStorage.getItem('auth_token') || 'null');
    this.currentAuthUser = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('current_auth_user') || 'null'));
  }
  private baseUrl = environment.url;
  private baseApi = environment.base_api;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    })
  };

  get getAuthToken(): any {
    return localStorage.getItem('auth_token') || 'null'; 
  }
  get getRefreshTokenTime(): any {
    return JSON.parse(localStorage.getItem('refresh_token_time') || 'null'); 
  }
  get getCurrentAuthUser(): any {
    return JSON.parse(localStorage.getItem('current_auth_user') || 'null'); 
  }

  get isLoggedIn() {
    const authToken = this.authTokenSubject.value;
    console.log("authToken",authToken)
    if(authToken == 'null' || authToken == null){
      return false
    }
    return true
  }
  get getWebsiteData(): any {
    return this.websiteData.value
  }

}
