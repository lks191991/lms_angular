import { Component, OnInit, Input } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {Router,ActivatedRoute} from '@angular/router';
import { RegisterService } from 'src/app/services/register.service';
import { DefaultService } from 'src/app/services/default.service';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() websiteDataLocal:any;
  public userLoggedIn = false
  public menus:any = []
  public publicSearchValue:any = ''
  public imgUrl = environment.base_url
  constructor(
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private register: RegisterService,
    private defaultService: DefaultService,
    private router: Router,
    ) { 
      let params: any = this.activatedRoute.snapshot.params;
      this.publicSearchValue = params.search
    }
    public userData:any = {}


  ngOnInit(): void {
    if(this.auth.isLoggedIn){
      this.userLoggedIn = true
      this.userData = this.auth.getCurrentAuthUser;
      //console.log(this.userData)
    }
    this.defaultService.getMenuItems("").subscribe((data)=>{
      if(data && data.success){
        this.menus = data.data;
      }else{
        this.menus = [];
      }
      
    });
  }
  logout(){
    this.auth.logOut()
  }
  searchCourses(){
    //this.router.navigate(['/courses/all/'+this.publicSearchValue])
    window.location.href = '/courses/all/'+this.publicSearchValue
  }
  status: boolean = false;
  clickEvent(){
      this.status = !this.status;       
  }
  statusMenu: boolean = false;
  openCloseMenu(){
      this.statusMenu = !this.statusMenu;       
  }

}
