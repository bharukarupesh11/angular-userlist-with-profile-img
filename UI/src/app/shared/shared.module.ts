import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { EncryptionService } from './services/encryption.service';
import { UserService } from './services/user.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    AuthService,
    EncryptionService,
    UserService
  ]
})
export class SharedModule {
  constructor() {
    console.log('Shared module loaded');
  }
 }
