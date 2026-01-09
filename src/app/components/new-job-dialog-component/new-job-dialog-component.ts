import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-job-dialog-component',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule
  ],
  templateUrl: './new-job-dialog-component.html',
  styleUrl: './new-job-dialog-component.css',
})
export class NewJobDialogComponent {

  jobData = {
    roleName: '',
    requirementsText: ''
  };

  constructor(
    public dialogRef: MatDialogRef<NewJobDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { isFirstJob: boolean }
  ) {}

  onSave(): void {
    if (this.jobData.roleName && this.jobData.requirementsText) {
      this.dialogRef.close(this.jobData);
    }
  }
}
