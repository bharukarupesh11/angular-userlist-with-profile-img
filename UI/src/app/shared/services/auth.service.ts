import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { LoginModel } from '../models/login';
import { EncryptionService } from './encryption.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private encryptionService: EncryptionService,
    private router: Router
  ) {}

  login(userCredentials: LoginModel) {
    const encryptedPassword = this.encryptionService.encrypt(
      userCredentials.password
    );
    userCredentials.password = encryptedPassword;

    // return this.httpClient.post('http://localhost:3000/api/login/', userCredentials)
    //   .subscribe({
    //     next: (result) => {
    //       console.log('Login Result: ', result);
    //       return result;
    //     },
    //     error: (e) => { console.log('Login Error: ', e.error) },
    //     complete: () => console.log('Complete')
    //   });
    console.log('API URL : ', environment.apiUrl);
    return this.httpClient
      .post('http://localhost:3000/api/login/', userCredentials, {
        observe: 'response',
      })
      .pipe(
        map((response) => {
          if (response) {
            const encryptedValue = this.encryptionService.encrypt(
              JSON.stringify(response.body)
            );

            localStorage.setItem('currentUser', encryptedValue); // Persists the data even if the browser tab is closed
            // sessionStorage.setItem('currentUser', encryptedValue); // Clears the data once you close the browser tab

            return true;
          }

          return false;
        })
      );
  }

  logout() {
    localStorage.removeItem('currentUser');
    // sessionStorage.removeItem('currentUser');
    this.router.navigate(['/']); // navigate to the login page after logging out.
  }
}
