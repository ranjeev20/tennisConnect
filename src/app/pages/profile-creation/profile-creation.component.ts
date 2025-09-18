import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ProfileFormData } from '../../models/user.model';

@Component({
  selector: 'app-profile-creation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './profile-creation.component.html',
  styleUrls: ['./profile-creation.component.scss']
})
export class ProfileCreationComponent implements OnInit {
  currentStep = 1;
  totalSteps = 4;
  profileForm: FormGroup;
  isLoading = false;

  skillLevels = [
    { value: 'beginner', label: 'Beginner', description: 'New to tennis or learning basics' },
    { value: 'intermediate', label: 'Intermediate', description: 'Can play rallies and understand strategy' },
    { value: 'advanced', label: 'Advanced', description: 'Competitive player with good technique' },
    { value: 'expert', label: 'Expert', description: 'Tournament level player' }
  ];

  playingStyles = [
    { value: 'aggressive', label: 'Aggressive', description: 'Attack-oriented, powerful shots' },
    { value: 'defensive', label: 'Defensive', description: 'Counter-puncher, consistent play' },
    { value: 'all-around', label: 'All-Around', description: 'Balanced approach, adaptable' },
    { value: 'serve-and-volley', label: 'Serve & Volley', description: 'Net player, aggressive at net' },
    { value: 'baseline', label: 'Baseline', description: 'Groundstroke specialist, from back' }
  ];

  surfaces = [
    { value: 'hard', label: 'Hard Court', description: 'Fast, consistent bounce' },
    { value: 'clay', label: 'Clay Court', description: 'Slower, high bounce' },
    { value: 'grass', label: 'Grass Court', description: 'Very fast, low bounce' },
    { value: 'indoor', label: 'Indoor', description: 'Climate controlled, consistent' },
    { value: 'any', label: 'Any Surface', description: 'No preference' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      personalInfo: this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone: [''],
        dateOfBirth: ['']
      }),
      location: this.fb.group({
        city: ['', Validators.required],
        postalCode: ['', Validators.required],
        country: ['Netherlands', Validators.required]
      }),
      tennisProfile: this.fb.group({
        skillLevel: ['', Validators.required],
        playingStyle: ['', Validators.required],
        preferredSurface: ['', Validators.required],
        availability: this.fb.group({
          weekdays: [false],
          weekends: [false],
          evenings: [false],
          mornings: [false]
        }),
        skillBreakdown: this.fb.group({
          technique: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
          strategy: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
          fitness: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
          mental: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
          serve: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
          forehand: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
          backhand: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
          volley: [5, [Validators.required, Validators.min(1), Validators.max(10)]]
        }),
        experience: [1, [Validators.required, Validators.min(0)]],
        tournaments: [false],
        coaching: [false],
        aboutMe: ['']
      }),
      preferences: this.fb.group({
        partnerAgeRange: this.fb.group({
          min: [18, [Validators.required, Validators.min(16)]],
          max: [65, [Validators.required, Validators.max(80)]]
        }),
        partnerSkillLevel: ['any', Validators.required],
        maxDistance: [25, [Validators.required, Validators.min(1), Validators.max(100)]],
        genderPreference: ['any', Validators.required]
      })
    });
  }

  ngOnInit(): void {
    // Set default values for availability
    this.profileForm.patchValue({
      tennisProfile: {
        availability: {
          weekdays: true,
          weekends: true,
          evenings: true
        }
      }
    });
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps && this.isCurrentStepValid()) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep = step;
    }
  }

  isCurrentStepValid(): boolean {
    const stepControls = this.getStepControls(this.currentStep);
    if (!stepControls) return true;

    const stepForm = this.fb.group(stepControls);
    return stepForm.valid;
  }

  getStepControls(step: number): any {
    switch (step) {
      case 1:
        return this.profileForm.get('personalInfo')?.value;
      case 2:
        return this.profileForm.get('location')?.value;
      case 3:
        return this.profileForm.get('tennisProfile')?.value;
      case 4:
        return this.profileForm.get('preferences')?.value;
      default:
        return null;
    }
  }

  getStepProgress(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  async onSubmit(): Promise<void> {
    if (this.profileForm.valid) {
      this.isLoading = true;
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const formData: ProfileFormData = this.profileForm.value;
        console.log('Profile data:', formData);
        
        // Here you would typically send the data to your backend
        // await this.profileService.createProfile(formData);
        
        // Navigate to success page or profile page
        this.router.navigate(['/profile']);
      } catch (error) {
        console.error('Error creating profile:', error);
        // Handle error (show error message)
      } finally {
        this.isLoading = false;
      }
    }
  }

  getStepTitle(step: number): string {
    const titles = [
      'Personal Information',
      'Location',
      'Tennis Profile',
      'Preferences'
    ];
    return titles[step - 1] || '';
  }

  getStepDescription(step: number): string {
    const descriptions = [
      'Tell us about yourself',
      'Where are you located?',
      'What\'s your tennis background?',
      'What are you looking for?'
    ];
    return descriptions[step - 1] || '';
  }
}
