import { Injectable } from '@angular/core';
import { UserProfile } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DemoDataService {

  // Demo login credentials
  getDemoCredentials() {
    return [
      { id: '1', username: 'alex.martinez', password: 'tennis123', email: 'alex.martinez@email.com' },
      { id: '2', username: 'sarah.berg', password: 'tennis456', email: 'sarah.vanderberg@email.com' },
      { id: '3', username: 'marco.rossi', password: 'tennis789', email: 'marco.rossi@email.com' }
    ];
  }

  // Validate login credentials
  validateLogin(username: string, password: string): { success: boolean; userId?: string; profile?: UserProfile } {
    const credentials = this.getDemoCredentials();
    const user = credentials.find(c => c.username === username && c.password === password);
    
    if (user) {
      const profile = this.getDemoProfiles().find(p => p.id === user.id);
      return { success: true, userId: user.id, profile: profile || undefined };
    }
    
    return { success: false };
  }

  getDemoProfiles(): UserProfile[] {
    return [
      {
        id: '1',
        firstName: 'Alex',
        lastName: 'Martinez',
        email: 'alex.martinez@email.com',
        phone: '+31 6 12345678',
        dateOfBirth: new Date('1990-05-15'),
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        location: {
          city: 'Rotterdam',
          postalCode: '3011 AA',
          country: 'Netherlands'
        },
        tennisProfile: {
          skillLevel: 'advanced',
          playingStyle: 'aggressive',
          preferredSurface: 'hard',
          availability: {
            weekdays: true,
            weekends: true,
            evenings: true,
            mornings: false
          },
          skillBreakdown: {
            technique: 8,
            strategy: 7,
            fitness: 9,
            mental: 6,
            serve: 8,
            forehand: 9,
            backhand: 7,
            volley: 6
          },
          experience: 12,
          tournaments: true,
          coaching: false,
          aboutMe: 'Competitive player who loves aggressive baseline play. Looking for challenging matches and tournament partners.'
        },
        preferences: {
          partnerAgeRange: { min: 25, max: 40 },
          partnerSkillLevel: 'advanced',
          maxDistance: 30,
          genderPreference: 'any'
        },
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        firstName: 'Sarah',
        lastName: 'van der Berg',
        email: 'sarah.vanderberg@email.com',
        phone: '+31 6 87654321',
        dateOfBirth: new Date('1988-12-03'),
       profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        location: {
          city: 'Rotterdam',
          postalCode: '3012 BB',
          country: 'Netherlands'
        },
        tennisProfile: {
          skillLevel: 'intermediate',
          playingStyle: 'all-around',
          preferredSurface: 'clay',
          availability: {
            weekdays: true,
            weekends: false,
            evenings: true,
            mornings: true
          },
          skillBreakdown: {
            technique: 6,
            strategy: 7,
            fitness: 8,
            mental: 8,
            serve: 5,
            forehand: 7,
            backhand: 6,
            volley: 5
          },
          experience: 6,
          tournaments: false,
          coaching: false,
          aboutMe: 'Friendly player who enjoys social tennis and improving my game. Prefer clay courts for the slower pace.'
        },
        preferences: {
          partnerAgeRange: { min: 25, max: 45 },
          partnerSkillLevel: 'intermediate',
          maxDistance: 25,
          genderPreference: 'any'
        },
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
      },
      {
        id: '3',
        firstName: 'Marco',
        lastName: 'Rossi',
        email: 'marco.rossi@email.com',
        phone: '+31 6 11223344',
        dateOfBirth: new Date('1995-08-22'),
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        location: {
          city: 'Rotterdam',
          postalCode: '3013 CC',
          country: 'Netherlands'
        },
        tennisProfile: {
          skillLevel: 'expert',
          playingStyle: 'serve-and-volley',
          preferredSurface: 'grass',
          availability: {
            weekdays: true,
            weekends: true,
            evenings: false,
            mornings: true
          },
          skillBreakdown: {
            technique: 9,
            strategy: 9,
            fitness: 8,
            mental: 9,
            serve: 10,
            forehand: 8,
            backhand: 8,
            volley: 10
          },
          experience: 18,
          tournaments: true,
          coaching: true,
          aboutMe: 'Former college player and current coach. Specialize in serve-and-volley tactics. Available for coaching sessions.'
        },
        preferences: {
          partnerAgeRange: { min: 18, max: 50 },
          partnerSkillLevel: 'advanced',
          maxDistance: 40,
          genderPreference: 'any'
        },
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05')
      }
    ];
  }

  getDemoProfile(): UserProfile | null {
    // Get current user from localStorage
    if (typeof window !== 'undefined' && localStorage) {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        try {
          const user = JSON.parse(currentUser);
          const profile = this.getDemoProfiles().find(p => p.id === user.id);
          return profile || null;
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  }
}
