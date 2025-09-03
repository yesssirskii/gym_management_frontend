import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
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

  updateUserSubscription(subscriptionData: any): Observable<any> {
    const formData = new FormData();
    Object.keys(subscriptionData).forEach(key => {
      if (subscriptionData[key] !== null && subscriptionData[key] !== undefined) {
        formData.append(key, subscriptionData[key]);
      }
    });
    return this.http.put(`${environment.apiUrl}/subscriptions/update`, formData);
  }

  getSubscriptionPrices(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/subscriptions/prices`);
  }
}