import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-resume-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatListModule, 
    MatIconModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
    MatProgressBarModule
  ],
  templateUrl: './resume-list.html',
  styleUrl: './resume-list.css',
})
export class ResumeList {
  @Input() resumes: any[] = [];
  @Input() selectedResumeId: number | null = null;
  @Output() onSelectResume = new EventEmitter<number>();
  @Output() onUploadResumes = new EventEmitter<File[]>();
  @Output() onSearch = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<number>();

  searchQuery: string = '';

  constructor(public cdr : ChangeDetectorRef) {}

  onUpload(event: any) {
    const files = Array.from(event.target.files) as File[];
    if (files.length > 0) {
      this.onUploadResumes.emit(files);
    }
  }

  getScoreColor(score: number): string {
    if (score >= 80) return '#4caf50'; // Green
    if (score >= 50) return '#ff9800'; // Orange
    return '#f44336'; // Red
  }
}
