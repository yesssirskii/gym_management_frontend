import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  getMembers(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/User/members`);
  }

  getMemberById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/User/${id}`);
  }

  getPersonnel(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/User/personnel`);
  }

  getTrainers(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/User/trainers`);
  }

  getPersonnelById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/User/${id}`);
  }

  createUser(userData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(`${environment.apiUrl}/User/new`, userData, { headers });
  }

  updateUser(id: number, isSubscriptionUpdate: boolean, userData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.put(`${environment.apiUrl}/User/${id}/${isSubscriptionUpdate}`, userData, { headers });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/User/${id}`);
  }
}