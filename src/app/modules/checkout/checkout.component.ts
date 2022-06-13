import { Component, OnInit } from '@angular/core';
import {RegisterService} from '../../services/register.service';
import {AuthService} from '../../services/auth.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { WindowRefService } from '../../services/window-ref.service';
import { ToastrService } from 'ngx-toastr';
import { DefaultService } from 'src/app/services/default.service';
import {environment} from '../../../environments/environment';
import {CommonService} from '../../services/common.service';
import Player from '@vimeo/player';
let player: Player;
declare const window: any
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  public imgUrl = environment.base_url
  public websiteDataLocal:any={}
  public courseData:any={}
  public checkoutData:any={}
  public coupon = '';
  public courseId = '';
  public couponApplied:boolean=false;
  public emptyCoponError:boolean=false;
  public couponErrorMsg:string='';
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private register: RegisterService,
    private auth: AuthService,
    private router: Router,
    private winRef: WindowRefService,
    private DefaultService: DefaultService,
    private commonService: CommonService,
    private toastr: ToastrService
    ) {
      let params: any = this.activatedRoute.snapshot.params;
      let courseId = params.id
      let coupon = params.coupon
      this.coupon = coupon ? coupon : ''
      this.courseId = courseId;
      let sendData = {
        course_id : courseId,
        code : this.coupon,
      }
      this.auth.getCheckoutDetails(sendData).subscribe((data)=>{
        if(data && data.success){
          this.courseData = data.data.courseDetails;
          this.checkoutData = data.data;
        }
      },
      (error) => {
        console.log(error)
        this.toastr.error(error);
        setTimeout(()=>{
          this.router.navigateByUrl('/user-profile')
        },2000)
      }
      );
  }
  
  public isLoading:Boolean = false;
  handler:any = null;
  ngOnInit(): void {
    this.couponApplied = false;
    this.loadStripe();
  }

  applyCoupon(isApplied:boolean):any{
    if(this.coupon !=""){
      let sendData = {
        course_id : this.courseId,
        code : this.coupon,
      }
      if(isApplied == false){
        sendData.code = '';
        this.coupon = '';
        this.couponApplied = false;
      }
      
      this.auth.getCheckoutDetails(sendData).subscribe((data)=>{
        if(data && data.success){
          this.checkoutData = data.data;
          if(this.coupon != ''){
            this.couponApplied = true;
            this.couponErrorMsg = '';
          }
        }
      },
      (error) => {
        this.couponErrorMsg = error;
      }
      );
    }else{
      this.emptyCoponError = true;
    }
  }

  pay():any{
    let amount = this.checkoutData.price;
    var handler = (window).StripeCheckout.configure({
      key: environment.stripeKey,
      locale: 'auto',
      token: (token: any) => {
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
        this.processPayment(token)
      }
    });
  
    handler.open({
      name: environment.collegeName,
      amount: amount * 100,
      //currency: 'usd'
    });
  }
  
  loadStripe() {
      
    if(!window.document.getElementById('stripe-script')) {
      var s = window.document.createElement("script");
      s.id = "stripe-script";
      s.type = "text/javascript";
      s.src = "https://checkout.stripe.com/checkout.js";
      s.onload = () => {
        this.handler = (window).StripeCheckout.configure({
          key: environment.stripeKey,
          locale: 'auto',
          token: function (token: any) {
            // You can access the token ID with `token.id`.
            // Get the token ID to your server-side code for use.
            console.log(token)
            alert('Payment Success!!');
          }
        });
      }
        
      window.document.body.appendChild(s);
    }
  }

  processPayment(token:any):any{
    let amount = this.checkoutData.price;
    let couponCode = this.coupon;
    let sendData = {
      course_id : this.courseId,
      finalAmount : amount,
      stripe_token : token.id,
      stripe_email : token.email,
      code : couponCode,
    }
    this.auth.processPayment(sendData).subscribe((data:any)=>{
      if(data && data.success){
        this.toastr.success(data.message);
        setTimeout(()=>{
          this.router.navigateByUrl('/user-profile')
        },2000)
      }else{
        this.toastr.error(data.message);
      }
    },
    (error:any) => {
      this.toastr.error(error);
    }
    );
  }

}
