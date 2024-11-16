import { Component, inject, OnInit } from '@angular/core';
import { IUser, UserReponse } from '../../../core/models/IUser';
import { BlogService } from '../../../core/services/blog.service';
import Swal from 'sweetalert2';
import { IBlog } from '../../../core/models/IBlog';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../../../shared/components/reusables/modal/modal.component';
import { InputFieldsComponent } from '../../../shared/components/reusables/input-fields/input-fields.component';


@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, InputFieldsComponent, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {

  private blogServices = inject(BlogService)
  private fb = inject(FormBuilder)
  userData: UserReponse | null = null;
  blogs: IBlog[] = [];
  addBlogForm!: FormGroup;
  isBlogModal = false;
  imagePreview: string | null = null;

  constructor() { }

  ngOnInit() {
    this.getUserData();
    this.initializeForm();
    // this.getBlogs();
  }

  initializeForm() {
    this.addBlogForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      content: ['', Validators.required],
      image: [null], // Validators for file upload are optional
      tags: [''], // No validation by default
    });
  }



  getUserData(): void {
    this.blogServices.getUserDetails().subscribe({
      next: (response) => {
        this.userData = response.data;
        console.log(this.userData);
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
        this.handleError(error);
      }
    });
  }
  // getBlogs(): void {
  //   this.blogService.getUserBlogs().subscribe({
  //     next: (blogs) => {
  //       this.blogs = blogs;
  //     },
  //     error: (error) => {
  //       console.error('Error fetching blogs:', error);
  //       this.handleError(error);
  //     }
  //   });
  // }

  onEdit(): void {
    // Implement edit profile logic
  }

  onEditBlog(blogId: string): void {
    // Implement edit blog logic
  }

  onDeleteBlog(blogId: string): void {
    // if (confirm('Are you sure you want to delete this blog?')) {
    //   this.blogService.deleteBlog(blogId).subscribe({
    //     next: () => {
    //       this.blogs = this.blogs.filter(blog => blog._id !== blogId);
    //     },
    //     error: (error) => {
    //       console.error('Error deleting blog:', error);
    //       this.handleError(error);
    //     }
    //   });
    // }
  }

  openCreateBlogModal() {
    this.isBlogModal = true
  }

  closeBlogModal() {
    this.isBlogModal = false
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

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.imagePreview = base64String;
        this.addBlogForm.patchValue({ image: base64String });
        this.addBlogForm.get('image')?.updateValueAndValidity();
      };
      reader.readAsDataURL(file);
    }
  }



  onAddBlogSubmit(): void {
    if (this.addBlogForm.valid) {
      const blogData: IBlog = {
        ...this.addBlogForm.value,
        title: this.addBlogForm.value.title.trim(),
        category: this.addBlogForm.value.category.trim(),
        tags: this.addBlogForm.value.tags.split(',').map((tag: string) => tag.trim()),
      };

      console.log('Submitting blog:', blogData);

      this.blogServices.createBlog(blogData).subscribe({
        next: (response) => {
          console.log('Blog successfully created:', response);
          Swal.fire({
            title: 'Success!',
            text: 'Blog successfully created!',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => {
            this.addBlogForm.reset();
            this.closeBlogModal();
          });
        },
        error: (error) => {
          console.error('Error during blog submission:', error);
          const errorMessage = error?.message || 'Failed to create blog. Please try again later.';
          Swal.fire({
            title: 'Error!',
            text: errorMessage,
            icon: 'error',
            confirmButtonText: 'Retry',
          });
        },
      });
    } else {
      console.error('Form is invalid:', this.addBlogForm.errors);
      Swal.fire({
        title: 'Invalid Form',
        text: 'Please fill in all required fields correctly before submitting.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });

      Object.keys(this.addBlogForm.controls).forEach((key) => {
        const controlErrors = this.addBlogForm.get(key)?.errors;
        if (controlErrors) {
          console.error(`Control ${key} errors:`, controlErrors);
        }
      });
    }
  }



}
