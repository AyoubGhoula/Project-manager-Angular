import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly existingEmails = [
    'admin@demo.fr',
    'contact@entreprise.fr',
    'john.doe@mail.com',
  ];

  checkEmailExists(email: string): Observable<boolean> {
    const normalizedEmail = email.trim().toLowerCase();
    const exists = this.existingEmails.includes(normalizedEmail);

    return of(exists).pipe(delay(900));
  }
}
