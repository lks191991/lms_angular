import { Component, OnInit } from '@angular/core';
import {RegisterService} from '../../services/register.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {CommonService} from '../../services/common.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  public websiteDataLocal:any={}
  public otp:any = ''
  public otpScreen:boolean=false;
  public loginData:any = {
    email : '',
    password : '',
    remember : '',
  }
  public resetData:any = {
    otp : '',
    password : '',
  }
  public showLoading = false
  constructor(
    private register: RegisterService,
    private auth: AuthService,
    private router: Router,
    private commonService: CommonService,
    private toastr: ToastrService
    ) {
      if(this.auth.isLoggedIn){
        this.router.navigateByUrl('user-profile');
      }
     
  }
  
  public isLoading:Boolean = false;
  
  ngOnInit(): void {
 
  }

  forgetPassword(){
    let elementRefList = [];
    let errors = false;
    
    let emailNote:any = document.querySelector('#email');
    if(!this.loginData.email.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#email"));
    }
    else if(emailNote.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#email"), 'error')
    }
    
    
    if(errors) {
      elementRefList.forEach(v => {
        this.commonService.addDomElement(v, 'error', 'errorMsg', "This field is required");
      })
      return false;
    } else {
      this.showLoading = true;
      this.auth.forgotpassword(this.loginData).subscribe((res) => {
        this.showLoading = false;
        this.toastr.success(res.message);
        this.otpScreen = true
      },
      (error) => {
        this.toastr.error(error);
        this.showLoading = false;
      }
      )
    }

  }
  submitOTP(){
    let elementRefList = [];
    let errors = false;
    
    let otpNote:any = document.querySelector('#otp');
    if(!this.resetData.otp.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#otp"));
    }
    else if(otpNote.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#otp"), 'error')
    }
    let passwordNote:any = document.querySelector('#confirm-password');
    if(!this.resetData.password.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#confirm-password"));
    }
    else if(passwordNote.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#confirm-password"), 'error')
    }
    
    
    if(errors) {
      elementRefList.forEach(v => {
        this.commonService.addDomElement(v, 'error', 'errorMsg', "This field is required");
      })
      return false;
    } else {
      let datas = {
        otp : this.resetData.otp,
        password : this.resetData.password,
      }
      this.auth.resetPassword(datas).subscribe((data)=>{
        
        // this.otpScreen = false;
        this.toastr.success(data.message);
        this.router.navigateByUrl('/login');
      },
      (error) => {
        this.toastr.error(error);
        this.showLoading = false;
      }
      );
    }
  }

}
