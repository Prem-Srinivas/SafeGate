import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';
import { API_URL } from '../../core/constants';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, MatSnackBarModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    registerForm: FormGroup;
    loading = false;
    error = '';
    selectedRole = 'Resident'; // Default role
    showPassword = false;

    roles = [
        { id: 'Security Guard', label: 'Security Guard', desc: 'Log visitors and parcels', icon: 'shield' },
        { id: 'Resident', label: 'Resident', desc: 'Approve visitors, track parcels', icon: 'home' },
        { id: 'Admin', label: 'Admin', desc: 'Full system access', icon: 'settings' }
    ];

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private http: HttpClient,
        private snackBar: MatSnackBar,
        private authService: AuthService
    ) {
        // Redirect if already logged in
        if (this.authService.currentUserValue) {
            const user = this.authService.currentUserValue;
            if (user.role === 'Admin') {
                this.router.navigate(['/admin']);
            } else if (user.role === 'Security Guard') {
                this.router.navigate(['/visitors']);
            } else if (user.role === 'Resident') {
                this.router.navigate(['/my-visitors']);
            }
        }

        this.registerForm = this.formBuilder.group({
            name: ['', Validators.required],
            phone: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            role: [this.selectedRole, Validators.required],
            unitNumber: [''],
            badgeNumber: ['']
        });
    }

    get f() { return this.registerForm.controls; }

    selectRole(roleId: string) {
        this.selectedRole = roleId;

        // Reset the form but keep the selected role
        this.registerForm.reset({
            role: roleId,
            name: '',
            phone: '',
            email: '',
            password: '',
            unitNumber: '',
            badgeNumber: ''
        });

        // Reset role-specific validators
        this.registerForm.get('unitNumber')?.clearValidators();
        this.registerForm.get('badgeNumber')?.clearValidators();

        if (roleId === 'Resident') {
            this.registerForm.get('unitNumber')?.setValidators([Validators.required]);
        } else if (roleId === 'Security Guard') {
            this.registerForm.get('badgeNumber')?.setValidators([Validators.required]);
        }

        this.registerForm.get('unitNumber')?.updateValueAndValidity();
        this.registerForm.get('badgeNumber')?.updateValueAndValidity();
    }

    togglePassword() {
        this.showPassword = !this.showPassword;
    }

    onSubmit() {
        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            // Trigger native browser validation UI
            const form = document.querySelector('form');
            if (form) {
                form.reportValidity();
            }
            return;
        }

        this.loading = true;
        this.error = '';

        const payload: any = {
            name: this.registerForm.value.name,
            role: this.registerForm.value.role,
            email: this.registerForm.value.email,
            contact_info: this.registerForm.value.phone,
            password: this.registerForm.value.password
        };

        // Add role-specific data
        if (this.registerForm.value.role === 'Resident' && this.registerForm.value.unitNumber) {
            payload.unit_number = this.registerForm.value.unitNumber;
        } else if (this.registerForm.value.role === 'Security Guard' && this.registerForm.value.badgeNumber) {
            payload.badge_number = this.registerForm.value.badgeNumber;
        }

        this.http.post(`${API_URL}/users/register`, payload)
            .subscribe({
                next: () => {
                    this.snackBar.open('Account created successfully! Please login.', 'OK', {
                        duration: 3000,
                        verticalPosition: 'top'
                    });
                    this.router.navigate(['/login']);
                },
                error: error => {
                    this.error = error.error?.message || 'Registration failed';
                    this.loading = false;
                    this.snackBar.open(this.error, 'Close', {
                        duration: 5000,
                        verticalPosition: 'top',
                        panelClass: ['error-snackbar']
                    });
                }
            });
    }
}
