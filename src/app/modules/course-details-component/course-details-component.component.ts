import { Component, OnInit,ViewChildren } from '@angular/core';
import {RegisterService} from '../../services/register.service';
import {AuthService} from '../../services/auth.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { WindowRefService } from '../../services/window-ref.service';
import { ToastrService } from 'ngx-toastr';
import { DefaultService } from 'src/app/services/default.service';
import {environment} from '../../../environments/environment';
import {CommonService} from '../../services/common.service';
import Player from "@vimeo/player";

@Component({
  selector: 'app-course-details-component',
  templateUrl: './course-details-component.component.html',
  styleUrls: ['./course-details-component.component.css'],
  providers: [WindowRefService]
})
export class CourseDetailsComponentComponent implements OnInit {
  private player: Player | undefined;
  @ViewChildren('player_container') playerContainer: any;
  public currentVimeoId:any = '';
  public imgUrl = environment.base_url
  public websiteDataLocal:any={}
  public courseData:any={}
  public enrollCount:Number=0
  public courses:any = []
  public reviews:any = []
  public cariculam:any = []
  public courseImgPath:any = ''
  public totalRecords = 0
  public totalPage = 0
  public currentPage = 1
  public paginationLinks:any = []
  public courseId:any = '';
  constructor(
    private activatedRoute: ActivatedRoute,
    private register: RegisterService,
    private auth: AuthService,
    private router: Router,
    private winRef: WindowRefService,
    private DefaultService: DefaultService,
    private commonService: CommonService,
    private toastr: ToastrService
    ) {
      let params: any = this.activatedRoute.snapshot.params;
      let courseId = params.id
      this.courseId = courseId
      let sendData = {
        course_id : courseId
      }
      this.DefaultService.getCourseDetails(sendData,this.currentPage).subscribe((data)=>{
        if(data && data.success){
          this.courseData = data.data.course;
          this.enrollCount = data.data.enrolled;
          this.currentVimeoId = this.getVimeoId(this.courseData.demo_url);
          this.watchVideo(this.courseData.demo_url);
          let reviewData = data.data.review;
          this.reviews = data.data.review.data;
          this.totalRecords = reviewData.total;
          this.totalPage = reviewData.last_page;
          let links = reviewData.links;
          links.map((item:any,index:Number)=>{
            if(index != 0 && index != (links.length-1)){
              this.paginationLinks.push(item)
            }
          })
        }
      },
      (error) => {
        console.log(error)
        this.toastr.error(error);
        this.router.navigateByUrl('/')
      }
      );
      this.DefaultService.updateCourseView(sendData).subscribe((data)=>{
      })
  }
  
  public isLoading:Boolean = false;
  
  ngOnInit(): void {
  }

  loadMoreReviews(){
    this.currentPage = this.currentPage+1

    let sendData = {
      course_id : this.courseId,
    }
    this.DefaultService.getCourseDetails(sendData,this.currentPage).subscribe((data)=>{
      if(data && data.success){
        let reviewData = data.data.review;
        this.reviews = this.reviews.concat(data.data.review.data)
        console.log(this.reviews)
        this.totalRecords = reviewData.total;
        this.totalPage = reviewData.last_page;
        let links = reviewData.links;
        links.map((item:any,index:Number)=>{
          if(index != 0 && index != (links.length-1)){
            this.paginationLinks.push(item)
          }
        })
      }
    });
  }

  watchVideo(videoUrl:string){
    console.log(videoUrl)
    let videoId:any = this.getVimeoId(videoUrl);
    console.log(videoId)
    this.currentVimeoId = videoId;
    if (this.player) {
      this.player.destroy();
    }
    this.player = new Player(this.playerContainer.first.nativeElement, {
        id: videoId,
       // width: 750,
        //height: 450,
        responsive: true
    });
    this.player.on('destroy', function() {
      console.log('destroy the video!');
    })
    this.player.on('play', function() {
        console.log('played the video!');
    });
    this.player.on('progress', function(data) {
        console.log('progress the video!',data);
    });
  }

  getVimeoId( url:string ) {

    // Look for a string with 'vimeo', then whatever, then a
    // forward slash and a group of digits.
    var match = /vimeo.*\/(\d+)/i.exec( url );
  
    // If the match isn't null (i.e. it matched)
    if ( match ) {
      // The grouped/matched digits from the regex
      return match[1];
    }
  }
  

  
}
