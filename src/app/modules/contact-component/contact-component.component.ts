import { Component, OnInit } from '@angular/core';
import {RegisterService} from '../../services/register.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DefaultService } from 'src/app/services/default.service';
import { CommonService } from 'src/app/services/common.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-contact-component',
  templateUrl: './contact-component.component.html',
  styleUrls: ['./contact-component.component.css']
})
export class ContactComponentComponent implements OnInit {

  public websiteDataLocal:any='contact-us'
  public content:any = {}
  public feedback:any = {
    your_name : '',
    email : '',
    mobile_number : '',
    message : '',
  }
  public courseImgPath:any = ''
  public showLoading = false
  constructor(
    private register: RegisterService,
    private auth: AuthService,
    private router: Router,
    private DefaultService: DefaultService,
    private commonService: CommonService,
    private toastr: ToastrService
    ) {
     
     
  }
  
  public isLoading:Boolean = false;
  
  ngOnInit(): void {
    this.DefaultService.getSettingContent().subscribe((data)=>{
      if(data && data.success){
        this.content = data.data;
      }else{
        this.content = {};
      }
    });
  }

  submitFeddback(){
    let elementRefList = [];
    let errors = false;
    this.feedback.your_name = this.commonService.stripScripts(this.feedback.your_name);
    this.feedback.email = this.commonService.stripScripts(this.feedback.email);
   
    let name:any = document.querySelector('#name');

    if(!this.feedback.your_name.trim()) {
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
    if(!this.feedback.email.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#email"));
    } 
    else if(emailNote.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#email"), 'error')
    }

    let phoneNumberNote:any = document.querySelector('#mobile_number');
    if(!this.feedback.mobile_number) {
      errors = true;
      elementRefList.push(document.querySelector("#mobile_number"));
    }
    else if(phoneNumberNote.parentElement.classList.contains('error')) {
      errors = true;
    }
     else {
      this.commonService.parentHasClassError(document.querySelector("#mobile_number"), 'error')
      
    }

    let messageNote :any = document.querySelector('#message');
    if(!this.feedback.message) {
      errors = true;
      elementRefList.push(document.querySelector("#message"));
    }
    else if(messageNote.parentElement.classList.contains('error')) {
      errors = true;
    }
     else {
      this.commonService.parentHasClassError(document.querySelector("#message"), 'error')
      
    }
    
    if(errors) {
      elementRefList.forEach(v => {
        this.commonService.addDomElement(v, 'error', 'errorMsg', "This field is required");
      })
      return false;
    } else {
      this.showLoading = true;
      this.DefaultService.contactEnquiry(this.feedback).subscribe((res) => {
        this.showLoading = false;
        this.feedback = {
          your_name : '',
          email : '',
          mobile_number : '',
          message : '',
        }
        this.toastr.success(res.message);
      },
      (error) => {
        console.log(error)
        this.toastr.error(error);
        this.showLoading = false;
      }
      )
    }
  }

}
