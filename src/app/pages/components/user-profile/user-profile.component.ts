import { Component, inject, OnInit } from '@angular/core';
import { IUser, UserReponse } from '../../../core/models/IUser';
import { BlogService } from '../../../core/services/blog.service';
import Swal from 'sweetalert2';
import { IBlog } from '../../../core/models/IBlog';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../../../shared/components/reusables/modal/modal.component';
import { InputFieldsComponent } from '../../../shared/components/reusables/input-fields/input-fields.component';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, InputFieldsComponent, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {

  private blogServices = inject(BlogService)
  private authService = inject(AuthService)
  private router = inject(Router)
  private fb = inject(FormBuilder)
  userData: UserReponse | null = null;
  blogs: IBlog[] = [];
  addBlogForm!: FormGroup;
  addEditBlogForm!: FormGroup;
  isBlogModal = false;
  isEditBlogModal = false;
  imagePreview: string | null = null;
  expandedBlogs = new Set<string>();
  currentEditBlogId!: string

  constructor() { }

  ngOnInit() {
    this.getUserData();
    this.initializeForm();
    this.getBlogs();
  }

  initializeForm() {
    this.addBlogForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      content: ['', Validators.required],
      image: [null],
      tags: [''],
    });
    this.addEditBlogForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      content: ['', Validators.required],
      image: [null],
      tags: [''],
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

  onEditBlog(blogId: string): void {
    this.currentEditBlogId = blogId;
    this.blogServices.getBlogDetails(blogId).subscribe({
      next: (blog) => {
        this.addEditBlogForm.patchValue({
          title: blog.title || '',
          category: blog.category || '',
          content: blog.content || '',
          tags: blog.tags ? blog.tags.join(', ') : '',
          image: blog.image || null,
        });
        this.imagePreview = blog.image || null;
        this.openEditBlogModal();
      },
      error: (error) => {
        console.error('Error fetching blog details:', error);
        Swal.fire({
          title: 'Error',
          text: error?.message || 'Failed to fetch blog details. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      },
    });
  }

  private trimFormValues(): void {
    Object.keys(this.addEditBlogForm.controls).forEach((key) => {
      const control = this.addEditBlogForm.get(key);
      if (control && typeof control.value === 'string' && control.value !== null) {
        control.setValue(control.value.trim());
      }
    });
  }

  onEditImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.imagePreview = base64String;
        this.addEditBlogForm.patchValue({ image: base64String });
        this.addEditBlogForm.get('image')?.updateValueAndValidity();
      };
      reader.readAsDataURL(file);
    }
  }

  oneEditBlogSubmit(): void {
    this.trimFormValues();

    if (this.addEditBlogForm.valid) {
      const blogData: IBlog = {
        _id: this.currentEditBlogId,
        ...this.addEditBlogForm.value,
        tags: this.addEditBlogForm.value.tags
          .split(',')
          .map((tag: string) => tag.trim())
          .filter((tag: any) => tag),
      };

      this.blogServices.updateBlogData(blogData).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Success!',
            text: 'Blog successfully updated!',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => {
            this.closeEditBlogModal();
            this.getBlogs();
          });
        },
        error: (error) => {
          console.error('Error updating blog:', error);
          this.handleError(error);
        },
      });
    } else {
      Swal.fire({
        title: 'Invalid Form',
        text: 'Please fill in all required fields correctly before submitting.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    }
  }





  onDeleteBlog(blogId: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this blog?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.blogServices.deleteBlog(blogId).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'The blog has been deleted.',
              icon: 'success',
              confirmButtonText: 'OK',
            }).then(() => {
              this.getBlogs(); // Refresh the blog list after deletion
            });
          },
          error: (error) => {
            Swal.fire({
              title: 'Error!',
              text: 'There was an issue deleting the blog.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          },
        });
      }
    });
  }


  openCreateBlogModal() {
    this.isBlogModal = true
  }
  openEditBlogModal() {
    this.isEditBlogModal = true
  }

  closeBlogModal() {
    this.isBlogModal = false
  }
  closeEditBlogModal() {
    this.isEditBlogModal = false
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
          this.blogs.push(response);
          Swal.fire({
            title: 'Success!',
            text: 'Blog successfully created!',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => {
            this.addBlogForm.reset();
            this.imagePreview = null;
            const fileInput: HTMLInputElement = document.querySelector('#image')!;
            if (fileInput) {
              fileInput.value = '';
            }
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


  getBlogs() {
    try {
      this.blogServices.getAllBlogs().subscribe({
        next: (response) => {
          console.log('blog Data', response);
          this.blogs = response;
        },
        error: (error) => {
          console.error('Error fetching blogs:', error);
        },
      });
    } catch (error) {

    }
  }
  isExpanded(blogId: string): boolean {
    return this.expandedBlogs.has(blogId);
  }

  toggleExpand(blogId: string) {
    if (this.expandedBlogs.has(blogId)) {
      this.expandedBlogs.delete(blogId);
    } else {
      this.expandedBlogs.add(blogId);
    }
  }

  onLogout(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to log out!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log me out!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logoutUser().subscribe({
          next: (response) => {
            console.log('Logout successful:', response);
            Swal.fire('Logged out!', 'You have been logged out successfully.', 'success');
            this.router.navigate(['/login']);
          },
          error: (error) => {
            console.error('Logout failed:', error);
            Swal.fire('Error!', 'Something went wrong during logout.', 'error');
          },
        });
      }
    });
  }

}
