import { Component, OnInit } from '@angular/core';
import {RegisterService} from '../../services/register.service';
import {AuthService} from '../../services/auth.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { WindowRefService } from '../../services/window-ref.service';
import { ToastrService } from 'ngx-toastr';
import {environment} from '../../../environments/environment';
import {CommonService} from '../../services/common.service';
import {DefaultService} from '../../services/default.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  public websiteDataLocal:any={}
  public userData:any = {
    name : '',
    email : '',
    contact : '',
    type : '',
  };
  public imgUrl = environment.base_url
  public confirmPassword  = "";
  public password = "";
  public oldPassword  = "";
  public userProfilePic = '';
  public transactions:any = []
  public myCourses:any = []
  public completedCourses:any = []

  public totalRecordsMyCourse = 0
  public totalPageMyCourse = 0
  public currentPageMyCourse = 1
  public paginationLinksMyCourse:any = []
  public currentIdMyCourse:any = ''

  public myFavVideos:any = []
  public myQuizHistory:any = []
  public isLoading = false;
  constructor(
    private register: RegisterService,
    private auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private winRef: WindowRefService,
    private commonService: CommonService,
    private DefaultService: DefaultService,
    private toastr: ToastrService
    ) {
      
      this.auth.getProfileDetails().subscribe((data)=>{
       this.userData = data.data;
       this.userData.name = data.data && data.data.name ? data.data.name : '';
       this.userData.email = data.data && data.data.email ? data.data.email : '';
       this.userData.contact = data.data && data.data.contact ? data.data.contact : '';
       this.userData.type = data.data && data.data.type ? data.data.type : '';
       this.userProfilePic = data.data && data.data.image ? this.imgUrl+'uploads/users/'+data.data.image : './assets/dist/images/avtar.png';
      });

      this.auth.getMyTransactions().subscribe((data)=>{
        this.transactions = data.data.data;
      });
      this.auth.getMyCourses().subscribe((data)=>{
        this.myCourses = data.data.data;
        this.totalRecordsMyCourse = data.data.total;
        this.totalPageMyCourse = data.data.last_page;
        let links = data.data.links;
        links.map((item:any,index:Number)=>{
          if(index != 0 && index != (links.length-1)){
            this.paginationLinksMyCourse.push(item)
          }
        })
      });
      this.auth.getCompletedCourses().subscribe((data)=>{
        this.completedCourses = data.data;
        
      });
      this.DefaultService.myFavorites().subscribe((data)=>{
        if(data && data.success){
          this.myFavVideos = data.data.data
        }
      })
      this.DefaultService.myQuizHistory().subscribe((data)=>{
        if(data && data.success){
          this.myQuizHistory = data.data.data
        }
      })
  }
  
  public showLoading:Boolean = false;
  
  ngOnInit(): void {
 
  }

  addtoWishlist(course_id:any,video_id:any){
    this.isLoading = true
    let sendData = {
      video_id : video_id,
      course_id : course_id,
    }
    this.DefaultService.addtoWishlist(sendData).subscribe((data)=>{
      this.isLoading = false
      if(data && data.success){
        this.toastr.success(data.message);
        this.DefaultService.myFavorites().subscribe((dataFav)=>{
          if(dataFav && dataFav.success){
            this.myFavVideos = dataFav.data.data
          }
        })
      }
    },
    (error) => {
      this.isLoading = false
      console.log(error)
      this.toastr.error(error);
    });
    
  }

  logout(){
    this.auth.logOut()
  }

  updateProfile(){
    let elementRefList = [];
    let errors = false;
    this.userData.name = this.commonService.stripScripts(this.userData.name);
    this.userData.contact = this.commonService.stripScripts(this.userData.contact);
   
    let name:any = document.querySelector('#fname');

    if(!this.userData.name.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#fname"));
    } 
    else if(name.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#fname"), 'error')
    }
    if(!this.userData.contact.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#pnumber"));
    } 
    else if(name.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#pnumber"), 'error')
    }
    if(errors) {
      elementRefList.forEach(v => {
        this.commonService.addDomElement(v, 'error', 'errorMsg', "This field is required");
      })
      return false;
    } else {
      this.showLoading = true;
      this.auth.updateProfile(this.userData).subscribe((res) => {
        this.showLoading = false;
        //this.router.navigateByUrl('/user-profile');
        this.toastr.success(res.message, '');
      },
      (error) => {
        console.log(error)
        this.toastr.error(error);
        this.showLoading = false;
      }
      )
    }
  }
  updatePassword(){
    let elementRefList = [];
    let errors = false;
    this.oldPassword = this.commonService.stripScripts(this.oldPassword);
    this.password = this.commonService.stripScripts(this.password);
    this.confirmPassword = this.commonService.stripScripts(this.confirmPassword);
   
    let oldPassword:any = document.querySelector('#oldPassword');
    let password:any = document.querySelector('#password');
    let confirmPassword:any = document.querySelector('#confirmPassword');

    if(!this.oldPassword.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#oldPassword"));
    } 
    else if(oldPassword.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#oldPassword"), 'error')
    }

    if(!this.password.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#password"));
    } 
    else if(password.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#password"), 'error')
    }

    if(!this.confirmPassword.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#confirmPassword"));
    } 
    else if(confirmPassword.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#confirmPassword"), 'error')
    }
    if(errors) {
      elementRefList.forEach(v => {
        this.commonService.addDomElement(v, 'error', 'errorMsg', "This field is required");
      })
      return false;
    } else {
      this.showLoading = true;
      let sendTata = {
        oldPassword : this.oldPassword,
        password : this.password,
        confirmPassword : this.confirmPassword,
      }
      this.auth.updatePassword(sendTata).subscribe((res) => {
        this.showLoading = false;
        //this.router.navigateByUrl('/user-profile');
        this.toastr.success(res.message, '');
      },
      (error) => {
        console.log(error)
        this.toastr.error(error);
        this.showLoading = false;
      }
      )
    }
  }
  changeProfilePhoto(event:any){
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      this.auth.updateProfilePhoto(file).subscribe((res) => {
        this.showLoading = false;
        //this.router.navigateByUrl('/user-profile');
        this.userProfilePic = res.data.image
        this.toastr.success(res.message, '');
      },
      (error) => {
        console.log(error)
        this.toastr.error(error);
        this.showLoading = false;
      }
      )
    }else{
      this.toastr.error('Please select image', '');
    }
  }
}
