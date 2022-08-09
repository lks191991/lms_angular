import { Component, OnInit, Input } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {BroadcastingService} from '../../../services/broadcasting.service';
import {Router} from '@angular/router';
import {RegisterService} from '../../../services/register.service';
import { DefaultService } from 'src/app/services/default.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  public userLoggedIn:Boolean = false;
  public agentStatusObject:any
  public localData:any
  @Input() websiteDataLocal:any;
  @Input() searchingAgent:any;
  @Input() isWelcomeScreen:Boolean=false;
  public userLocalStorage:any;
  public categories:any;
  public content:any = {}
  public footerCLsss=''
  //public isWelcomeScreen:Boolean = false;
  constructor(
    private auth: AuthService,
    private broadcastingservice: BroadcastingService,
    private register: RegisterService,
    private DefaultService: DefaultService,
    private router: Router
    ) {
      if(this.auth.isLoggedIn){
        this.userLoggedIn = true
      }
      this.userLocalStorage = this.auth.getCurrentAuthUser;
      // this.register.getCategoriesList(this.auth.getCurrentGlobalParent)
      //   .subscribe((data)=>{
      //      this.categories =data.data;
      //     // this.localData =data;
      //   });
      if(this.router.url == '/'){
        this.footerCLsss = 'footer--two'
      }
      //console.log("this.router.url",this.router.url)
      

    }

  ngOnInit(): void {
    this.DefaultService.getSettingContent().subscribe((data)=>{
      if(data && data.success){
        this.content = data.data;
      }else{
        this.content = {};
      }
    });
  }
  

}
