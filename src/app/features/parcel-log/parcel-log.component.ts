import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ActivityService } from '../../core/services/activity.service';
import { AuthService } from '../../core/services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';

import { User } from '../../core/models/user.model';

@Component({
    selector: 'app-parcel-log',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatSnackBarModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './parcel-log.component.html',
    styleUrls: ['./parcel-log.component.css']
})
export class ParcelLogComponent implements OnInit {
    currentUser: User | null = null;
    parcelForm: FormGroup;
    loading = false;
    recentParcels: any[] = [];
    searchTerm: string = '';

    constructor(
        private fb: FormBuilder,
        private activityService: ActivityService,
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar
    ) {
        this.parcelForm = this.fb.group({
            name_details: ['', [Validators.required]], // Parcel Description
            purpose_description: ['Parcel Delivery', [Validators.required]],
            unit_number: ['', [Validators.required]],
            media: [''] // Optional Photo URL
        });
    }

    ngOnInit(): void {
        this.authService.user$.subscribe(user => {
            this.currentUser = user;
        });
        this.loadRecentParcels();
    }

    loadRecentParcels() {
        this.activityService.getActivities('Parcel').subscribe(data => {
            this.recentParcels = data.slice(0, 10); // Show last 10
        });
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    onSubmit() {
        if (this.parcelForm.invalid) {
            return;
        }

        this.loading = true;

        const activityData = {
            ...this.parcelForm.value,
            type: 'Parcel',
            status: 'Pending', // Changed to Pending as it usually waits collection
            // security_guard_id handled by backend
        };

        this.activityService.logActivity(activityData).subscribe({
            next: () => {
                this.loading = false;
                this.snackBar.open('Parcel logged successfully!', 'Close', { duration: 3000 });
                this.parcelForm.reset({ purpose_description: 'Parcel Delivery' });
                this.loadRecentParcels(); // Refresh list
            },
            error: (err) => {
                this.loading = false;
                console.error('Parcel Log Error:', err);
                const errorMessage = err.error?.error || err.error?.message || 'Failed to log parcel.';
                this.snackBar.open(errorMessage, 'Close', {
                    duration: 5000,
                    panelClass: ['error-snackbar'] // Ensure this class exists or typical material snackbar just shows it
                });
            }
        });
    }
}
