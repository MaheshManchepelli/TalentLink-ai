import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class JobService {
  private apiUrl =  environment.apiUrl + '/jobs';  

  constructor(private http: HttpClient) {}

  getJobs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createJob(jobData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, jobData);
  }

  deleteJob(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}