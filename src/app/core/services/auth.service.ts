import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { User } from '../models/user.model';
import { API_URL } from '../constants';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export type Role = 'Resident' | 'Security Guard' | 'Admin';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<User | null>;
  public user$: Observable<User | null>;

  // Derived observable for Navbar compatibility
  public role$: Observable<Role | null>;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.userSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    this.user$ = this.userSubject.asObservable();
    this.role$ = this.user$.pipe(map(user => user ? user.role : null));
  }

  public get currentUserValue(): User | null {
    return this.userSubject.value;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${API_URL}/users/login`, { email, password }).pipe(
      tap((response: any) => {
        if (response.user && response.token) {
          const userWithToken = { ...response.user, token: response.token };
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify(userWithToken));
          }
          this.userSubject.next(userWithToken);
        }
      })
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  // For simulation/demo purposes: Allow switching roles without re-login
  setRole(role: Role) {
    const currentUser = this.userSubject.value;
    if (currentUser) {
      const updatedUser = { ...currentUser, role };
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
      this.userSubject.next(updatedUser);
    }
  }

  private getUserFromStorage(): User | null {
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem('currentUser');
      return userJson ? JSON.parse(userJson) : null;
    }
    return null;
  }
}
