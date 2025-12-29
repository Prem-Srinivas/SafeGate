import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VisitorService } from '../../../core/services/visitor.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-visitor-log',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './visitor-log.component.html'
})
export class VisitorLogComponent {
  visitorForm;

  constructor(
    private fb: FormBuilder,
    private visitorService: VisitorService,
    private snackBar: MatSnackBar
  ) {
    this.visitorForm = this.fb.group({
      name: ['', Validators.required],
      purpose: ['', Validators.required],
      vehicleDetails: ['']
    });
  }

  submit() {
    if (this.visitorForm.invalid) {
      this.snackBar.open('Please fill required fields', 'Close', { duration: 3000 });
      return;
    }

    this.visitorService.logVisitor(this.visitorForm.value as any).subscribe({
      next: () => {
        this.snackBar.open('Visitor logged successfully', 'Close', { duration: 3000 });
        this.visitorForm.reset();
      },
      error: () => {
        this.snackBar.open('Failed to log visitor', 'Close', { duration: 3000 });
      }
    });
  }
}
