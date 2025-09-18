import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(): boolean {
    // Only check localStorage in browser environment
    if (isPlatformBrowser(this.platformId)) {
      const currentUser = localStorage.getItem('currentUser');
      
      if (currentUser) {
        return true; // User is authenticated
      } else {
        // User is not authenticated, redirect to login
        this.router.navigate(['/login']);
        return false;
      }
    }
    
    // For server-side rendering, allow access
    return true;
  }
}
