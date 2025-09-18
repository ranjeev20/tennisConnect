import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { DemoDataService } from '../../services/demo-data.service';
import { UserProfile } from '../../models/user.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  features = [
    {
      icon: '🎾',
      title: 'Find Tennis Partners',
      description: 'Connect with players of similar skill levels in Rotterdam',
      link: '/find-partner'
    },
    {
      icon: '🏟️',
      title: 'Discover Courts',
      description: 'Find and book tennis courts near you',
      link: '/find-court'
    },
    {
      icon: '📊',
      title: 'Skill Matching',
      description: 'Advanced algorithm to match you with compatible players',
      link: '/profile'
    },
    {
      icon: '🌍',
      title: 'Local Community',
      description: 'Join Rotterdam\'s vibrant tennis community',
      link: '/register'
    }
  ];

  stats = [
    { number: '20', label: 'Active Players' },
    { number: '10', label: 'Tennis Courts' },
    { number: '50+', label: 'Matches Played' },
    { number: '95%', label: 'Satisfaction Rate' }
  ];

  demoProfiles: UserProfile[] = [];

  constructor(
    private demoDataService: DemoDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.demoProfiles = this.demoDataService.getDemoProfiles();
  }

  onViewProfile(profileId: string): void {
    console.log('View profile:', profileId);
    // Navigate to profile page with specific profile ID
    this.router.navigate(['/profile'], { queryParams: { id: profileId } });
  }

  onContactPlayer(profileId: string): void {
    console.log('Contact player:', profileId);
    // Open contact modal or navigate to contact page
  }
}
