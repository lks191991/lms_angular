import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';
import {CommonService} from '../services/common.service';

@Directive({
  selector: '[phone-validator]'
})
export class PhoneValidationDirective {

  constructor(private commonService: CommonService, private el: ElementRef) {}
  @HostListener('blur', ['$event.target.value'])
  onBlur(val:any) {
    if(!val) {
      this.addErrorMsg("This field is required")
    } else {
      if(isNaN(val)){
        this.addErrorMsg("Please enter valid phone number")
      }
      else if(val < 0){
        this.addErrorMsg("Please enter valid phone number")
      }
      else if(String(val).length > 20){
        this.addErrorMsg("Value must be less than 20")
      }
      else{
        this.removeErrorMsg();
      }
      
    }
  }

  addErrorMsg(msg: any) {
    this.commonService.addDomElement(this.el.nativeElement, 'error', 'errorMsg', msg);
  }

  removeErrorMsg() {
    this.commonService.removeDomElement(this.el.nativeElement,'error');
  }

}
