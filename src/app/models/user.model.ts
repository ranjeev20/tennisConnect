export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  profileImage?: string;
  location: {
    city: string;
    postalCode: string;
    country: string;
  };
  tennisProfile: {
    skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    playingStyle: 'aggressive' | 'defensive' | 'all-around' | 'serve-and-volley' | 'baseline';
    preferredSurface: 'hard' | 'clay' | 'grass' | 'indoor' | 'any';
    availability: {
      weekdays: boolean;
      weekends: boolean;
      evenings: boolean;
      mornings: boolean;
    };
    skillBreakdown: {
      technique: number; // 1-10
      strategy: number; // 1-10
      fitness: number; // 1-10
      mental: number; // 1-10
      serve: number; // 1-10
      forehand: number; // 1-10
      backhand: number; // 1-10
      volley: number; // 1-10
    };
    experience: number; // years of playing
    tournaments: boolean;
    coaching: boolean;
    aboutMe?: string;
  };
  preferences: {
    partnerAgeRange?: {
      min: number;
      max: number;
    };
    partnerSkillLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'any';
    maxDistance?: number; // in kilometers
    genderPreference?: 'male' | 'female' | 'any';
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProfileFormData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dateOfBirth?: Date;
  };
  location: {
    city: string;
    postalCode: string;
    country: string;
  };
  tennisProfile: {
    skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    playingStyle: 'aggressive' | 'defensive' | 'all-around' | 'serve-and-volley' | 'baseline';
    preferredSurface: 'hard' | 'clay' | 'grass' | 'indoor' | 'any';
    availability: {
      weekdays: boolean;
      weekends: boolean;
      evenings: boolean;
      mornings: boolean;
    };
    skillBreakdown: {
      technique: number;
      strategy: number;
      fitness: number;
      mental: number;
      serve: number;
      forehand: number;
      backhand: number;
      volley: number;
    };
    experience: number;
    tournaments: boolean;
    coaching: boolean;
    aboutMe?: string;
  };
  preferences: {
    partnerAgeRange?: {
      min: number;
      max: number;
    };
    partnerSkillLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'any';
    maxDistance?: number;
    genderPreference?: 'male' | 'female' | 'any';
  };
}
