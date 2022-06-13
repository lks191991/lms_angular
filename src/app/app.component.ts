import { Component } from '@angular/core';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public globalClass:any;
  constructor(
    private auth: AuthService,
    ) {
      //document.querySelector('#mainBox')?.classList.add('uk_learn')
    }

  loadStripe() {
      
      if(!window.document.getElementById('stripe-script')) {
        var s = window.document.createElement("script");
        s.id = "stripe-script";
        s.type = "text/javascript";
        s.src = "https://checkout.stripe.com/checkout.js";
        window.document.body.appendChild(s);
      }
  }
 
  ngOnInit() {
    this.loadStripe();
    setTimeout(()=>{
      
    },3000)
  }
}
