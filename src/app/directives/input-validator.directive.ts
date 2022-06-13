import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';
import {CommonService} from '../services/common.service';


@Directive({
  selector: '[input-validator]'
})
export class InputValidatorDirective {
  constructor(private commonService: CommonService, private el: ElementRef) {}
  @HostListener('blur', ['$event.target.value'])
  onBlur(val: any) {
    if(!val) {
      this.addErrorMsg("This field is required")
    } else {
      if(val.trim().length > 50){
        this.addErrorMsg("Value must be less than 50 characters")
      }else{
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
