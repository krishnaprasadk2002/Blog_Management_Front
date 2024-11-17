import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IBlog } from '../../../core/models/IBlog';
import { BlogService } from '../../../core/services/blog.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  blogs: IBlog[] = [];
  isLoading = false;
  expandedBlogId: string | null = null;
  private blogService=inject(BlogService)

  constructor() {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  toggleExpand(blogId: string): void {
    this.expandedBlogId = this.expandedBlogId === blogId ? null : blogId;
  }

  private loadBlogs(): void {
    this.isLoading = true;
    this.blogService.getAllBlogs().subscribe({
      next: (blogs) => {
        this.blogs = blogs;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading blogs:', error);
        this.handleError(error);
        this.isLoading = false;
      }
    });
  }

  getReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }

  handleError(error: any): void {
    const errorMessage = error?.error?.message || 'Something went wrong. Please try again later.';

    Swal.fire({
      title: 'Error!',
      text: errorMessage,
      icon: 'error',
      confirmButtonText: 'Retry',
    });
  }
}