import { Component, OnInit } from '@angular/core';
import { Guid } from 'guid-typescript';
import {RegisterService} from '../../services/register.service';
import {CommonService} from '../../services/common.service';
import {AuthService} from '../../services/auth.service';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public websiteDataLocal:any="register"
  public collegeName = environment.collegeName;
  public signUpdata={
    name : '',
    email : '',
    contact : '',
    password : '',
    agree : false,
    status : 1,
  }
  public showLoading = false

  constructor(
    private register: RegisterService,
    private auth: AuthService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private router: Router
    ) {
      if(this.auth.isLoggedIn){
        this.router.navigateByUrl('user-profile');
      }
      
  }
  
  public isLoading:Boolean = false;
  public searchingAgent:Boolean = false;
  
  ngOnInit(): void {
    //console.log("this.startChat",this.startChat)
    // this.auth.testApi(this.startChat).subscribe((res) => {
    //   console.log("api calling")
    //   console.log(res)
    // })
  }
  signup(){
    let elementRefList = [];
    let errors = false;
    this.signUpdata.name = this.commonService.stripScripts(this.signUpdata.name);
    this.signUpdata.email = this.commonService.stripScripts(this.signUpdata.email);
   
    let name:any = document.querySelector('#name');

    if(!this.signUpdata.name.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#name"));
    } 
    else if(name.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#name"), 'error')
    }

   
    let emailNote:any = document.querySelector('#email');
    if(!this.signUpdata.email.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#email"));
    } 
    else if(emailNote.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#email"), 'error')
    }

    let phoneNumberNote:any = document.querySelector('#contact');
    if(!this.signUpdata.contact) {
      errors = true;
      elementRefList.push(document.querySelector("#contact"));
    }
    else if(phoneNumberNote.parentElement.classList.contains('error')) {
      errors = true;
    }
     else {
      this.commonService.parentHasClassError(document.querySelector("#contact"), 'error')
      
    }

    let passwordNote :any = document.querySelector('#password');
    if(!this.signUpdata.password) {
      errors = true;
      elementRefList.push(document.querySelector("#password"));
    }
    else if(passwordNote.parentElement.classList.contains('error')) {
      errors = true;
    }
     else {
      this.commonService.parentHasClassError(document.querySelector("#password"), 'error')
      
    }

    if(!this.signUpdata.agree) {
      errors = true;
      elementRefList.push(document.querySelector("#agree"));
    } else {
      this.commonService.parentHasClassError(document.querySelector("#agree"), 'error')
    }
    if(errors) {
      elementRefList.forEach(v => {
        this.commonService.addDomElement(v, 'error', 'errorMsg', "This field is required");
      })
      return false;
    } else {
      this.showLoading = true;
      this.auth.signup(this.signUpdata).subscribe((res) => {
        this.showLoading = false;
        this.router.navigateByUrl('/user-profile');
      },
      (error) => {
        console.log(error)
        this.toastr.error(error);
        this.showLoading = false;
      }
      )
    }
    
  }
  generateGUID(){
    //bca68a9a-874d-443f-8328-8664e495b84d
    return  Guid.create().toString();
  }

}
