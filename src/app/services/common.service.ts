import { ElementRef, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
//import {HelperFunctions} from '../helpers/function.helper';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2,
              //private helperFunctions: HelperFunctions
              ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }
  capitaliseFirstLetterStr(str:string) {
    return str.toLowerCase().substring(0,1).toUpperCase() + str.toLowerCase().substring(1,str.length);
  }

  addDomElement(el:any, parentClass:string, elClass:string, msg:string) {
    this.removeDomElement(el, parentClass);
    this.renderer.addClass(el.parentElement, parentClass);
    const sp: HTMLSpanElement = this.renderer.createElement('span');
    sp.innerText = msg;
    this.renderer.addClass(sp, elClass);
    this.renderer.appendChild(el.parentElement, sp);
  }

  removeDomElement(el:any, parentClass:string) {
    if(el.parentElement.classList.contains(parentClass)) {
      this.renderer.removeClass(el.parentElement, parentClass);
      const sp: HTMLSpanElement = el.parentElement.querySelector('span.errorMsg');
     
      this.renderer.removeChild(el.parentElement, sp);
    }
  }

  parentHasClassError(el:any, parentClass:any) {
     return el.parentElement.classList.contains(parentClass)
  }

  copyToClipboard(value:any) {
    const e = document.createElement('textarea');
    e.style.position = 'fixed';
    e.style.left = '0';
    e.style.top = '0';
    e.style.opacity = '0';
    e.value = value;
    document.body.appendChild(e);
    e.focus();
    e.select();
    document.execCommand('copy');
    document.body.removeChild(e);
  }
  stripScripts(s:any) {
    var div = document.createElement('div');
    div.innerHTML = s;
    let output:any = ''
    var scripts:any = div.getElementsByTagName('script');
    var i = scripts.length;
    while (i--) {
      scripts[i].parentNode.removeChild(scripts[i]);
    }
    output = div.innerHTML
    return output;
  }
}
