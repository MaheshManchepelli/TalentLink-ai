import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Added for search/inputs
import { ChangeDetectorRef } from '@angular/core';

// Existing Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatFormFieldModule} from '@angular/material/form-field';

// New Imports for the Sidebar & Navigation
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { JobService } from './services/job-service';
import { ResumeService } from './services/resume-service';
import { NewJobDialogComponent } from './components/new-job-dialog-component/new-job-dialog-component';
import { MatDialog } from '@angular/material/dialog';
import { Sidebar } from './components/sidebar/sidebar';
import { Dashboard } from "./dashboard/dashboard";
import { ResumeList } from './components/resume-list/resume-list';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // ✅ New
    MatCardModule,
    MatChipsModule,
    MatProgressBarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatSidenavModule, // ✅ New
    MatListModule, // ✅ New
    MatToolbarModule, // ✅ New
    MatMenuModule,
    Dashboard,
    MatFormFieldModule,
    NewJobDialogComponent,
    Sidebar,
    Dashboard,
    ResumeList
],
  templateUrl: 'app.html',
  styleUrl: 'app.css'
})
export class App implements OnInit {

  @ViewChild('sidenav') sidenav: Sidebar | undefined;
  @ViewChild('resumeList') resumeList: ResumeList | undefined;

  selectedJob: any = null;
  resumes: any[] = [];
  selectedResume: any = null;
  selectedFile: File | null = null;
  dataFetchingInProgress = false;
  

  constructor(private jobService: JobService,
    private resumeService: ResumeService, 
    private cdr : ChangeDetectorRef,
    private dialog: MatDialog,
    private titleService: Title
  ) {
    this.titleService.setTitle("TalentLink-AI | Applicant Tracking");
  }


   
  onJobSelected(job: any) {
    this.selectedJob = job;
    this.selectedResume = null;
    this.loadResumes();
  }

  loadResumes() {
    if (this.selectedJob) {
      this.resumeService.getResumesByJob(this.selectedJob.id, 0, 50)
        .subscribe(data => {
          this.resumes = data.content;
          if(this.resumes && this.resumes.length > 0) {
            this.onResumeSelect(this.resumes[0].id);
          }
          this.cdr.detectChanges();
        });
    }
  }

  handleBatchUpload(files: File[]) {
    if (this.selectedJob) {
      this.resumeService.uploadResumes(this.selectedJob.id, files).subscribe({
        next: () => {
          this.loadResumes(); // Refresh the list after AI finishes
        },
        error: (err) => console.error("Upload failed", err)
      });
    }
  }

  onResumeSelect(resumeId: number) {
    this.resumeService.getResumeDetails(resumeId).subscribe(data => {
      this.selectedResume = data;
      this.cdr.detectChanges();
    });
  }


  openPdfViewer(resumeId: number) {
    this.resumeService.downloadPdf(resumeId).subscribe(blob => {
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, '_blank');
    });
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] || null;
  }

  onUpload() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    this.dataFetchingInProgress = true;
   this.resumeService.uploadResumes(0, [this.selectedFile]).subscribe({
        next: (res) => {
          this.selectedResume = res;               // ✅ UI WILL UPDATE
          this.dataFetchingInProgress = false;
          this.loadHistory();                        // ✅ REFRESH HISTORY
        },
        error: (err) => {
          this.dataFetchingInProgress = false;
        }
      });
  }

  history: any[] = [];
  isDragging = false;

  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.loadJobs();

    // Set up debounced search
    this.searchSubject.pipe(
      debounceTime(300),          // Wait 300ms after last keystroke
      distinctUntilChanged()      // Only search if the text actually changed
    ).subscribe(query => {
      this.performBackendSearch(query);
    });
  }


  loadJobs() {
    this.jobService.getJobs().subscribe(res => {
      this.jobs = res;
      this.isLoading = false;
      if(this.jobs.length === 0) {
        this.openFirstJobModal();
      } else {
        this.selectedJob = this.jobs[0];
        this.loadResumes();
      }
      this.cdr.detectChanges();
    });
  }

  onSearch(searchQuery: string) {
    this.searchSubject.next(searchQuery);
  }

  performBackendSearch(query: string) {
    this.resumeService.getResumesByJob(this.selectedJob.id, 0, 20, query).subscribe(res => {
        this.history = res;
        this.resumeList?.cdr.detectChanges();
        this.cdr.detectChanges();
      });
  }

  loadHistory() {
    this.resumeService.getResumesByJob(0, 0, 20).subscribe(res => {
      this.history = res; 
      this.cdr.detectChanges();
    });
  }

  // Fetch specific resume details on click
  fetchResumeDetails(id: number) {
    this.resumeService.getResumeDetails(id).subscribe(res => {
        this.selectedResume = res;
      this.cdr.detectChanges();
    });
  }

  onDelete(id: number) {
    // 1. Ask for confirmation (optional but recommended)
    if (!confirm('Are you sure you want to delete this analysis?')) return;

   this.resumeService.deleteResume(id).subscribe({
        next: () => {
           this.history = this.history.filter(item => item.id !== id);

          // 4. If this was the selected resume, clear the dashboard
          if (this.selectedResume?.id === id) {
            this.selectedResume = null;
          }
          
          this.cdr.detectChanges();
        },
        error: (err : Error) => console.error('Delete failed', err)
      });
  }

  // Placeholder methods for Pin and Rename
  onPin(item: any) { console.log('Pinning:', item.candidateName); }
  onRename(item: any) { console.log('Renaming:', item.candidateName); }

  onDragOver(event: DragEvent) {
  event.preventDefault();
  this.isDragging = true;
}

onDragLeave(event: DragEvent) {
  event.preventDefault();
  this.isDragging = false;
}

onDrop(event: DragEvent) {
  event.preventDefault();
  this.isDragging = false;

  const file = event.dataTransfer?.files[0];
  if (file && file.type === 'application/pdf') {
    this.selectedFile = file;
  }
}

  jobs: any[] = [];
  isLoading = true;

  openFirstJobModal() {
    const dialogRef = this.dialog.open(NewJobDialogComponent, {
      width: '600px',
      disableClose: true, // Prevent closing by clicking outside if it's the first job
      data: { isFirstJob: this.jobs?.length === 0 }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Create the job via service
        this.jobService.createJob(result).subscribe(() => {
          this.loadJobs();
        });
      }
    });
  }

deleteJob(job: any) {
  if (confirm(`Are you sure you want to delete "${job.roleName}" and all its candidates?`)) {
    this.jobService.deleteJob(job.id).subscribe(() => {
      this.loadJobs(); // Refresh sidebar
      this.selectedJob = null;
      this.resumes = [];
    });
  }
}

deleteResume(resumeId: any) {
  if (confirm('Remove this candidate?')) {
    this.resumeService.deleteResume(resumeId).subscribe(() => {
      this.selectedResume = null;
      this.loadResumes(); // Refresh middle list
    });
  }
}
}
