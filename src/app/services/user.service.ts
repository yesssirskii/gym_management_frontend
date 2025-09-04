import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
    return this.http.get<any>(`${environment.apiUrl}/users/${id}`);
  }

  createUser(userData: any): Observable<any> {
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
      if (userData[key] !== null && userData[key] !== undefined) {
        formData.append(key, userData[key]);
      }
    });
    return this.http.post(`${environment.apiUrl}/User/create-new-user`, formData);
  }

  updateUser(id: number, userData: any): Observable<any> {
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
      if (userData[key] !== null && userData[key] !== undefined) {
        formData.append(key, userData[key]);
      }
    });
    return this.http.put(`${environment.apiUrl}/User/${id}`, formData);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/User/${id}`);
  }
}