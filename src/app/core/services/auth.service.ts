import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AuthResponse, LoginResponse } from '../models/IAuth';
import { IUser } from '../models/IUser';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient)
  
  constructor() { }
  
// User Registration
registerUser(user: IUser): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, user).pipe(
    catchError((error) => {
      console.error('Error registering user:', error);
      return throwError(() => error); 
    })
  );
}

// User Login
loginUser(credentials: { email: string; password: string }): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
    catchError((error) => {
      console.error('Error logging in:', error);
      return throwError(() => error); 
    })
  );
}

}
