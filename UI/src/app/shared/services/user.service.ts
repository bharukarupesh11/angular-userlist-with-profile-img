import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { EncryptionService } from './encryption.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userToDelete: number; 
  
  constructor(private httpClient: HttpClient, private authService: AuthService, private encryptionService: EncryptionService) { }

  getAll(pageNo: number, recordsPerPage: number) {
    let value = localStorage.getItem('currentUser');
    let currentUser = (value) ? JSON.parse(this.encryptionService.decrypt(value)) as User : null;
    
    const headers = {'x-auth-token': currentUser.token};
    
    return this.httpClient.get(`http://localhost:3000/api/users?page=${pageNo}&size=${recordsPerPage}`, {headers})
      .pipe(map(users => {
        return users; 
      })); 
  } 

  get(userId: number) {
    let value = localStorage.getItem('currentUser');
    let currentUser = (value) ? JSON.parse(this.encryptionService.decrypt(value)) as User : null;
    
    const headers = {'x-auth-token': currentUser.token};

    return this.httpClient.get('http://localhost:3000/api/users/' +userId, {headers})
      .pipe(map(user => {
        return user;
      }));
  }

  create(user: FormData) {
    return this.httpClient.post('http://localhost:3000/api/users/signup', user)
      .pipe(
        map(user => {
          return user;
        }));
  }

  update(userId: number, user: FormData) {
    let value = localStorage.getItem('currentUser');
    let currentUser = (value) ? JSON.parse(this.encryptionService.decrypt(value)) as User : null;
    
    const headers = {'x-auth-token': currentUser.token};

    return this.httpClient.put("http://localhost:3000/api/users/" +userId, user, {headers})
      .pipe(
        map(response => {
        return response;
      }));
  }

  delete(userId: number) {
    let value = localStorage.getItem('currentUser');
    let currentUser = (value) ? JSON.parse(this.encryptionService.decrypt(value)) as User : null;
    
    const headers = {'x-auth-token': currentUser.token};

    return this.httpClient.delete("http://localhost:3000/api/users/" +userId, {headers})
      .pipe(
        map(response => {
        return response;
      }));
  }
}
