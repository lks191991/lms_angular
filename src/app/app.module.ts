import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HeaderComponent } from './modules/common/header/header.component';
import { FooterComponent } from './modules/common/footer/footer.component';
import { AuthInterceptor } from './helper/authconfig.interceptor';
import { ErrorInterceptor } from './helper/error.interceptor';
import { RegisterComponent } from './modules/register/register.component';
import { InputValidatorDirective } from './directives/input-validator.directive';
import { EmailValidatorDirective } from './directives/email-validator.directive';
import {BroadcastingService} from './services/broadcasting.service';
import { PhoneValidationDirective } from './directives/phone-validation.directive';
import { WelcomeComponent } from './modules/welcome/welcome.component';
import { LoginComponentComponent } from './modules/login-component/login-component.component';
import { CourseDetailsComponentComponent } from './modules/course-details-component/course-details-component.component';
import { CmsComponentComponent } from './modules/cms-component/cms-component.component';
import { CoursesComponentComponent } from './modules/courses-component/courses-component.component';
import { ContactComponentComponent } from './modules/contact-component/contact-component.component';
import { AboutUsComponent } from './modules/about-us/about-us.component';
import { TermsConditionsComponent } from './modules/terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from './modules/privacy-policy/privacy-policy.component';
import { SafePipe } from './safe.pipe';
import { LogoutComponent } from './modules/logout/logout.component';
import { UserProfileComponent } from './modules/user-profile/user-profile.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { DateAgoPipe } from './pipes/pipes/date-ago.pipe';
import { MyLoaderComponent } from './modules/my-loader/my-loader.component';
import { LoaderService } from './services/loader.service';
import { LoaderInterceptor } from './interceptors/loader-interceptor.service';
import { CheckoutComponent } from './modules/checkout/checkout.component';
import { WatchCourseComponent } from './modules/watch-course/watch-course.component';
import { RatingModule } from 'ng-starrating';
import { PlayQuizComponent } from './modules/play-quiz/play-quiz.component';
import { ForgotPasswordComponent } from './modules/forgot-password/forgot-password.component';
import { RegisterTutorComponent } from './modules/register-tutor/register-tutor.component';
import { WatchHeaderComponent } from './modules/common/watch-header/watch-header.component';

@NgModule({
  declarations: [
    AppComponent,
    MyLoaderComponent,
    InputValidatorDirective,
    EmailValidatorDirective,
    HeaderComponent,
    FooterComponent,
    RegisterComponent,
    PhoneValidationDirective,
    WelcomeComponent,
    LoginComponentComponent,
    CourseDetailsComponentComponent,
    CmsComponentComponent,
    CoursesComponentComponent,
    ContactComponentComponent,
    AboutUsComponent,
    TermsConditionsComponent,
    PrivacyPolicyComponent,
    SafePipe,
    LogoutComponent,
    UserProfileComponent,
    DateAgoPipe,
    MyLoaderComponent,
    CheckoutComponent,
    WatchCourseComponent,
    PlayQuizComponent,
    ForgotPasswordComponent,
    RegisterTutorComponent,
    WatchHeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    CarouselModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    RatingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    BroadcastingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
