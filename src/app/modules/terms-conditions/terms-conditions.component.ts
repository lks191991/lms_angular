import { Component, OnInit } from '@angular/core';
import {RegisterService} from '../../services/register.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { DefaultService } from 'src/app/services/default.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.css']
})
export class TermsConditionsComponent implements OnInit {
  public websiteDataLocal:any={}
  public content:any = {}
  constructor(
    private register: RegisterService,
    private auth: AuthService,
    private DefaultService: DefaultService,
    private router: Router
    ) {
     
     
  }
  
  public isLoading:Boolean = false;
  
  ngOnInit(): void {
    this.DefaultService.getCMSPageContent(3).subscribe((data)=>{
      if(data && data.success){
        this.content = data.data;
      }else{
        this.content = [];
      }
    });
  }

}
