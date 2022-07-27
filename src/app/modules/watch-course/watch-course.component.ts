import { Component, OnInit,ViewChild,ViewChildren  } from '@angular/core';
import {RegisterService} from '../../services/register.service';
import {AuthService} from '../../services/auth.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { WindowRefService } from '../../services/window-ref.service';
import { ToastrService } from 'ngx-toastr';
import { DefaultService } from '../../services/default.service';
import {environment} from '../../../environments/environment';
import {CommonService} from '../../services/common.service';
import Player from "@vimeo/player";
import { StarRatingComponent } from 'ng-starrating';

@Component({
  selector: 'app-watch-course',
  templateUrl: './watch-course.component.html',
  styleUrls: ['./watch-course.component.css'],
  providers: [WindowRefService]
})
export class WatchCourseComponent implements OnInit {
  private player: Player | undefined;
  @ViewChildren('player_container') playerContainer: any;
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
  public currentVimeoId:any = '';
  public playingVideoData:any = '';
  public totalStarSelected:any = 5;
  public courseId = ''
  public course_video_id = ''
  public messages = ''
  public quickQuizs:any = [];
  public quizScoreShow:any = 1;
  public answerA = 'A'
  public answerB = 'B'
  public answerC = 'C'
  public answerD = 'D'
  public isLiked = 0;
  public isFlaged = 0;
  public myFavVideos:any = [];
  public videoWatchHistory:any = {};
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
      document.querySelector('body')?.classList.add('bgLight');
      let params: any = this.activatedRoute.snapshot.params;
      let courseId = params.id
      this.course_video_id = params.video_id
      this.courseId = courseId
      let sendData = {
        course_id : courseId,
      }
      this.DefaultService.myCourseDetails(sendData,this.currentPage).subscribe((data)=>{
        if(data && data.success){
          this.courseData = data.data.course;
          this.enrollCount = data.data.enrolled;
          
          if(this.courseData && this.courseData.topics.length && this.courseData.topics[0] && this.courseData.topics[0].topic_videos && this.courseData.topics[0].topic_videos.length){
            if(this.course_video_id && this.course_video_id != ""){
              let activeVideoData:any = ''
              this.courseData.topics.map((topic:any)=>{
                if(topic && topic.topic_videos && topic.topic_videos.length){
                  topic.topic_videos.map((topic_video:any)=>{
                    if(Number(this.course_video_id) == Number(topic_video.id)){
                      activeVideoData = topic_video
                    }
                  })
                }
              })
              setTimeout(()=>{
                if(activeVideoData != ""){
                  this.currentVimeoId = this.getVimeoId(activeVideoData.video_url);
                  this.DefaultService.getVideoWatchHistory({video_id:activeVideoData.id}).subscribe((outputRes)=>{
                    if(outputRes && outputRes.success){
                      this.videoWatchHistory = outputRes.data;
                      let startFrom = 0;
                      if(outputRes.data && outputRes.data.video_watch_report && outputRes.data.video_watch_report.seconds){
                        startFrom = Number(outputRes.data.video_watch_report.seconds);
                        this.watchVideo(activeVideoData.video_url,startFrom);
                        this.playVideo(activeVideoData);
                      }else{
                        this.watchVideo(activeVideoData.video_url,startFrom);
                        this.playVideo(activeVideoData);
                      }
                    }
                  })
                  
                  let updateVideoData = {
                    video_id : activeVideoData.id
                  }
                  this.DefaultService.updateVideoView(updateVideoData).subscribe((data)=>{
                  })
                  let quizParam = {
                    course_id : this.courseData.id,
                    video_id : updateVideoData.video_id,
                  }
                  this.DefaultService.getQuizes(quizParam).subscribe((data)=>{
                    if(data && data.success){
                      this.quickQuizs = data.data.quiz
                      this.quizScoreShow = data.data.quizScore;
                      console.log("this.quizScoreShow",this.quizScoreShow)
                    }
                  })
                }else{
                  this.currentVimeoId = this.getVimeoId(this.courseData.topics[0].topic_videos[0].video_url);
                  this.DefaultService.getVideoWatchHistory({video_id:activeVideoData.id}).subscribe((outputRes)=>{
                    if(outputRes && outputRes.success){
                      this.videoWatchHistory = outputRes.data;
                      let startFrom = 0;
                      if(outputRes.data && outputRes.data.video_watch_report && outputRes.data.video_watch_report.seconds){
                        startFrom = Number(outputRes.data.video_watch_report.seconds);
                        this.watchVideo(this.courseData.topics[0].topic_videos[0].video_url,startFrom);
                        this.playVideo(this.courseData.topics[0].topic_videos[0]);
                      }else{
                        this.watchVideo(this.courseData.topics[0].topic_videos[0].video_url,startFrom);
                        this.playVideo(this.courseData.topics[0].topic_videos[0]);
                      }
                    }
                  })
                  //this.watchVideo(this.courseData.topics[0].topic_videos[0].video_url);
                  //this.playVideo(this.courseData.topics[0].topic_videos[0]);
                  let updateVideoData = {
                    video_id : this.courseData.topics[0].topic_videos[0].id
                  }
                  this.DefaultService.updateVideoView(updateVideoData).subscribe((data)=>{
                  })
                  let quizParam = {
                    course_id : this.courseData.id,
                    video_id : updateVideoData.video_id,
                  }
                  this.DefaultService.getQuizes(quizParam).subscribe((data)=>{
                    if(data && data.success){
                      this.quickQuizs = data.data.quiz
                      this.quizScoreShow = data.data.quizScore;
                      console.log("this.quizScoreShow",this.quizScoreShow)
                    }
                  })
                }
              },1000)
            }else{
              this.currentVimeoId = this.getVimeoId(this.courseData.topics[0].topic_videos[0].video_url);
              this.watchVideo(this.courseData.topics[0].topic_videos[0].video_url,0);
              this.playVideo(this.courseData.topics[0].topic_videos[0]);
              let updateVideoData = {
                video_id : this.courseData.topics[0].topic_videos[0].id
              }
              this.DefaultService.updateVideoView(updateVideoData).subscribe((data)=>{
              })
              let quizParam = {
                course_id : this.courseData.id,
                video_id : updateVideoData.video_id,
              }
              this.DefaultService.getQuizes(quizParam).subscribe((data)=>{
                if(data && data.success){
                  this.quickQuizs = data.data.quiz
                  this.quizScoreShow = data.data.quizScore;
                }
              })
            }
          }
          
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
      });
      
     
  }
  
  public isLoading:Boolean = false;
  
  ngOnInit(): void {
    setTimeout(()=>{
      this.loadScript();
    },2000)
  }

  loadMoreReviews(){
    this.currentPage = this.currentPage+1

    let sendData = {
      course_id : this.courseId,
    }
    this.DefaultService.myCourseDetails(sendData,this.currentPage).subscribe((data)=>{
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

  playQuiz(isFinished:boolean){
    this.loadScript();
    if(isFinished){
      let userAnswers:any = [];
      this.quickQuizs.map((item:any)=>{
        userAnswers.push({
          qnsans_id : item.id,
          rightans : item.answer ? item.answer : '',
        });
      })
      let submitQuizData = {
        course_id : this.courseId,
        video_id : this.playingVideoData.id,
        quiz_type : 'video',
        ansdata : JSON.stringify(userAnswers)
      }
      this.DefaultService.quizSubmit(submitQuizData).subscribe((data)=>{
        if(data && data.success){
          this.quizScoreShow = 1;
          this.toastr.success(data.message);
        }
      })
    }
  }
  loadScript() {
    // if(!window.document.getElementById('cvv-script')) {
    //   var s = window.document.createElement("script");
    //   s.id = "cvv-script";
    //   s.type = "text/javascript";
    //   s.src = "../../assets/dist/custom.js";
    //   window.document.body.appendChild(s);
    // }
    var s = window.document.createElement("script");
    s.id = "cvv-script";
    s.type = "text/javascript";
    s.src = "../../assets/dist/custom.js";
    window.document.body.appendChild(s);
  }

  onRate($event:{oldValue:number, newValue:number, starRating:StarRatingComponent}) {
    this.totalStarSelected = $event.newValue
  }
  ngAfterViewInit() {
  }
  closeRatingPopup(){
    let yourElem= <HTMLElement>document.querySelector('.closeRatingModel');
    yourElem.click();
  }
  closeFlagPopup(){
    let yourElem= <HTMLElement>document.querySelector('.flagVideoClose');
    yourElem.click();
  }
  saveRating(){
    let elementRefList = [];
    let errors = false;
    this.messages = this.commonService.stripScripts(this.messages);
   
    let messages:any = document.querySelector('#messages');

    if(!this.messages.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#messages"));
    } 
    else if(messages.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#messages"), 'error')
    }
    if(errors) {
      elementRefList.forEach(v => {
        this.commonService.addDomElement(v, 'error', 'errorMsg', "This field is required");
      })
      return false;
    } else {
      this.isLoading = true
      let sendData = {
        course_video_id : this.playingVideoData.id,
        type : 'video',
        rating : this.totalStarSelected,
        comment : this.messages,
      }
      this.DefaultService.saveRating(sendData).subscribe((data)=>{
        this.isLoading = false
        if(data && data.success){
          this.messages = ''
          this.toastr.success(data.message);
        }
        this.closeRatingPopup()
      },
      (error) => {
        this.isLoading = false
        console.log(error)
        this.toastr.error(error);
        this.closeRatingPopup()
      });
      
    }
    
  }
  reportVideo(){
    let elementRefList = [];
    let errors = false;
    this.messages = this.commonService.stripScripts(this.messages);
   
    let messages:any = document.querySelector('#messages');

    if(!this.messages.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#messages"));
    } 
    else if(messages.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#messages"), 'error')
    }
    if(errors) {
      elementRefList.forEach(v => {
        this.commonService.addDomElement(v, 'error', 'errorMsg', "This field is required");
      })
      return false;
    } else {
      this.isLoading = true
      let sendData = {
        video_id : this.playingVideoData.id,
        comment : this.messages,
      }
      this.DefaultService.reportVideo(sendData).subscribe((data)=>{
        this.isLoading = false
        if(data && data.success){
          this.messages = ''
          this.toastr.success(data.message);
          this.closeFlagPopup();
        }
      },
      (error) => {
        this.isLoading = false
        console.log(error)
        this.toastr.error(error);
        this.closeFlagPopup();
      });
      
    }
    
  }
  addtoWishlist(){
    this.isLoading = true
    let sendData = {
      video_id : this.playingVideoData.id,
      course_id : this.courseId,
    }
    this.DefaultService.addtoWishlist(sendData).subscribe((data)=>{
      this.isLoading = false
      if(data && data.success){
        if(data && data.data && data.data.user_id){
          this.videoWatchHistory.favourite = 1
        }else{
          this.videoWatchHistory = {}
        }
        this.toastr.success(data.message);
      }
    },
    (error) => {
      this.isLoading = false
      console.log(error)
      this.toastr.error(error);
    });
    
  }
  playVideo(data:any){
    this.playingVideoData = data
    let quizParam = {
      course_id : this.courseData.id,
      video_id : this.playingVideoData.id,
    }
    this.DefaultService.getQuizes(quizParam).subscribe((data)=>{
      if(data && data.success){
        this.quickQuizs = data.data.quiz
        this.quizScoreShow = data.data.quizScore;
        console.log("this.quizScoreShow",this.quizScoreShow)
      }
    })
    this.DefaultService.getVideoWatchHistory(quizParam).subscribe((outputRes)=>{
      if(outputRes && outputRes.success){
        this.videoWatchHistory = outputRes.data;
        let startFrom = 0;
        if(outputRes.data && outputRes.data.video_watch_report && outputRes.data.video_watch_report.seconds){
          startFrom = Number(outputRes.data.video_watch_report.seconds);
        }
        console.log("this.videoWatchHistory",startFrom)
        this.watchVideo(data.video_url,startFrom);
      }
    })
    
    this.DefaultService.wishlistFlaggedDetails({video_id:data.id}).subscribe((dataRes)=>{
      this.isLiked = dataRes.data.favourite
      this.isFlaged = dataRes.data.flag
    })
  }
  watchVideo(videoUrl:string,startFrom:any){
    console.log("videoUrl",videoUrl)
    let videoId:any = this.getVimeoId(videoUrl);
    console.log("videoId",videoId)
    this.currentVimeoId = videoId;
    this.vimeoPlayer(videoId,startFrom);
  }
  vimeoPlayer(videoId:any,startFrom:any){
    var myDiv:any = document.getElementById("myDivID");
    myDiv.innerHTML = "";//remove all child elements inside of myDiv
    console.log("startFrom",startFrom)
    if (this.player) {
      this.player.destroy();
    }
    if(this.playerContainer && this.playerContainer.first){
      try{
      this.player = new Player(this.playerContainer.first.nativeElement, {
        id: videoId,
        autoplay : true,
        //width: 750,
        //height: 450,
        responsive: true,
      });
      this.player.pause();
      setTimeout(()=>{
       
        if(startFrom){
          this.player?.setCurrentTime(startFrom);
          //this.player?.setCurrentTime(40);
        }
        this.player?.on('destroy', function() {
          console.log('destroy the video!');
        })
        this.player?.on('play', (data) =>
        {
        
         
            console.log('played the video!');
        });
        this.player?.on('error', function() {
          console.log("error occured")
        })
        this.player?.on('progress', (data) => {
          let updateVideoData = {
            course_id : this.courseId,
            video_id : this.playingVideoData.id,
            seconds : data.seconds,
            percent : data.percent,
            duration : data.duration,
          }
          this.DefaultService.updateVideoProgress(updateVideoData).subscribe((data)=>{})
          console.log('progress the video!',data);
        });
      },2000)
      }catch(error){
        console.log(78787878787)
      }
      
    }
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
