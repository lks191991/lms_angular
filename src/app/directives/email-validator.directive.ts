import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';
import {CommonService} from '../services/common.service';

@Directive({
  selector: '[email-validator]'
})
export class EmailValidatorDirective {
  private regexStr = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public type:any;
  constructor(private commonService: CommonService, private el: ElementRef) {

  }

  @HostListener('blur', ['$event.target.value'])
  
  onBlur(val: any) {
    this.type = this.el.nativeElement.title;
    this.commonService.removeDomElement(this.el.nativeElement,'warning');
    this.commonService.removeDomElement(this.el.nativeElement,'error');
    this.removeErrorMsg();
    if(!val){
      this.addErrorMsg("This field is required", "error")
    } else if(!this.regexStr.test(val)) {
      this.addErrorMsg("Please enter valid email address", "error")
    } else {
      this.removeErrorMsg();
    }
  }

  addErrorMsg(msg:any, cssClass:any) {
    this.commonService.addDomElement(this.el.nativeElement, cssClass, 'errorMsg', msg);
  }

  removeErrorMsg() {
    this.commonService.removeDomElement(this.el.nativeElement,'error');
  }
}
