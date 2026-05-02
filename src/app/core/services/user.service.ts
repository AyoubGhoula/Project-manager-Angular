import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { UserRecord } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/users';

  checkEmailExists(email: string): Observable<boolean> {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      return of(false);
    }

    return this.http
      .get<UserRecord[]>(`${this.apiUrl}?email=${encodeURIComponent(normalizedEmail)}`)
      .pipe(
        map((users) => users.length > 0),
        delay(600),
        catchError(() => of(false))
      );
  }
}
