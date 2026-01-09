import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule, 
    MatListModule, 
    MatButtonModule, 
    MatIconModule, 
    MatDividerModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Input() jobs: any[] = [];
  @Input() selectedJobId: number | null = null;
  @Output() onSelectJob = new EventEmitter<any>();
  @Output() onAddJob = new EventEmitter<void>();
  @Output() onDeleteJob = new EventEmitter<void>();
}
