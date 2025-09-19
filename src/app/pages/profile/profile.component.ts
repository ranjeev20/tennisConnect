import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { DemoDataService } from '../../services/demo-data.service';
import { UserProfile } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profile: UserProfile | null = null;
  isLoading = true;
  isViewingOwnProfile = true;
  currentUserId: string | null = null;

  constructor(
    private demoDataService: DemoDataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    // Get current user ID from localStorage
    this.currentUserId = this.getCurrentUserId();
    
    // Get profile ID from query parameters
    this.route.queryParams.subscribe(params => {
      const profileId = params['id'];
      
      if (profileId) {
        // Load specific profile by ID
        this.profile = this.demoDataService.getDemoProfiles().find(p => p.id === profileId) || null;
        // Check if viewing own profile or someone else's
        this.isViewingOwnProfile = this.currentUserId === profileId;
      } else {
        // Load current user's profile if no ID provided
        this.profile = this.demoDataService.getDemoProfile();
        this.isViewingOwnProfile = true;
        
        // If no profile found, redirect to login
        if (!this.profile) {
          this.router.navigate(['/login'], { 
            queryParams: { message: 'Please log in to view your profile' } 
          });
          return;
        }
      }
      
      this.isLoading = false;
    });
  }

  private getCurrentUserId(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        try {
          const user = JSON.parse(currentUser);
          return user.id || null;
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  }

  getSkillItems(): Array<{name: string, value: number}> {
    if (!this.profile?.tennisProfile?.skillBreakdown) {
      return [];
    }
    
    const skills = this.profile.tennisProfile.skillBreakdown;
    return Object.entries(skills).map(([key, value]) => ({
      name: key,
      value: value
    }));
  }

  editProfile(): void {
    // Navigate to profile editing page
    this.router.navigate(['/profile-creation']);
  }

  editProfileImage(): void {
    // Open image upload dialog or navigate to image editing
    console.log('Edit profile image clicked');
    // You can implement file upload logic here
  }

  editPersonalInfo(): void {
    // Navigate to personal info editing
    this.router.navigate(['/profile-creation'], { 
      queryParams: { section: 'personal' } 
    });
  }

  editTennisProfile(): void {
    // Navigate to tennis profile editing
    this.router.navigate(['/profile-creation'], { 
      queryParams: { section: 'tennis' } 
    });
  }

  editPreferences(): void {
    // Navigate to preferences editing
    this.router.navigate(['/profile-creation'], { 
      queryParams: { section: 'preferences' } 
    });
  }

  shareProfile(): void {
    if (navigator.share) {
      navigator.share({
        title: `${this.profile?.firstName} ${this.profile?.lastName} - TennisConnect Profile`,
        text: `Check out ${this.profile?.firstName}'s tennis profile on TennisConnect!`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        // You could show a toast notification here
        console.log('Profile URL copied to clipboard');
      });
    }
  }

  // Helper methods for conditional rendering
  hasProfileImage(): boolean {
    return !!this.profile?.profileImage;
  }

  getProfileImageUrl(): string {
    return this.profile?.profileImage || 'assets/images/userprofile/profile2.jpg';
  }

  getFormattedDate(date: Date | undefined): string {
    if (!date) return 'Not provided';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getAvailabilityText(): string {
    if (!this.profile?.tennisProfile?.availability) return 'Not specified';
    
    const availability = this.profile.tennisProfile.availability;
    const availableTimes = [];
    
    if (availability.weekdays) availableTimes.push('Weekdays');
    if (availability.weekends) availableTimes.push('Weekends');
    if (availability.evenings) availableTimes.push('Evenings');
    if (availability.mornings) availableTimes.push('Mornings');
    
    if (availableTimes.length === 0) return 'Not specified';
    if (availableTimes.length === 1) return availableTimes[0];
    if (availableTimes.length === 2) return availableTimes.join(' & ');
    
    const last = availableTimes.pop();
    return availableTimes.join(', ') + ' & ' + last;
  }

  getSkillLevelColor(skillLevel: string | undefined): string {
    if (!skillLevel) return '#6b7280';
    
    const colors = {
      'beginner': '#10b981',
      'intermediate': '#f59e0b',
      'advanced': '#ef4444',
      'expert': '#8b5cf6'
    };
    
    return colors[skillLevel as keyof typeof colors] || '#6b7280';
  }

  getAverageSkill(): number {
    const skills = this.profile?.tennisProfile?.skillBreakdown;
    if (!skills) return 0;
    
    const values = Object.values(skills);
    return Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
  }

  // Loading state
  get isLoadingProfile(): boolean {
    return this.isLoading;
  }

  // Methods for viewing other profiles
  contactProfile(): void {
    if (!this.profile) return;
    
    // Simulate contact action
    console.log('Contacting:', this.profile.firstName, this.profile.lastName);
    // In a real app, this would open a contact form or send a message
    alert(`Contact request sent to ${this.profile.firstName} ${this.profile.lastName}!`);
  }

  sendMatchRequest(): void {
    if (!this.profile) return;
    
    // Simulate match request
    console.log('Sending match request to:', this.profile.firstName, this.profile.lastName);
    // In a real app, this would send a match request
    alert(`Match request sent to ${this.profile.firstName} ${this.profile.lastName}!`);
  }

  goBackToFindPartners(): void {
    this.router.navigate(['/find-partner']);
  }

  // Helper method to check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.currentUserId;
  }
}
