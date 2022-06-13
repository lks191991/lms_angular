import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RegisterComponent} from './modules/register/register.component';
import {WelcomeComponent} from './modules/welcome/welcome.component';
import {AuthGuard} from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { LoginComponentComponent } from './modules/login-component/login-component.component';
import { CoursesComponentComponent } from './modules/courses-component/courses-component.component';
import { CourseDetailsComponentComponent } from './modules/course-details-component/course-details-component.component';
import { AboutUsComponent } from './modules/about-us/about-us.component';
import { CmsComponentComponent } from './modules/cms-component/cms-component.component';
import { ContactComponentComponent } from './modules/contact-component/contact-component.component';
import { BlogComponent } from './modules/blog/blog.component';
import { TermsConditionsComponent } from './modules/terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from './modules/privacy-policy/privacy-policy.component';
import { LogoutComponent } from './modules/logout/logout.component';
import { UserProfileComponent } from './modules/user-profile/user-profile.component';
import { CheckoutComponent } from './modules/checkout/checkout.component';
import { WatchCourseComponent } from './modules/watch-course/watch-course.component';
import { PlayQuizComponent } from './modules/play-quiz/play-quiz.component';
import { ForgotPasswordComponent } from './modules/forgot-password/forgot-password.component';
import { RegisterTutorComponent } from './modules/register-tutor/register-tutor.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent
  },
  {
    path: 'login',
    component: LoginComponentComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'tutor-register',
    component: RegisterTutorComponent
  },
  {
    path: 'terms-conditions',
    component: TermsConditionsComponent
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'courses/:id',
    component: CoursesComponentComponent
  },
  {
    path: 'courses/:id/:search',
    component: CoursesComponentComponent
  },
  {
    path: 'course/details/:id',
    //canActivate:[AuthGuard],
    component: CourseDetailsComponentComponent
  },
  {
    path: 'course/watch/:id',
    canActivate:[AuthGuard],
    component: WatchCourseComponent
  },
  {
    path: 'course/watch/:id/:video_id',
    canActivate:[AuthGuard],
    component: WatchCourseComponent
  },
  {
    path: 'play_quiz/:id',
    canActivate:[AuthGuard],
    component: PlayQuizComponent
  },
  {
    path: 'user-profile',
    canActivate:[AuthGuard],
    component: UserProfileComponent
  },
  {
    path: 'checkout/:id',
    canActivate:[AuthGuard],
    component: CheckoutComponent
  },
  {
    path: 'checkout/:id/:coupon',
    canActivate:[AuthGuard],
    component: CheckoutComponent
  },
  {
    path: 'about',
    component: AboutUsComponent
  },
  {
    path: 'contact-us',
    component: ContactComponentComponent
  },
  {
    path: 'blogs',
    component: BlogComponent
  },
  {
    path: 'cms/:type',
    component: CmsComponentComponent
  },
  {
    path: 'logout',
    canActivate:[AuthGuard],
    component: LogoutComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthService, AuthGuard,],
})
export class AppRoutingModule { }
