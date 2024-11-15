import { Component, inject, OnInit } from '@angular/core';
import { InputFieldsComponent } from '../../../shared/components/reusables/input-fields/input-fields.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { markFormGroupTouchedAndDirty, noWhitespaceValidator, strongPasswordValidator } from '../../../shared/validators/validators';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputFieldsComponent,ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  private fb = inject(FormBuilder)
  private authService = inject(AuthService);
  private router = inject(Router);
  constructor() {} 

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, noWhitespaceValidator()]],
      password: ['', [Validators.required, strongPasswordValidator()]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const {email,password} = this.loginForm.value;
      this.authService.loginUser({email,password}).subscribe({
        next:(response) => {
          Swal.fire({
            title: 'Success!',
            text: response.message || 'Login successful! Redirecting...',
            icon: 'success',
            confirmButtonText: 'Okay',
          }).then(() => {
            this.router.navigate(['/dashboard']);
          }); 
        },
        error:(error)=>{
          console.log('Login failed:', error);

          const errorMessage = error?.error?.message || 'Invalid credentials. Please try again.';

          Swal.fire({
            title: 'Error!',
            text: errorMessage,
            icon: 'error',
            confirmButtonText: 'Retry',
          });
        },
      })
    } else {
      console.log('Form is invalid');
      markFormGroupTouchedAndDirty(this.loginForm)
      Swal.fire({
        title: 'Error!',
        text: 'Form is invalid',
        icon: 'error',
        confirmButtonText: 'Retry',
      });
    }
  }
}
