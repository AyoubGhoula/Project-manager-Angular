import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, tap, throwError } from 'rxjs';
import { RegisterPayload, User, UserRecord } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/users';
  private readonly storageKey = 'pm_current_user';

  private readonly currentUserSubject = new BehaviorSubject<User | null>(this.readStoredUser());

  readonly currentUser$ = this.currentUserSubject.asObservable();

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  register(payload: RegisterPayload): Observable<User> {
    const normalizedPayload = {
      ...payload,
      email: payload.email.trim().toLowerCase(),
    };

    return this.checkEmailExists(normalizedPayload.email).pipe(
      switchMap((exists) => {
        if (exists) {
          return throwError(() => new Error('EMAIL_EXISTS'));
        }

        return this.http.post<UserRecord>(this.apiUrl, normalizedPayload);
      }),
      map((user) => this.sanitizeUser(user)),
      tap((user) => this.setCurrentUser(user))
    );
  }

  login(email: string, password: string): Observable<User> {
    const normalizedEmail = email.trim().toLowerCase();
    const query = `${this.apiUrl}?email=${encodeURIComponent(normalizedEmail)}&password=${encodeURIComponent(password)}`;

    return this.http.get<UserRecord[]>(query).pipe(
      map((users) => users[0] ?? null),
      switchMap((user) => {
        if (!user) {
          return throwError(() => new Error('INVALID_CREDENTIALS'));
        }

        return of(this.sanitizeUser(user));
      }),
      tap((user) => this.setCurrentUser(user)),
      catchError((error) => throwError(() => error))
    );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
  }

  checkEmailExists(email: string): Observable<boolean> {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      return of(false);
    }

    return this.http
      .get<UserRecord[]>(`${this.apiUrl}?email=${encodeURIComponent(normalizedEmail)}`)
      .pipe(
        map((users) => users.length > 0),
        catchError(() => of(false))
      );
  }

  private setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(user));
    }
  }

  private readStoredUser(): User | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const raw = localStorage.getItem(this.storageKey);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  private sanitizeUser(user: UserRecord): User {
    const { password: _ignored, ...safeUser } = user;
    return safeUser;
  }
}
