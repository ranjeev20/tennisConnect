import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-find-court',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  template: `
    <app-header></app-header>
    <main class="find-court-page">
      <div class="container">
        <h1>Find Tennis Court</h1>
        <p>This feature will be implemented soon. You'll be able to search for tennis courts in Rotterdam and book them online.</p>
        <a routerLink="/profile-creation" class="btn btn-primary">Comming soon...</a>
      </div>
    </main>
  `,
  styles: [`
    .find-court-page {
      padding: 100px 0;
      text-align: center;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
    }
    h1 {
      margin-bottom: 20px;
      color: #1e293b;
    }
    p {
      margin-bottom: 30px;
      color: #64748b;
      font-size: 1.125rem;
    }
    .btn {
      padding: 16px 32px;
      background: #10b981;
      color: white;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    .btn:hover {
      background: #059669;
      transform: translateY(-2px);
    }
  `]
})
export class FindCourtComponent {}
