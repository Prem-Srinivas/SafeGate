import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { API_URL } from '../../core/constants';
import { AuthService } from '../../core/services/auth.service';
import { ActivityService } from '../../core/services/activity.service';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';

import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  currentUser: User | null = null;
  users: any[] = [];
  filteredUsers: any[] = [];
  displayedColumns: string[] = ['name', 'role', 'unit_or_badge', 'email', 'contact_info', 'created_at', 'actions'];
  today: Date = new Date();
  searchTerm: string = '';

  loading = true;

  stats = {
    totalUsers: 0,
    activeUsers: 0,
    totalVisitors: 0,
    totalParcels: 0,
    collectedParcels: 0,
    pendingApprovals: 0
  };

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private activityService: ActivityService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
    });

    this.loadUsers();
    this.loadAnalytics();
  }

  loadUsers() {
    this.http.get<any[]>(`${API_URL}/users`).subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
        this.stats.totalUsers = data.length;
        this.stats.activeUsers = data.length; // Assuming all are active for now
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadAnalytics() {
    // Load Visitors
    this.activityService.getActivities('Visitor').subscribe(visitors => {
      this.stats.totalVisitors = visitors.length;
      this.stats.pendingApprovals += visitors.filter((v: any) => v.status === 'Waiting for Approval').length;
    });

    // Load Parcels
    this.activityService.getActivities('Parcel').subscribe(parcels => {
      this.stats.totalParcels = parcels.length;
      this.stats.collectedParcels = parcels.filter((p: any) => p.status === 'Collected').length;
      this.stats.pendingApprovals += parcels.filter((p: any) => p.status !== 'Collected').length;
    });
  }

  filterUsers() {
    if (!this.searchTerm) {
      this.filteredUsers = this.users;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredUsers = this.users.filter(u =>
        u.name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.role?.toLowerCase().includes(term) ||
        u.unit_number?.toLowerCase().includes(term) ||
        u.contact_info?.toLowerCase().includes(term)
      );
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user? This cannot be undone.')) {
      this.http.delete(`${API_URL}/users/${id}`).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== id);
          this.filterUsers();
        },
        error: (err) => console.error('Error deleting user', err)
      });
    }
  }

  getRoleColor(role: string): string {
    switch (role) {
      case 'Admin': return 'warn';
      case 'Security Guard': return 'accent';
      case 'Resident': return 'primary';
      default: return 'basic';
    }
  }

  getInitials(name: string): string {
    if (!name) return '??';
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().substring(0, 2);
  }
}
