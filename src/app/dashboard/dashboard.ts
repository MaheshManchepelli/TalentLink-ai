import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, MatIconModule, MatDividerModule, MatButtonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  @Input() resume: any = null;
  @Output() onViewPdf = new EventEmitter<number>();
  @Output() onDelete = new EventEmitter<number>();

  getScoreBg(score: number): string {
    if (score >= 80) return '#4caf50';
    if (score >= 50) return '#ff9800';
    return '#f44336';
  }
}