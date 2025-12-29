import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ActivityService } from '../../core/services/activity.service';
import { User } from '../../core/models/user.model';
import { Activity } from '../../core/models/activity.model';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;

  // Clean Data for UI
  recentActivities: any[] = [];

  stats = {
    totalVisitors: 0,
    totalParcels: 0,
    totalResidents: 12, // Mocked for now as we don't have a resident service yet
    approvalRate: 0,
    visitorsPending: 0,
    visitorsApproved: 0,
    visitorsRejected: 0,
    parcelsPending: 0,
    parcelsCollected: 0
  };

  constructor(
    private authService: AuthService,
    private activityService: ActivityService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.router.navigate(['/login']);
      } else {
        // All roles can view dashboard now
        this.loadData();
      }
    });
  }

  loadData(): void {
    // Load Visitors
    this.activityService.getActivities('Visitor').subscribe(visitors => {
      let filteredVisitors = visitors;

      // Filter for Resident
      if (this.currentUser?.role === 'Resident') {
        const user = this.currentUser as any;
        if (user.unit_number) {
          filteredVisitors = visitors.filter((v: any) => v.resident_unit === user.unit_number);
        }
      }

      this.stats.totalVisitors = filteredVisitors.length;
      this.stats.visitorsPending = filteredVisitors.filter(v => v.status === 'Waiting for Approval').length;
      this.stats.visitorsApproved = filteredVisitors.filter(v => v.status === 'Approved' || v.status === 'Entered').length;
      this.stats.visitorsRejected = filteredVisitors.filter(v => v.status === 'Denied' || v.status === 'Rejected').length;

      this.calculateApprovalRate();
      this.mergeActivities(filteredVisitors, 'Visitor');
    });

    // Load Parcels
    this.activityService.getActivities('Parcel').subscribe(parcels => {
      let filteredParcels = parcels;

      // Filter for Resident
      if (this.currentUser?.role === 'Resident') {
        const user = this.currentUser as any;
        if (user.unit_number) {
          filteredParcels = parcels.filter((p: any) => p.resident_unit === user.unit_number);
        }
      }

      this.stats.totalParcels = filteredParcels.length;
      this.stats.parcelsPending = filteredParcels.filter(p => p.status !== 'Collected').length;
      this.stats.parcelsCollected = filteredParcels.filter(p => p.status === 'Collected').length;

      this.mergeActivities(filteredParcels, 'Parcel');
    });
  }

  calculateApprovalRate() {
    if (this.stats.totalVisitors === 0) {
      this.stats.approvalRate = 100;
      return;
    }
    // Rate of Approved vs (Approved + Rejected) - ignoring pending for "Approval Rate" usually
    // Or just Approved / Total. Let's do Approved / Total for simplicity or match the vibe.
    // The image shows 100% with varying data. 
    // Let's use (Approved / (Approved + Rejected)) * 100 if > 0
    const processed = this.stats.visitorsApproved + this.stats.visitorsRejected;
    if (processed === 0) {
      this.stats.approvalRate = 100;
    } else {
      this.stats.approvalRate = Math.round((this.stats.visitorsApproved / processed) * 100);
    }
  }

  private allActivities: any[] = [];

  mergeActivities(items: any[], type: 'Visitor' | 'Parcel') {
    // Add type to items
    const typedItems = items.map(item => ({ ...item, type }));

    // Merge into local bucket first to avoid clearing the other type
    // This is a simple way: we hold state for both. 
    // Actually, we can just push to a master list if we handle deduplication or reset.
    // Better: let's store them in separate temps if needed, but for now let's just combine.
    // Since these are async, we might overwrite. Let's fix.

    // We will use a simpler approach: filtering the existing allActivities is hard if we don't know what's there.
    // Let's assuming loadData calls are close enough or we just concat.
    // A safer way for this demo without major refactor:

    if (type === 'Visitor') {
      this.allActivities = this.allActivities.filter(a => a.type !== 'Visitor').concat(typedItems);
    } else {
      this.allActivities = this.allActivities.filter(a => a.type !== 'Parcel').concat(typedItems);
    }

    // Sort by created_at desc
    this.allActivities.sort((a, b) => {
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });

    this.recentActivities = this.allActivities.slice(0, 5);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
