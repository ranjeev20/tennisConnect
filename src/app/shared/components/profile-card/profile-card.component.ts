import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfile } from '../../../models/user.model';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent {
  @Input() profile!: UserProfile;
  @Input() showActions: boolean = true;
  @Output() viewProfile = new EventEmitter<string>();
  @Output() contactPlayer = new EventEmitter<string>();

  getSkillLevelColor(level: string): string {
    const colors = {
      'beginner': '#10b981',
      'intermediate': '#f59e0b',
      'advanced': '#ef4444',
      'expert': '#8b5cf6'
    };
    return colors[level as keyof typeof colors] || '#6b7280';
  }

  getAverageSkill(): number {
    const skills = this.profile.tennisProfile.skillBreakdown;
    const values = Object.values(skills);
    return Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
  }

  getSkillItems(): Array<{name: string, value: number}> {
    const skills = this.profile.tennisProfile.skillBreakdown;
    return Object.entries(skills).map(([key, value]) => ({
      name: key,
      value: value
    }));
  }

  onViewProfile(): void {
    this.viewProfile.emit(this.profile.id);
  }

  onContactPlayer(): void {
    this.contactPlayer.emit(this.profile.id);
  }

  onImageError(event: any): void {
    console.error('Image failed to load:', event.target.src);
    console.log('Profile data:', this.profile);
  }

  onImageLoad(event: any): void {
    console.log('Image loaded successfully:', event.target.src);
  }
}
