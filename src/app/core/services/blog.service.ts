import { inject, Injectable } from '@angular/core';
import { IUser, UserReponse } from '../models/IUser';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/apiResponse';
import { IBlog } from '../models/IBlog';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient)

  constructor() { }

  // User Details Getting
  getUserDetails(): Observable<ApiResponse<UserReponse>> {
    return this.http.get<ApiResponse<UserReponse>>(`${this.apiUrl}/blog/userDetails`).pipe(
      catchError((error) => {
        console.error('Error fetching user details:', error);
        return throwError(() => error); 
      })
    );
  }

  createBlog(blogData: IBlog): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/blog/createBlog`, blogData).pipe(
      catchError((error) => {
        console.error('Error creating blog:', error.message || error);
        return throwError(() => error); 
      })
    );
  }
  



}
