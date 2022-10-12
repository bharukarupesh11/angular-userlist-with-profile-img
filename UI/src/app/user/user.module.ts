import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { UsersListComponent } from './users-list/users-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserDeletePopupComponent } from './user-delete-popup/user-delete-popup.component';
import { UserFormComponent } from './user-form/user-form.component';
import { RouterModule, Routes } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    SignupComponent,
    LoginComponent,
    UsersListComponent,
    UserDeletePopupComponent,
    UserFormComponent
  ],
  imports: [
    CommonModule,
    // NgbModule,
    FormsModule, // required to inject form builder
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,  // To access routerLink 
    NgxPaginationModule
  ],

  
})
export class UserModule { 
  constructor() {
    console.log('User module loaded');
  }
}
