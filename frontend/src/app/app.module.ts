import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RouterModule, Routes} from '@angular/router';
import {UserComponent} from './component/end-to-end/user/user.component';
import {HeaderComponent} from './component/header/components/header.component';
import {BanComponent} from './component/end-to-end/ban/ban.component';
import {CommentsComponent} from './component/end-to-end/comments/comments.component';
import {PostComponent} from './component/post/post.component';
import {TagComponent} from './component/end-to-end/tag/tag.component';
import {UserHomePageComponent} from './component/user-home-page/user-home-page.component';
import {LoginComponent} from './component/start-page/login/login.component';
import {RegisterComponent} from './component/start-page/register/register.component';
import {SinglePostComponent} from './component/post/single-post/single-post.component';
import {TestHeaderComponent} from './component/layout/test-header/test-header.component';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {NotFoundComponent} from './component/layout/not-found/not-found.component';
import {NewPostComponent} from './component/user-home-page/new-post/new-post.component';
import {AuthenticationInterceptor} from './interceptor/authentication.interceptor';
import {EditProfileComponent} from './component/user-home-page/edit-profile/edit-profile.component';
import {TokenService} from './service/token/token.service';

const appRoutes: Routes = [
  {path: '', component: RegisterComponent},
  {path: 'ban', component: BanComponent},
  {path: 'comments', component: CommentsComponent},
  {path: 'posts', component: PostComponent},
  {path: 'tag', component: TagComponent},
  {path: 'user', component: UserComponent},
  {path: 'home', component: UserHomePageComponent},
  {path: 'home/:login', component: UserHomePageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'home/post/:id', component: SinglePostComponent},
  {path: 'posts/post/:id', component: SinglePostComponent},
  {path: 'home/:login/post/:id', component: SinglePostComponent},
  {path: '**', component: NotFoundComponent},
];

const appConfig = (config: TokenService) => {
  return() => {
    return config.loadConfig();
  }; };

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    HeaderComponent,
    BanComponent,
    CommentsComponent,
    PostComponent,
    TagComponent,
    UserHomePageComponent,
    LoginComponent,
    RegisterComponent,
    SinglePostComponent,
    TestHeaderComponent,
    NotFoundComponent,
    NewPostComponent,
    EditProfileComponent
  ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        MDBBootstrapModule.forRoot(),
        RouterModule.forRoot(appRoutes),
        ReactiveFormsModule,
    ],
  entryComponents: [ NewPostComponent, EditProfileComponent],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: appConfig,
    multi: true,
    deps: [TokenService]
  },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }

