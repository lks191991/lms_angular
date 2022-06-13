import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router,ActivatedRoute} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { WindowRefService } from '../../services/window-ref.service';
import { DefaultService } from 'src/app/services/default.service';
import {environment} from '../../../environments/environment';
import {CommonService} from '../../services/common.service';


@Component({
  selector: 'app-courses-component',
  templateUrl: './courses-component.component.html',
  styleUrls: ['./courses-component.component.css'],
  providers: [WindowRefService]
})
export class CoursesComponentComponent implements OnInit {
  public imgUrl = environment.base_url
  public websiteDataLocal:any={}
  public courses:any = []
  public courseImgPath:any = ''
  public totalRecords = 0
  public totalPage = 0
  public currentPage = 1
  public paginationLinks:any = []
  public currentId:any = ''
  public showLoading:Boolean = false
  constructor(
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private router: Router,
    private winRef: WindowRefService,
    private DefaultService: DefaultService,
    private commonService: CommonService,
    private toastr: ToastrService
    ) {
     
     
  }
  
  public isLoading:Boolean = false;
  
  ngOnInit(): void {
    let params: any = this.activatedRoute.snapshot.params;
    let query: any = this.activatedRoute.snapshot.queryParams;
    this.currentPage = query && query.page ? Number(query.page) : 1;
    let categoryId = params.id
    this.currentId = params.id
    let search = params.search
    let sendData = {
      sub_category_id : categoryId && categoryId != 'all' ? categoryId : '',
      search : search ? search : '',
    }
    if(categoryId == 'all'){
      delete sendData.sub_category_id
    }
    if(!search){
      delete sendData.search
    }
    this.showLoading = true
    this.DefaultService.getCourses(sendData,this.currentPage).subscribe((data)=>{
      if(data && data.success){
        this.courses = data.data.data;
        this.totalRecords = data.data.total;
        this.totalPage = data.data.last_page;
        let links = data.data.links;
        links.map((item:any,index:Number)=>{
          if(index != 0 && index != (links.length-1)){
            this.paginationLinks.push(item)
          }
        })
      }else{
        this.courses = [];
      }
      this.showLoading = false
    });
  }

}
