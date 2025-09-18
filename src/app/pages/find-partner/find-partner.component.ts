import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { DemoDataService } from '../../services/demo-data.service';
import { UserProfile } from '../../models/user.model';

@Component({
  selector: 'app-find-partner',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './find-partner.component.html',
  styleUrls: ['./find-partner.component.scss']
})
export class FindPartnerComponent implements OnInit {
  // Search and filter properties
  searchQuery: string = '';
  selectedSkillLevel: string = '';
  selectedLocation: string = '';
  selectedPlayingStyle: string = '';
  selectedMaxDistance: number = 25;
  
  filters = {
    weekdays: false,
    weekends: false,
    evenings: false,
    mornings: false
  };

  // Data properties
  allPartners: UserProfile[] = [];
  filteredPartners: UserProfile[] = [];
  isLoading: boolean = false;
  hasMoreResults: boolean = false;
  currentPage: number = 1;
  partnersPerPage: number = 6;
  
  // Action states
  isActionLoading: boolean = false;
  loadingProfileId: string | null = null;
  actionMessage: string = '';
  actionType: 'success' | 'error' | 'info' | '' = '';
  showActionMessage: boolean = false;
  
  // Contextual login prompts
  showLoginPromptFor: string | null = null;
  loginPromptAction: 'view' | 'contact' | 'match' | null = null;

  constructor(
    private demoDataService: DemoDataService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadPartners();
  }

  loadPartners(): void {
    this.isLoading = true;
    
    // Simulate API call delay
    setTimeout(() => {
      this.allPartners = this.demoDataService.getDemoProfiles();
      this.applyFilters();
      this.isLoading = false;
    }, 1000);
  }

  onSearchChange(): void {
    // Debounce search - apply filters after user stops typing
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.applyFilters();
    }, 300);
  }

  private searchTimeout: any;

  performSearch(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.allPartners];

    // Search query filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(partner => 
        partner.firstName.toLowerCase().includes(query) ||
        partner.lastName.toLowerCase().includes(query) ||
        partner.location.city.toLowerCase().includes(query) ||
        partner.tennisProfile.skillLevel.toLowerCase().includes(query) ||
        partner.tennisProfile.playingStyle.toLowerCase().includes(query)
      );
    }

    // Skill level filter
    if (this.selectedSkillLevel) {
      filtered = filtered.filter(partner => 
        partner.tennisProfile.skillLevel === this.selectedSkillLevel
      );
    }

    // Location filter
    if (this.selectedLocation) {
      filtered = filtered.filter(partner => 
        partner.location.city === this.selectedLocation
      );
    }

    // Playing style filter
    if (this.selectedPlayingStyle) {
      filtered = filtered.filter(partner => 
        partner.tennisProfile.playingStyle === this.selectedPlayingStyle
      );
    }

    // Availability filters
    const hasAvailabilityFilter = Object.values(this.filters).some(value => value);
    if (hasAvailabilityFilter) {
      filtered = filtered.filter(partner => {
        const availability = partner.tennisProfile.availability;
        return (
          (!this.filters.weekdays || availability.weekdays) &&
          (!this.filters.weekends || availability.weekends) &&
          (!this.filters.evenings || availability.evenings) &&
          (!this.filters.mornings || availability.mornings)
        );
      });
    }

    this.filteredPartners = filtered;
    this.hasMoreResults = this.filteredPartners.length > this.partnersPerPage;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedSkillLevel = '';
    this.selectedLocation = '';
    this.selectedPlayingStyle = '';
    this.selectedMaxDistance = 25;
    this.filters = {
      weekdays: false,
      weekends: false,
      evenings: false,
      mornings: false
    };
    this.applyFilters();
  }

  loadMorePartners(): void {
    // Simulate loading more partners
    this.isLoading = true;
    setTimeout(() => {
      this.currentPage++;
      this.isLoading = false;
      // In a real app, you would load more data from the API
    }, 1000);
  }

  getAverageSkill(partner: UserProfile): number {
    const skills = partner.tennisProfile.skillBreakdown;
    const values = Object.values(skills);
    return Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
  }

  trackByPartnerId(index: number, partner: UserProfile): string {
    return partner.id;
  }

  viewProfile(partnerId: string): void {
    // Check if user is authenticated
    if (this.isAuthenticated()) {
      this.router.navigate(['/profile'], { queryParams: { id: partnerId } });
    } else {
      // Show contextual login prompt
      this.showLoginPromptFor = partnerId;
      this.loginPromptAction = 'view';
    }
  }

  private isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('currentUser');
    }
    return false;
  }

  isProfileLoading(partnerId: string): boolean {
    return this.isActionLoading && this.loadingProfileId === partnerId;
  }

  contactPartner(partnerId: string): void {
    // Check if user is authenticated
    if (!this.isAuthenticated()) {
      this.showLoginPromptFor = partnerId;
      this.loginPromptAction = 'contact';
      return;
    }

    // Find the partner details
    const partner = this.allPartners.find(p => p.id === partnerId);
    if (!partner) {
      this.showActionMessage = true;
      this.actionType = 'error';
      this.actionMessage = 'Partner not found';
      this.hideMessageAfterDelay();
      return;
    }

    // Simulate contact action
    this.isActionLoading = true;
    this.loadingProfileId = partnerId;
    setTimeout(() => {
      this.isActionLoading = false;
      this.loadingProfileId = null;
      this.showActionMessage = true;
      this.actionType = 'success';
      this.actionMessage = `Contact request sent to ${partner.firstName} ${partner.lastName}. They will be notified via email.`;
      this.hideMessageAfterDelay();
      
      // In a real app, this would:
      // 1. Open a contact form modal
      // 2. Send email notification to the partner
      // 3. Store the contact request in the database
      console.log('Contact request sent to:', partner.firstName, partner.lastName, partner.email);
    }, 1000);
  }

  sendMatchRequest(partnerId: string): void {
    // Check if user is authenticated
    if (!this.isAuthenticated()) {
      this.showLoginPromptFor = partnerId;
      this.loginPromptAction = 'match';
      return;
    }

    // Find the partner details
    const partner = this.allPartners.find(p => p.id === partnerId);
    if (!partner) {
      this.showActionMessage = true;
      this.actionType = 'error';
      this.actionMessage = 'Partner not found';
      this.hideMessageAfterDelay();
      return;
    }

    // Simulate match request action
    this.isActionLoading = true;
    this.loadingProfileId = partnerId;
    setTimeout(() => {
      this.isActionLoading = false;
      this.loadingProfileId = null;
      this.showActionMessage = true;
      this.actionType = 'success';
      this.actionMessage = `Match request sent to ${partner.firstName} ${partner.lastName}! They will be notified and can accept or decline your request.`;
      this.hideMessageAfterDelay();
      
      // In a real app, this would:
      // 1. Store the match request in the database
      // 2. Send notification to the partner
      // 3. Update the partner's pending requests
      console.log('Match request sent to:', partner.firstName, partner.lastName);
    }, 1000);
  }

  private hideMessageAfterDelay(): void {
    setTimeout(() => {
      this.showActionMessage = false;
      this.actionMessage = '';
      this.actionType = '';
    }, 5000);
  }

  // Login prompt methods
  closeLoginPrompt(): void {
    this.showLoginPromptFor = null;
    this.loginPromptAction = null;
  }

  proceedToLogin(): void {
    const partnerId = this.showLoginPromptFor;
    const action = this.loginPromptAction;
    
    if (!partnerId || !action) return;

    let returnUrl = '';
    let message = '';

    switch (action) {
      case 'view':
        returnUrl = `/profile?id=${partnerId}`;
        message = 'Please log in to view partner profiles';
        break;
      case 'contact':
        returnUrl = `/find-partner`;
        message = 'Please log in to contact partners';
        break;
      case 'match':
        returnUrl = `/find-partner`;
        message = 'Please log in to send match requests';
        break;
    }

    this.router.navigate(['/login'], { 
      queryParams: { 
        returnUrl: returnUrl,
        message: message
      } 
    });
  }

  getLoginPromptMessage(): string {
    switch (this.loginPromptAction) {
      case 'view':
        return 'Log in to view this partner\'s full profile';
      case 'contact':
        return 'Log in to contact this partner';
      case 'match':
        return 'Log in to send a match request';
      default:
        return 'Please log in to continue';
    }
  }
}
