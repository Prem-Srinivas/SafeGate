import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, MatSnackBarModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    loginForm: FormGroup;
    error = '';
    loading = false;
    showPassword = false;

    togglePassword() {
        this.showPassword = !this.showPassword;
    }

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService,
        private snackBar: MatSnackBar
    ) {
        // Redirect if already logged in
        if (this.authService.currentUserValue) {
            this.redirectByRole(this.authService.currentUserValue);
        }

        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    get f() { return this.loginForm.controls; }

    private redirectByRole(user: any) {
        // Case-insensitive role check just in case
        const role = user.role;

        if (role === 'Admin' || role === 'Security Guard' || role === 'Resident') {
            this.router.navigate(['/dashboard']);
        } else {
            console.warn('Unknown role:', role);
            // Stay on login or go to a default 404/unauthorized
            this.router.navigate(['/login']);
        }
    }

    onSubmit() {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            const form = document.querySelector('form');
            if (form) {
                form.reportValidity();
            }
            return;
        }

        this.loading = true;
        this.authService.login(this.f['email'].value, this.f['password'].value)
            .subscribe({
                next: (data) => {
                    this.snackBar.open('Login Successful', 'OK', { duration: 2000, verticalPosition: 'top' });
                    this.redirectByRole(this.authService.currentUserValue);
                },
                error: error => {
                    this.error = error.error?.message || 'Login failed';
                    this.loading = false;
                    this.snackBar.open(this.error, 'Close', {
                        duration: 3000,
                        verticalPosition: 'top',
                        panelClass: ['error-snackbar']
                    });
                }
            });
    }
}
