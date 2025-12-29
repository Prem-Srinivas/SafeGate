import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityService } from '../../core/services/activity.service';
import { AuthService } from '../../core/services/auth.service';
import { Activity } from '../../core/models/activity.model';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { User } from '../../core/models/user.model';

@Component({
    selector: 'app-resident-approval',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatSnackBarModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './resident-approval.component.html',
    styleUrls: ['./resident-approval.component.css']
})
export class ResidentApprovalComponent implements OnInit {
    visitors: Activity[] = [];
    loading = true;
    currentUser: User | null = null;

    constructor(
        private activityService: ActivityService,
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit() {
        this.authService.user$.subscribe(user => {
            this.currentUser = user;
        });
        this.loadVisitors();
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    loadVisitors() {
        const user = this.authService.currentUserValue;
        if (user && user.id) {
            this.activityService.getActivities('Visitor', user.id).subscribe({
                next: (data) => {
                    this.visitors = data;
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Resident Visitor Load Error:', err);
                    this.loading = false;
                    const errorMessage = err.error?.error || err.error?.message || 'Failed to load visitors.';
                    this.snackBar.open(errorMessage, 'Close', {
                        duration: 5000,
                        panelClass: ['error-snackbar']
                    });
                }
            });
        } else {
            this.loading = false;
        }
    }

    updateStatus(id: number | undefined, status: string) {
        if (!id) return;
        this.activityService.updateStatus(id, status).subscribe({
            next: () => {
                this.snackBar.open(`Visitor ${status.toLowerCase()}!`, 'Close', { duration: 2000 });
                this.loadVisitors(); // Refresh list
            },
            error: () => {
                this.snackBar.open('Failed to update status.', 'Close', { duration: 3000 });
            }
        });
    }

    getStatusColor(status: string): string {
        switch (status) {
            case 'Waiting for Approval': return 'accent';
            case 'Approved': return 'primary';
            case 'Rejected': return 'warn';
            case 'Entered': return 'primary';
            case 'Exited': return 'basic';
            default: return 'basic';
        }
    }

    getPendingCount(): number {
        return this.visitors.filter(v => v.status === 'Waiting for Approval').length;
    }

    getHistoryCount(): number {
        return this.visitors.filter(v => v.status !== 'Waiting for Approval').length;
    }

    getInitials(name: string): string {
        if (!name) return '??';
        return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().substring(0, 2);
    }
}
