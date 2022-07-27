import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, map, retry} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DefaultService {
  
  constructor(private http: HttpClient) { 

   
  }
  private baseUrl = environment.url;
  private baseApi = environment.base_api;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    })
  };
  getMenuItems(currentParent:any=''): Observable<any> {
    return this.http.get<any>(this.baseApi+'nav-course-menu', this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  getHomeSlider(currentParent:any=''): Observable<any> {
    return this.http.get<any>(this.baseApi+'home-slider', this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  getHomeCourses(currentParent:any=''): Observable<any> {
    return this.http.get<any>(this.baseApi+'home-page-course', this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  homeReviews(currentParent:any=''): Observable<any> {
    return this.http.post<any>(this.baseApi+'home-page-review',{}, this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  getHomeCategories(currentParent:any=''): Observable<any> {
    return this.http.get<any>(this.baseApi+'home-category', this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  getCMSPageContent(page:Number): Observable<any> {
    return this.http.get<any>(this.baseApi+'page/'+page, this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  getSettingContent(): Observable<any> {
    return this.http.get<any>(this.baseApi+'setting', this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  
  submitChatForm(data:any): Observable<any> {
    //this.httpOptions.headers.set('Content-Type', 'application/json; charset=utf-8');

    return this.http.post<any>(this.baseApi,data, this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  saveNewsletter(data:any): Observable<any> {
    data = convertData(data);
    return this.http.post<any>(this.baseApi+'save-newsletter',data, this.httpOptions)
      .pipe(map((res:any)=>{
        
        return res
      }))
  }
  contactEnquiry(data:any): Observable<any> {
    data = convertData(data);
    return this.http.post<any>(this.baseApi+'contact-us',data,this.httpOptions)
      .pipe(map((res:any)=>{
        
        return res
      }))
  }
  getCourses(data:any,page:Number): Observable<any> {
    data = convertData(data);
    return this.http.post<any>(this.baseApi+'all-courses?page='+page,data,this.httpOptions)
      .pipe(map((res:any)=>{
        
        return res
      }))
  }
  getCourseDetails(data:any,page:Number=1): Observable<any> {
    data = convertData(data);
    return this.http.post<any>(this.baseApi+'course-details?page='+page,data,this.httpOptions)
      .pipe(map((res:any)=>{
        
        return res
      }))
  }
  updateCourseView(data:any): Observable<any> {
    data = convertData(data);
    return this.http.post<any>(this.baseApi+'course-view-update',data,this.httpOptions)
      .pipe(map((res:any)=>{
        
        return res
      }))
  }
  updateVideoView(data:any): Observable<any> {
    data = convertData(data);
    return this.http.post<any>(this.baseApi+'video-view-update',data,this.httpOptions)
      .pipe(map((res:any)=>{
        
        return res
      }))
  }
  updateVideoProgress(data:any): Observable<any> {
    data = convertData(data);
    return this.http.post<any>(this.baseApi+'update-video-time',data,this.httpOptions)
      .pipe(map((res:any)=>{
        
        return res
      }))
  }
  getQuizes(data:any): Observable<any> {
    data = convertData(data);
    return this.http.post<any>(this.baseApi+'get-quiz',data,this.httpOptions)
      .pipe(map((res:any)=>{
        
        return res
      }))
  }
  getVideoWatchHistory(data:any): Observable<any> {
    data = convertData(data);
    return this.http.post<any>(this.baseApi+'favorite-flag',data,this.httpOptions)
      .pipe(map((res:any)=>{
        
        return res
      }))
  }
  myFavorites(): Observable<any> {
    return this.http.post<any>(this.baseApi+'my-favorites',{},this.httpOptions)
      .pipe(map((res:any)=>{
        
        return res
      }))
  }
  myQuizHistory(): Observable<any> {
    return this.http.post<any>(this.baseApi+'my-quiz-history',{},this.httpOptions)
      .pipe(map((res:any)=>{
        
        return res
      }))
  }
  quizSubmit(data:any): Observable<any> {
    data = convertData(data);
    return this.http.post<any>(this.baseApi+'quiz-submit',data,this.httpOptions)
      .pipe(map((res:any)=>{
        
        return res
      }))
  }
  myCourseDetails(data:any,currentPage:Number=1): Observable<any> {
    data = convertData(data);
    return this.http.post<any>(this.baseApi+'my-course-details?page='+currentPage,data,this.httpOptions)
      .pipe(map((res:any)=>{
        
        return res
      }))
  }
  wishlistFlaggedDetails(data:any): Observable<any> {
    data = convertData(data);
    return this.http.post<any>(this.baseApi+'favorite-flag',data,this.httpOptions)
      .pipe(map((res:any)=>{
        
        return res
      }))
  }
  saveRating(data:any): Observable<any> {
    data = convertData(data);
    return this.http.post<any>(this.baseApi+'give-rating',data,this.httpOptions)
      .pipe(map((res:any)=>{
        
        return res
      }))
  }
  reportVideo(data:any): Observable<any> {
    data = convertData(data);
    return this.http.post<any>(this.baseApi+'flag-video',data,this.httpOptions)
      .pipe(map((res:any)=>{
        
        return res
      }))
  }
  addtoWishlist(data:any): Observable<any> {
    data = convertData(data);
    return this.http.post<any>(this.baseApi+'favorite-video',data,this.httpOptions)
      .pipe(map((res:any)=>{
        
        return res
      }))
  }
}

function convertData(data:any){
  let httpParams = new HttpParams();
  Object.keys(data).forEach(function (key) {
      httpParams = httpParams.append(key, data[key]);
  });
  return httpParams.toString();
}
