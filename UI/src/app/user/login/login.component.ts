import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginModel } from 'src/app/shared/models/login';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  login: LoginModel; 
  validLogin: boolean = true;
  errorMsg: string;

  constructor(private formBuilder: FormBuilder, 
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      'email': ['', Validators.required],
      'password': ['', Validators.required]
    });
  }

  onSubmit() {
    this.login = this.loginForm.value;
    
    this.authService.login(this.login)
      .subscribe({
            next: (validLogin) => { 
              if(validLogin) {
                this.router.navigate(
                  ['/user-list'],
                  {queryParams: {page: 1, size: 5}}
                );
              }
            },
            error: (e) => { 
              this.validLogin = false; 
              this.errorMsg = e.error.errorMsg;
              
              console.log('Login Error: ', e.error); 
            },
            complete: () => console.log('Complete')
          });
  }

}
