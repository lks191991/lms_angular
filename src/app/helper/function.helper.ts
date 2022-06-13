import {Injectable, RendererFactory2} from '@angular/core';
import {Observable} from 'rxjs';
import {Router,ActivatedRoute,RoutesRecognized,NavigationEnd} from '@angular/router';
import {environment} from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError,map, retry } from 'rxjs/operators';





@Injectable()
export class HelperFunctions {
  public urlSnapShots;
  public baseUrl;
  

  constructor(
              private activatedRoute: ActivatedRoute,
              private http: HttpClient,
              ) {

                this.urlSnapShots = activatedRoute.snapshot;
                this.baseUrl = environment.url;
  }

  public onlyAlphabets(value:any) {

    var regex = /^[a-zA-Z]*$/;
    if (regex.test(value)) {
        return true;
    } else {
        return false;
    }
  }
  
} 
