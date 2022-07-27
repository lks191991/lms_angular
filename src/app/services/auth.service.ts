import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable,PLATFORM_ID,Inject } from '@angular/core';
import {Router} from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, map, retry} from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.url + '/api';
  private baseApi = environment.base_api;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      //'Access-Control-Allow-Origin': '*',
    })
  };
  private authTokenSubject: BehaviorSubject<any>;
  private websiteData: BehaviorSubject<any>;
  private currentAuthUser: BehaviorSubject<any>;
  constructor(private http: HttpClient, private router: Router,@Inject(PLATFORM_ID) private platformId: Object) {
    this.websiteData = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('websiteData') || 'null'));
    this.authTokenSubject = new BehaviorSubject<any>(localStorage.getItem('auth_token'));
    this.currentAuthUser = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('current_auth_user') || 'null'));
  }
  get getToken(): any {
    let token:any;
		let tokenExpireTime:any;
		if(isPlatformBrowser(this.platformId)) {
			let  userToken =  localStorage.getItem('auth_token');
      
			if (typeof userToken != 'undefined' && userToken != null) {		    			
				token	=	userToken;
			}
			tokenExpireTime	=		 localStorage.getItem('refresh_token_time'); 
		}
		
		let  curentTime			= 		new Date().getTime();
		let  isTokenExpired:boolean = true;
		if(tokenExpireTime < curentTime && token != '' && token != null)
		{
			isTokenExpired  = true;
		}
    return token
		if (!isTokenExpired) {
			return token
		}
		return this.refreshTokenData();

    //return this.authTokenSubject.value;
  }
  refreshTokenData() {
    // append refresh token if you have one
    let refreshToken      = localStorage.getItem('refresh_token'); 
    let refreshTokenTime  = Number(localStorage.getItem('refresh_token_time')); 
    let authToken         = localStorage.getItem('auth_token');
    var currentTimeStamp       = new Date().getTime();

    if(currentTimeStamp > refreshTokenTime){
      let sendData={
        refreshToken : refreshToken,
        authToken : authToken,
      }
      return this.http.post<any>(this.baseUrl+'/refresh_token', sendData,this.httpOptions).toPromise().then(res => {
        if(res.success == true){
          let currentTime = new Date();
          currentTime.setSeconds(currentTime.getSeconds() + (res.data.tokenExpirationTimeSec-120));
          //currentTime.setSeconds(currentTime.getSeconds() + 300);
          let  tokenExpireTime:any			= 		new Date(currentTime).getTime();
          localStorage.setItem('auth_token', JSON.stringify(res.data.token));
          localStorage.setItem('refresh_token', JSON.stringify(res.data.refreshToken));
          localStorage.setItem('refresh_token_time', tokenExpireTime);
          this.authTokenSubject.next(res.data.token);
        }
        return res
      })
    }
  }
  get getRefreshToken(): any {
    return localStorage.getItem('refresh_token'); 
  }
  get getAuthToken(): any {
    return localStorage.getItem('auth_token'); 
  }
  get getRefreshTokenTime(): any {
    return localStorage.getItem('refresh_token_time'); 
  }
  get getCurrentAuthUser(): any {
    return JSON.parse(localStorage.getItem('current_user') || 'null'); 
  }
  get isLoggedIn() {
    const authToken = this.authTokenSubject.value;
    return authToken != null;
  }
  get getWebsiteData(): any {
    return this.websiteData.value
  }
  login(data:any): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post<any>(this.baseApi+'login',data, httpOptions)
      .pipe(map((res:any)=>{
        if(res && res.success){
          let tokenResponse = res.data.TokenAndRefreshToken.original;
          let user = {
            email : res.data.email,
            name : res.data.name,
            image : res.data.image,
          };
          localStorage.setItem('current_user', JSON.stringify(user));
          localStorage.setItem('auth_token', tokenResponse.access_token);
          this.currentAuthUser.next(user);
          this.authTokenSubject.next(tokenResponse.access_token);
        }
        return res
      }))
  }
  forgotpassword(data:any): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post<any>(this.baseApi+'forgotpassword',data, httpOptions)
      .pipe(map((res:any)=>{
        return res
        
      }))
  }
  resetPassword(data:any): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post<any>(this.baseApi+'reset-password',data, httpOptions)
      .pipe(map((res:any)=>{
        return res
        
      }))
  }
  signup(data:any): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post<any>(this.baseApi+'register',data, httpOptions)
      .pipe(map((res:any)=>{
        if(res && res.success){
          localStorage.setItem('current_user', JSON.stringify(res.data));
          localStorage.setItem('auth_token', res.data.token);
          this.currentAuthUser.next(res.data);
          this.authTokenSubject.next(res.data.token);
        }
        return res
      }))
  }
  tutorSignup(data:any): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post<any>(this.baseApi+'tutor-register',data, httpOptions)
      .pipe(map((res:any)=>{
        
        return res
      }))
  }
  logOut(deleteCurrentUser:boolean=true){
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    this.getLogOut(deleteCurrentUser).then((data) => {
    }).catch((err) => {
      console.log(err);
    });
  }
  getProfileDetails(): Observable<any> {
    let token = this.getAuthToken;
    return this.http.get<any>(this.baseApi+'profile', this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  updateProfile(data:any): Observable<any> {
    data = convertData(data);
    return this.http.post<any>(this.baseApi+'change-profile',data, this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  updatePassword(data:any): Observable<any> {
    data = convertData(data);
    return this.http.post<any>(this.baseApi+'change_password',data, this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  updateProfilePhoto(image:File): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
      })
    };
    const formData = new FormData();

    formData.append('image', image);
    return this.http.post<any>(this.baseApi+'change-profile-image',formData,httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  getCheckoutDetails(data:any): Observable<any> {
    data = convertData(data);
    return this.http.post<any>(this.baseApi+'checkout',data,this.httpOptions)
      .pipe(map((res:any)=>{
        
        return res
      }))
  }
  processPayment(data:any): Observable<any> {
    data = convertData(data);
    return this.http.post<any>(this.baseApi+'payment',data,this.httpOptions)
      .pipe(map((res:any)=>{
        
        return res
      }))
  }
  getMyTransactions(): Observable<any> {
    let token = this.getAuthToken;
    return this.http.post<any>(this.baseApi+'my-payment', this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  getMyCourses(): Observable<any> {
    let token = this.getAuthToken;
    return this.http.post<any>(this.baseApi+'my-courses', this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  getCompletedCourses(): Observable<any> {
    let token = this.getAuthToken;
    return this.http.post<any>(this.baseApi+'my-completed-courses', this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  private getLogOut(deleteCurrentUser:boolean=true) {
    return new Promise(resolve => {
      this.authTokenSubject.next(null);
      this.websiteData.next(null);
      this.currentAuthUser.next(null);
      window.location.href= '/login'
      
      resolve("done");
    })
  }

  setGlobalParent(data:any){
    localStorage.setItem('current_global_parent', data);
  }
  
}
function convertData(data:any){
  let httpParams = new HttpParams();
  Object.keys(data).forEach(function (key) {
      httpParams = httpParams.append(key, data[key]);
  });
  return httpParams.toString();
}

