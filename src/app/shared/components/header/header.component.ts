import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isDarkTheme = false;
  isMobileMenuOpen = false;
  isScrolled = false;
  windowWidth = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Only access localStorage in browser environment
    if (isPlatformBrowser(this.platformId)) {
      // Load theme preference from localStorage
      const savedTheme = localStorage.getItem('theme');
      this.isDarkTheme = savedTheme === 'dark';
      this.applyTheme();
      
      // Initialize window width
      this.windowWidth = window.innerWidth;
    }
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (isPlatformBrowser(this.platformId)) {
      this.windowWidth = event.target.innerWidth;
      
      // Close mobile menu on resize to desktop
      if (this.windowWidth > 767 && this.isMobileMenuOpen) {
        this.isMobileMenuOpen = false;
      }
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled = window.scrollY > 10;
    }
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
    }
    this.applyTheme();
  }

  private applyTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.setAttribute('data-theme', this.isDarkTheme ? 'dark' : 'light');
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  // Helper methods for responsive behavior
  isMobile(): boolean {
    return this.windowWidth <= 767;
  }

  isTablet(): boolean {
    return this.windowWidth > 767 && this.windowWidth <= 991;
  }

  isDesktop(): boolean {
    return this.windowWidth > 991;
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('currentUser');
    }
    return false;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
      this.router.navigate(['/']);
    }
  }

}
