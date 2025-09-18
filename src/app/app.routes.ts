import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'profile-creation',
    loadComponent: () => import('./pages/profile-creation/profile-creation.component').then(m => m.ProfileCreationComponent)
  },
  {
    path: 'find-partner',
    loadComponent: () => import('./pages/find-partner/find-partner.component').then(m => m.FindPartnerComponent)
  },
  {
    path: 'find-court',
    loadComponent: () => import('./pages/find-court/find-court.component').then(m => m.FindCourtComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
