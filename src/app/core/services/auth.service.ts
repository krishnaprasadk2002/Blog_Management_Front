import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AuthResponse, LoginResponse } from '../models/IAuth';
import { IUser } from '../models/IUser';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient)
  
  constructor() { }
  
  //User Registertion
  registerUser(user:IUser):Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`,user)
  }

  //User login
  loginUser(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials);
  }

}
