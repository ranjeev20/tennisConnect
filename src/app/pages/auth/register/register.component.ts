import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  currentStep = 1;
  isSubmitting = false;
  
  // Image upload properties
  profileImagePreview: string | null = null;
  selectedImage: File | null = null;
  imageError: string = '';
  
  // Password visibility properties
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.setupPasswordValidation();
  }

  private initForm(): void {
    this.registerForm = this.fb.group({
      // Step 1: Account Information
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],

      // Step 2: Personal Information
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phone: [''],
      dateOfBirth: [''],
      city: ['', [Validators.required]],
      postalCode: [''],
      country: ['', [Validators.required]],

      // Step 3: Tennis Profile
      skillLevel: ['', [Validators.required]],
      playingStyle: ['', [Validators.required]],
      preferredSurface: ['', [Validators.required]],
      weekdays: [false],
      weekends: [false],
      evenings: [false],
      mornings: [false],
      experience: ['', [Validators.required, Validators.min(0), Validators.max(50)]],
      aboutMe: [''],

      // Step 4: Partner Preferences
      minAge: [18, [Validators.min(18), Validators.max(80)]],
      maxAge: [80, [Validators.min(18), Validators.max(80)]],
      partnerSkillLevel: ['any'],
      maxDistance: [25, [Validators.min(1), Validators.max(100)]],
      genderPreference: ['any'],
      tournaments: [false],
      coaching: [false]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(form: FormGroup): { [key: string]: any } | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value && confirmPassword.value && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  hasPasswordMismatch(): boolean {
    const confirmPasswordField = this.registerForm.get('confirmPassword');
    return this.registerForm.hasError('passwordMismatch') && 
           (confirmPasswordField?.dirty || confirmPasswordField?.touched || false);
  }

  passwordsMatch(): boolean {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    const confirmPasswordField = this.registerForm.get('confirmPassword');
    
    return password && confirmPassword && 
           password === confirmPassword && 
           (confirmPasswordField?.dirty || confirmPasswordField?.touched || false);
  }

  private setupPasswordValidation(): void {
    // Trigger validation when either password field changes
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.registerForm.get('confirmPassword')?.updateValueAndValidity();
    });

    this.registerForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.registerForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  isCurrentStepValid(): boolean {
    const stepFields = this.getStepFields(this.currentStep);
    return stepFields.every(field => {
      const control = this.registerForm.get(field);
      return control ? control.valid : true;
    });
  }

  private getStepFields(step: number): string[] {
    switch (step) {
      case 1:
        return ['email', 'password', 'confirmPassword'];
      case 2:
        return ['firstName', 'lastName', 'city', 'country'];
      case 3:
        return ['skillLevel', 'playingStyle', 'preferredSurface', 'experience'];
      case 4:
        return [];
      default:
        return [];
    }
  }

  nextStep(): void {
    if (this.isCurrentStepValid() && this.currentStep < 4) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isSubmitting = true;
      
      // Prepare form data including image
      const formData = {
        ...this.registerForm.value,
        profileImage: this.getImageData(),
        profileImageFile: this.selectedImage
      };
      
      // Simulate API call
      setTimeout(() => {
        console.log('Registration form submitted:', formData);
        
        // Here you would typically send the data to your backend
        // For now, we'll just redirect to the profile creation page
        this.router.navigate(['/profile-creation']);
        
        this.isSubmitting = false;
      }, 2000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  // Helper methods for form validation
  getPasswordStrength(): string {
    const password = this.registerForm.get('password')?.value;
    if (!password) return '';
    
    const hasLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const score = [hasLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
    
    if (score <= 2) return 'weak';
    if (score <= 3) return 'fair';
    if (score <= 4) return 'good';
    return 'strong';
  }

  getPasswordStrengthColor(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 'weak': return '#ef4444';
      case 'fair': return '#f59e0b';
      case 'good': return '#10b981';
      case 'strong': return '#059669';
      default: return '#6b7280';
    }
  }

  // Image upload methods
  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    // Clear previous errors
    this.imageError = '';

    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.imageError = 'Please select a valid image file (JPG, PNG, or GIF)';
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      this.imageError = 'Image size must be less than 5MB';
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.profileImagePreview = e.target.result;
      this.selectedImage = file;
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.profileImagePreview = null;
    this.selectedImage = null;
    this.imageError = '';
    
    // Reset file input
    const fileInput = document.getElementById('profileImage') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // Get image data for form submission
  getImageData(): string | null {
    return this.profileImagePreview;
  }

  // Password visibility methods
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
