import { Injectable, OnDestroy } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  User,
  signInWithPopup,
  user,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  public storageTokenPrefix: string = 'personal-frags-token';

  public user$: Observable<User | null>;
  public isLoggedIn: boolean = Boolean(this.getTokenOnStorage());
  public userSubscription: Subscription;

  constructor(public auth: Auth, private router: Router) {
    this.user$ = user(this.auth as any);
    this.userSubscription = this.user$.subscribe((aUser: User | null) => {
      console.log(aUser);

      //@ts-ignore
      if (aUser?.accessToken) {
        //@ts-ignore
        this.setTokenOnStorage(aUser?.accessToken);
      } else {
        this.clearToken();
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  public signIn() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider).then((result) => {
      if (result.user) {
        //@ts-ignore
        this.setTokenOnStorage(result.user.accessToken);
        this.router.navigate(['/']);
      }
    });
  }

  public signOut() {
    this.auth.signOut();
    this.router.navigate(['/login']);
  }

  public isAuthenticated(): boolean {
    const token = this.getTokenOnStorage();
    const jwtHelper = new JwtHelperService();
    return Boolean(token) && !jwtHelper.isTokenExpired(token);
  }

  public setTokenOnStorage(token: string): void {
    localStorage.setItem(this.storageTokenPrefix, token);
  }

  public getTokenOnStorage() {
    return localStorage.getItem(this.storageTokenPrefix);
  }

  public clearToken() {
    return localStorage.removeItem(this.storageTokenPrefix);
  }
}
