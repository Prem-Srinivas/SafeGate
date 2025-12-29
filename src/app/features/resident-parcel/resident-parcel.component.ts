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
    selector: 'app-resident-parcel',
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
    templateUrl: './resident-parcel.component.html',
    styleUrls: ['./resident-parcel.component.css']
})
export class ResidentParcelComponent implements OnInit {
    parcels: Activity[] = [];
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
        this.loadParcels();
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    loadParcels() {
        const user = this.authService.currentUserValue;
        if (user && user.id) {
            this.activityService.getActivities('Parcel', user.id).subscribe({
                next: (data) => {
                    this.parcels = data;
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Resident Parcel Load Error:', err);
                    this.loading = false;
                    const errorMessage = err.error?.error || err.error?.message || 'Failed to load parcels.';
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
                this.snackBar.open(`Parcel ${status.toLowerCase()}!`, 'Close', { duration: 2000 });
                this.loadParcels();
            },
            error: () => {
                this.snackBar.open('Failed to update status.', 'Close', { duration: 3000 });
            }
        });
    }

    getStatusColor(status: string): string {
        switch (status) {
            case 'Received': return 'accent';
            case 'Acknowledged': return 'primary';
            case 'Collected': return 'basic';
            default: return 'basic';
        }
    }

    getWaitingCount(): number {
        return this.parcels.filter(p => p.status !== 'Collected').length;
    }

    getCollectedCount(): number {
        return this.parcels.filter(p => p.status === 'Collected').length;
    }
}
