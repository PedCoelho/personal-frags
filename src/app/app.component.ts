import { Component } from '@angular/core';
import { Auth, User, user } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public title = 'personal-frags';
  public user$: Observable<User | null>;

  constructor(private auth: Auth) {
    this.user$ = user(auth as any);
  }

  public signOut() {
    this.auth.signOut();
  }
}
