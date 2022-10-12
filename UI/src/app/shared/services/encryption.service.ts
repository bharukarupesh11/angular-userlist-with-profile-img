import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor() { }

  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, environment.secretKey).toString();
  }

  decrypt(value: string): string {
    return CryptoJS.AES.decrypt(value, environment.secretKey).toString(CryptoJS.enc.Utf8);
  }
}
