import { Component, inject } from '@angular/core';
import { InputFieldsComponent } from '../../../shared/components/reusables/input-fields/input-fields.component';
import { FormBuilder,FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { alphabetsOnlyValidator, markFormGroupTouchedAndDirty, mobileNumberValidator, noWhitespaceValidator, passwordMatchValidator, strongPasswordValidator } from '../../../shared/validators/validators';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [InputFieldsComponent,ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;

  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private router = inject(Router)

  constructor() {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, alphabetsOnlyValidator(),noWhitespaceValidator()]],
        email: ['', [Validators.required, Validators.email,noWhitespaceValidator()]],
        mobile: ['', [Validators.required, mobileNumberValidator(),noWhitespaceValidator()]],
        password: ['', [Validators.required, strongPasswordValidator()]],
        confirmPassword: ['', Validators.required]
      },
      { validators: passwordMatchValidator }
    );
  }

  onSubmit() {
    if (this.registerForm.valid) {
     const user = this.registerForm.value
     this.authService.registerUser(user).subscribe({
      next:(response)=>{
        Swal.fire({
          title: 'Success!',
          text: response.message || 'Register successful! Redirecting...',
          icon: 'success',
          confirmButtonText: 'Okay',
        }).then( ()=>{
          this.router.navigate(['/login'])
        })
      },
      error:(error)=>{
        console.log('Registration failed:', error);

        const errorMessage = error?.error?.message || 'An error occurred during registration. Please try again later.';

        Swal.fire({
          title: 'Error!',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'Retry',
        });
      }
     })
    } else {
      markFormGroupTouchedAndDirty(this.registerForm);
      console.log('Form is invalid');
      Swal.fire({
        title: 'Error!',
        text: 'Form is invalid',
        icon: 'error',
        confirmButtonText: 'Retry',
      });
    }
  }
  
  
}
