import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-authorized',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-wrapper animate-slide-up flex flex-col items-center justify-center min-h-[70vh] text-center">
      <div class="premium-card max-w-md p-12">
        <div class="stat-icon-bg warning mx-auto mb-6 w-20 h-20" style="background: var(--status-error-bg); color: var(--status-error-text);">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <h1 class="text-4xl font-black mb-2 text-primary">Restricted</h1>
        <h2 class="text-xl font-bold mb-4">Unauthorized Access</h2>
        <p class="text-muted-foreground mb-8">
          You don't have the necessary permissions to access this feature. Please contact your administrator.
        </p>
        <button routerLink="/login" class="btn-premium w-full shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Go to Login
        </button>
      </div>
    </div>
  `
})
export class NotAuthorizedComponent { }
