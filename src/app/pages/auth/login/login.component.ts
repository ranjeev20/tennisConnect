import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { DemoDataService } from '../../../services/demo-data.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage = '';
  returnUrl: string = '/profile';
  message: string = '';

  demoAccounts = [
    { name: 'Alex Martinez', username: 'alex.martinez', password: 'tennis123' },
    { name: 'Sarah van der Berg', username: 'sarah.berg', password: 'tennis456' },
    { name: 'Marco Rossi', username: 'marco.rossi', password: 'tennis789' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private demoDataService: DemoDataService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Check if user is already logged in
    const currentUser = localStorage.getItem('currentUser');
    console.log('Login component initialized. Current user:', currentUser);
    
    // Get return URL and message from query parameters
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/profile';
    this.message = this.route.snapshot.queryParams['message'] || '';
    
    if (currentUser) {
      console.log('User already logged in, redirecting to:', this.returnUrl);
      this.router.navigateByUrl(this.returnUrl);
    } else {
      console.log('No user found, staying on login page');
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { username, password } = this.loginForm.value;

      // Simulate API call delay
      setTimeout(() => {
        const result = this.demoDataService.validateLogin(username, password);
        
        if (result.success && result.profile) {
          // Store user data in localStorage
          localStorage.setItem('currentUser', JSON.stringify({
            id: result.userId,
            username: username,
            profile: result.profile
          }));

          // Navigate to return URL or profile page
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.errorMessage = 'Invalid username or password. Please try again.';
        }
        
        this.isLoading = false;
      }, 1000);
    } else {
      this.markFormGroupTouched();
    }
  }

  fillDemoCredentials(account: any): void {
    this.loginForm.patchValue({
      username: account.username,
      password: account.password
    });
    this.errorMessage = '';
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
}
