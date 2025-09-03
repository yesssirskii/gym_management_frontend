import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: UserInfoDto;
}

export interface UserInfoDto {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserInfoDto | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(credentials: LoginDto): Observable<LoginResponseDto> {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    return this.http.post<LoginResponseDto>(`${environment.apiUrl}/auth/login`, formData)
      .pipe(map(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
        
        return response;
      }));
  }

  logout(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    const formData = new FormData();
    if (refreshToken) {
      formData.append('refreshToken', refreshToken);
    }

    return this.http.post(`${environment.apiUrl}/auth/logout`, formData)
      .pipe(map(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
      }));
  }

  getCurrentUser(): UserInfoDto | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  hasRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    if (user.role && roles.includes(user.role)) return true;
    if (roles.includes(user.userType)) return true;
    
    return false;
  }
}