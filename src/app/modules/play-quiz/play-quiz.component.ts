import { Component, OnInit,ElementRef,ViewChild } from '@angular/core';
import {RegisterService} from '../../services/register.service';
import {AuthService} from '../../services/auth.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { WindowRefService } from '../../services/window-ref.service';
import { ToastrService } from 'ngx-toastr';
import {environment} from '../../../environments/environment';
import {CommonService} from '../../services/common.service';
import {DefaultService} from '../../services/default.service';
import { DatePipe } from '@angular/common';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-play-quiz',
  templateUrl: './play-quiz.component.html',
  styleUrls: ['./play-quiz.component.css'],
  providers: [DatePipe]
})
export class PlayQuizComponent implements OnInit {
  @ViewChild('someVar') input:any; 
  public imgUrl = environment.base_url
  public websiteDataLocal:any={}
  public courseData:any={}
  public courseImgPath:any = ''
  public courseId = ''
  public course_video_id = ''
  public quickQuizs:any = [];
  public quizScoreShow = 1;
  public answerA = 'A'
  public answerB = 'B'
  public answerC = 'C'
  public answerD = 'D'
  public totalQuizTime = 0
  public timer2:any = "0"
  public questionSubmited = "0%"
  public percentAtaTIme = 0
  public isShowQuizResultpage:boolean= false
  public quizResult:any = {}
 
  constructor(
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
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
      this.course_video_id = params.video_id
      this.courseId = courseId
      let sendData = {
        course_id : courseId
      }
      this.DefaultService.myCourseDetails(sendData).subscribe((data)=>{
        if(data && data.success){
          this.courseData = data.data.course;
        }
      });
      let quizParam = {
        course_id : this.courseId,
        //video_id : 1
      }
      this.DefaultService.getQuizes(quizParam).subscribe((data)=>{
        if(data && data.success){
          this.quickQuizs = data.data.quiz && data.data.quiz.length ? data.data.quiz : []
          this.quizScoreShow = data.data.quizScore;
          if(data.data && data.data.quizScore){
            this.isShowQuizResultpage = true
            this.router.navigateByUrl('/user-profile')
          }
          this.totalQuizTime = data.data.durationTime
          this.percentAtaTIme = 100/(this.quickQuizs.length);
          let newD = new Date(new Date().getTime() + data.data.durationTime*60000);
          var interval = setInterval(()=> {
            this.timer2 = this.getTimeRemaining(newD)
          }, 1000);
          
          if(this.quizScoreShow == 0){
            //this.router.navigateByUrl('/user-profile')
          }
        }
      })
     
  }
  
  public isLoading:Boolean = false;
  @HostListener('window:load')
  onLoad() {
    
  }
  ngOnInit(): void {
    setTimeout(()=>{
      this.loadScript();
    },2000)
   
   
  }
  ngAfterViewInit(){
    
  }
  getTimeRemaining(endtime:any){
    let nowDt:any = new Date();
    const total = Date.parse(endtime) - Date.parse(nowDt);
    let seconds:any = Math.floor( (total/1000) % 60 );
    const minutes = Math.floor( (total/1000/60) % 60 );
    const hours = Math.floor( (total/(1000*60*60)) % 24 );
    const days = Math.floor( total/(1000*60*60*24) );
    if(seconds < 10){
      seconds = "0"+seconds
    }
    return minutes+':'+seconds;
    // return {
    //   total,
    //   days,
    //   hours,
    //   minutes,
    //   seconds
    // };
  }
  formatDate(timeMinute:Number) {
    let date= new Date()
    let miinn:any = timeMinute
    let newD = new Date(date.getTime() + miinn*60000);
    let currentTimeStart =  this.datePipe.transform(newD,'hh-mm' );
    this.timer2 = currentTimeStart;
    var interval = setInterval(()=> {


        var timer = this.timer2.split(':');
        //by parsing integer, I avoid all extra string processing
        var minutes = parseInt(timer[0], 10);
        var seconds:any = parseInt(timer[1], 10);
        --seconds;
        minutes = (seconds < 0) ? --minutes : minutes;
        if (minutes < 0) clearInterval(interval);
        seconds = (seconds < 0) ? 59 : seconds;
        seconds = (seconds < 10) ? '0' + seconds : seconds;
        //minutes = (minutes < 10) ?  minutes : minutes;
        //$('.countdown').html(`<span class="minutes">${minutes}</span>:<span class="minutes">${seconds}</span> `);
        this.timer2 = minutes + ':' + seconds;
    }, 1000);
  }
  addMinutes(date:Number, minutes:any=0,dateD:any) {
    return new Date(dateD.getTime() + Number(minutes)*60000);
  }
  playQuiz(isFinished:boolean,index=0){
    setTimeout(()=>{
      index = index+1;
      let totalPercent = this.percentAtaTIme*index;
      console.log("totalPercent",totalPercent)
      this.questionSubmited = totalPercent+'%';
      this.input.nativeElement.style.width = totalPercent+'%';
    },1000)
    
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
        video_id : '',
        quiz_type : 'course',
        ansdata : JSON.stringify(userAnswers)
      }
      this.DefaultService.quizSubmit(submitQuizData).subscribe((data)=>{
        if(data && data.success){
          this.quizScoreShow = 0;
          this.isShowQuizResultpage = true;
          this.quizResult = data.data;
        }
      })
    }
  }
  loadScript() {
      
    var s = window.document.createElement("script");
      s.id = "cvv-script";
      s.type = "text/javascript";
      s.src = "../../assets/dist/custom.js";
      window.document.body.appendChild(s);
  }
  
}
