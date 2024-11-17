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

  createBlog(blogData: IBlog): Observable<IBlog> {
    return this.http.post<IBlog>(`${this.apiUrl}/blog/createBlog`, blogData).pipe(
      catchError((error) => {
        console.error('Error creating blog:', error.message || error);
        return throwError(() => error);
      })
    );
  }

  // User Details Getting
  getAllBlogs(): Observable<IBlog[]> {
    return this.http.get<IBlog[]>(`${this.apiUrl}/blog/getBlogDetails`).pipe(
      catchError((error) => {
        console.error('Error fetching blog details:', error);
        return throwError(() => error);
      })
    );
  }

  // Fetch Blog Details
  getBlogDetails(blogId: string): Observable<IBlog> {
    return this.http.get<IBlog>(`${this.apiUrl}/blog/blogDetails`, { params: { blogId } }).pipe(
      catchError((error) => {
        console.error('Error fetching blog details:', error);
        return throwError(() => error);
      })
    );
  }

  //Edit Blog
  updateBlogData(blog: IBlog): Observable<IBlog> {
    return this.http.put<IBlog>(`${this.apiUrl}/blog/updateBlog`, blog).pipe(
      catchError((error) => {
        console.error('Error updating blog:', error);
        return throwError(() => error);
      })
    );
  }

  //Delete Blog
  deleteBlog(blogId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/blog/delete/${blogId}`).pipe(
      catchError((error) => {
        console.error('Error deleting blog:', error);
        return throwError(() => error);
      })
    );
  }
  
  
}
