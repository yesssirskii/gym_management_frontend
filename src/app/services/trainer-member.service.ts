import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrainerService {
  constructor(private http: HttpClient) { }

  getTrainers(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/Trainers/trainers`);
  }

  getTrainerById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/trainers/${id}`);
  }

  getTrainerMembers(trainerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/trainers/${trainerId}/members`);
  }

  getMemberTrainer(memberId: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/members/${memberId}/trainer`);
  }

  assignMemberToTrainer(trainerId: number, assignmentData: any): Observable<any> {
    const formData = new FormData();
    Object.keys(assignmentData).forEach(key => {
      if (assignmentData[key] !== null && assignmentData[key] !== undefined) {
        formData.append(key, assignmentData[key]);
      }
    });
    return this.http.post(`${environment.apiUrl}/trainers/${trainerId}/members`, formData);
  }

  removeMemberFromTrainer(trainerId: number, memberId: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/trainers/${trainerId}/members/${memberId}`);
  }
}