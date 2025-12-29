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
    selector: 'app-visitor-log',
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
    templateUrl: './visitor-log.component.html',
    styleUrls: ['./visitor-log.component.css']
})
export class VisitorLogComponent implements OnInit {
    currentUser: User | null = null;
    visitorForm: FormGroup;
    loading = false;
    recentVisitors: any[] = [];
    searchTerm: string = '';

    constructor(
        private fb: FormBuilder,
        private activityService: ActivityService,
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar
    ) {
        this.visitorForm = this.fb.group({
            name_details: ['', [Validators.required]],
            purpose_description: ['', [Validators.required]],
            vehicle_details: [''],
            unit_number: ['', [Validators.required]],
            media: [''] // For photo/ID proof URL
        });
    }

    ngOnInit(): void {
        this.authService.user$.subscribe(user => {
            this.currentUser = user;
        });
        this.loadRecentVisitors();
    }

    loadRecentVisitors() {
        this.activityService.getActivities('Visitor').subscribe(data => {
            this.recentVisitors = data.slice(0, 10);
        });
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    onSubmit() {
        if (this.visitorForm.invalid) {
            return;
        }

        this.loading = true;

        const activityData = {
            ...this.visitorForm.value,
            type: 'Visitor',
            status: 'Waiting for Approval',
            // security_guard_id handled by backend
        };

        this.activityService.logActivity(activityData).subscribe({
            next: () => {
                this.loading = false;
                this.snackBar.open('Visitor logged successfully! Waiting for resident approval.', 'Close', {
                    duration: 3000,
                    panelClass: ['success-snackbar']
                });
                this.visitorForm.reset();
                this.loadRecentVisitors(); // Refresh list
            },
            error: (err) => {
                this.loading = false;
                console.error('Visitor Log Error:', err);
                const errorMessage = err.error?.error || err.error?.message || 'Failed to log visitor.';
                this.snackBar.open(errorMessage, 'Close', {
                    duration: 5000,
                    panelClass: ['error-snackbar']
                });
            }
        });
    }

    exitVisitor(visitor: any) {
        if (!confirm(`Are you sure you want to mark ${visitor.name_details} as Exited?`)) {
            return;
        }

        this.activityService.updateStatus(visitor.id, 'Exited').subscribe({
            next: () => {
                this.snackBar.open(`${visitor.name_details} has been marked as Exited.`, 'Close', {
                    duration: 3000,
                    panelClass: ['success-snackbar']
                });
                this.loadRecentVisitors();
            },
            error: (err) => {
                console.error('Exit Visitor Error:', err);
                this.snackBar.open('Failed to update status.', 'Close', {
                    duration: 3000,
                    panelClass: ['error-snackbar']
                });
            }
        });
    }

    enterVisitor(visitor: any) {
        if (!confirm(`Confirm entry for ${visitor.name_details}?`)) {
            return;
        }

        this.activityService.updateStatus(visitor.id, 'Entered').subscribe({
            next: () => {
                this.snackBar.open(`${visitor.name_details} marked as Entered.`, 'Close', {
                    duration: 3000,
                    panelClass: ['success-snackbar']
                });
                this.loadRecentVisitors();
            },
            error: (err) => {
                console.error('Enter Visitor Error:', err);
                this.snackBar.open('Failed to update status.', 'Close', {
                    duration: 3000,
                    panelClass: ['error-snackbar']
                });
            }
        });
    }
}
