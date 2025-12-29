import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-wrapper animate-slide-up flex flex-col items-center justify-center min-h-[70vh] text-center">
      <div class="premium-card max-w-md p-12">
        <div class="stat-icon-bg warning mx-auto mb-6 w-20 h-20">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h1 class="text-6xl font-black mb-2 text-primary">404</h1>
        <h2 class="text-2xl font-bold mb-4">Page Not Found</h2>
        <p class="text-muted-foreground mb-8">
          The path you're looking for doesn't exist or you might have taken a wrong turn.
        </p>
        <button routerLink="/dashboard" class="btn-premium w-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Return Home
        </button>
      </div>
    </div>
  `
})
export class NotFoundComponent { }
