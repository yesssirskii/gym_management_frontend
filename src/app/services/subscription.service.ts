import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  constructor(private http: HttpClient) { }

  getSubscriptions(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/Subscription/subscriptions`);
  }

  getUserActiveSubscription(userId: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/Subscription/${userId}`);
  }

  updateUserSubscription(id: number, subscriptionData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put(`${environment.apiUrl}/Subscription/${id}`, subscriptionData);
  }

  renewSubscription(id: number, subscriptionData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put(`${environment.apiUrl}/Subscription/renew/${id}`, subscriptionData);
  }

  getSubscriptionPrices(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/subscriptions/prices`);
  }
}