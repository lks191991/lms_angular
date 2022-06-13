import { Component, OnInit } from '@angular/core';
import {RegisterService} from '../../services/register.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  public websiteDataLocal:any='blog'
  public courses:any = []
  public courseImgPath:any = ''
  constructor(
    private register: RegisterService,
    private auth: AuthService,
    private router: Router
    ) {
     
     
  }
  
  public isLoading:Boolean = false;
  
  ngOnInit(): void {
 
  }
}
