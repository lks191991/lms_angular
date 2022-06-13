declare var $: any;
import { Component, OnInit,Input } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-modalbox',
  templateUrl: './modalbox.component.html',
  styleUrls: ['./modalbox.component.css']
})
export class ModalboxComponent implements OnInit {
  @Input() websiteDataLocal:any;
  public userLoggedIn = false
  constructor(
    private auth: AuthService,
    private router: Router,
    ) { }

  ngOnInit(): void {
    $.getScript('assets/js/custom.js');
    if(this.auth.isLoggedIn){
      this.userLoggedIn = true
    }
  }
  closeChat(sendTranscript:boolean = false){
    let userData = JSON.stringify(this.auth.getCurrentAuthUser);
    let currentParent = this.auth.getCurrentGlobalParent ? this.auth.getCurrentGlobalParent : ''
    
  }
  sendTranscript(){
    let currectUser = this.auth.getCurrentAuthUser;
    if(currectUser){
      console.log("currectUser",currectUser)
    }else{
      this.auth.logOut(true)
    }
  }

}
