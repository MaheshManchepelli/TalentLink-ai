import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ResumeService {
  
  private apiUrl =  environment.apiUrl + '/resumes';

  constructor(private http: HttpClient) {}

  // Fetch resumes for a specific job with pagination and search
  getResumesByJob(jobId: number, page: number, size: number, query: string = ''): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('q', query);

    return this.http.get<any>(`${this.apiUrl}/job/${jobId}`, { params });
  }

  // Handle single or multiple file uploads
  uploadResumes(jobId: number, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    return this.http.post(`${this.apiUrl}/upload-batch/${jobId}`, formData);
  }

  getResumeDetails(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getAnalytics/${id}`);
  }

  downloadPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download`, { responseType: 'blob' });
  }

  deleteResume(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}