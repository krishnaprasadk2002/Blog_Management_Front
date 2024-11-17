import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AuthResponse, LoginResponse } from '../models/IAuth';
import { IUser } from '../models/IUser';
import { catchError, Observable, of, throwError } from 'rxjs';

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

  isAuthenticated(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/auth/isAuth`).pipe(
      catchError((error) => {
        console.error('Error during authentication check:', error);
        return of(false);
      })
    );
  }

  logoutUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/logOut`).pipe(
      catchError((error) => {
        console.error('Error during logout:', error);
        return of(false); // Return false on error
      })
    );
  }
}
