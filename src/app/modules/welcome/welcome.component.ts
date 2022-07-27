import { Component, OnInit } from '@angular/core';
import {RegisterService} from '../../services/register.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { WindowRefService } from '../../services/window-ref.service';
import { ToastrService } from 'ngx-toastr';
import { DefaultService } from 'src/app/services/default.service';
import {environment} from '../../../environments/environment';
import {CommonService} from '../../services/common.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  providers: [WindowRefService]
})
export class WelcomeComponent implements OnInit {
  public websiteDataLocal:any='/'
  public sliders:any = []
  public homeCourses:any = []
  public homeCategories:any = []
  public homeReviews:any = []
  public imgUrl = environment.base_url
  public showLoading = false
  public newsletterEmail={
    email : '',
  }
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items:1
      }
    },
    nav: true
  }
  reviewcustomOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 2
      },
      940: {
        items:3
      },
	  1000: {
        items:3
      }
    },
    nav: true
  }
  constructor(
    private register: RegisterService,
    private auth: AuthService,
    private router: Router,
    private winRef: WindowRefService,
    private DefaultService: DefaultService,
    private commonService: CommonService,
    private toastr: ToastrService
    ) {
      this.DefaultService.getHomeSlider("").subscribe((data)=>{
        if(data && data.success){
          this.sliders = data.data;
        }else{
          this.sliders = [];
        }
      });
      this.DefaultService.getHomeCourses("").subscribe((data)=>{
        if(data && data.success){
          this.homeCourses = data.data;
        }else{
          this.homeCourses = [];
        }
      });
      this.DefaultService.homeReviews("").subscribe((data)=>{
        if(data && data.success){
          this.homeReviews = data.data;
        }else{
          this.homeReviews = [];
        }
      });
      this.DefaultService.getHomeCategories("").subscribe((data)=>{
        if(data && data.success){
          this.homeCategories = data.data;
        }else{
          this.homeCategories = [];
        }
      });
  }
  
  public isLoading:Boolean = false;
  
  ngOnInit(): void {
    
  }

  createNewsletter(){
    let elementRefList = [];
    let errors = false;

    
    let emailNote:any = document.querySelector('#newsletterEmail');
    if(!this.newsletterEmail.email.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#newsletterEmail"));
    } 
    else if(emailNote.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#newsletterEmail"), 'error')
    }
    
    
    if(errors) {
      elementRefList.forEach(v => {
        this.commonService.addDomElement(v, 'error', 'errorMsg', "This field is required");
      })
      return false;
    } else {
      this.showLoading = true;
      this.DefaultService.saveNewsletter(this.newsletterEmail).subscribe((res) => {
        this.showLoading = false;
        this.newsletterEmail.email = '';
        this.toastr.success(res.message);
      },
      (error) => {
        this.toastr.error(error);
        this.showLoading = false;
      }
      )
    }

  }

}
