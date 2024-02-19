import { Injectable, OnDestroy } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  User,
  signInWithPopup,
  user,
} from '@angular/fire/auth';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  public storageTokenPrefix: string = 'personal-frags-token';

  public user$: Observable<User | null>;
  public isLoggedIn: boolean = false;
  public userSubscription: Subscription;

  constructor(public auth: Auth) {
    this.user$ = user(this.auth as any);
    this.userSubscription = this.user$.subscribe((aUser: User | null) => {
      console.log(aUser);
      this.isLoggedIn = aUser ? true : false;

      //@ts-ignore
      if (aUser.accessToken) {
        //@ts-ignore
        this.setTokenOnStorage(aUser.accessToken);
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  public signIn(redirectUrl?: string) {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider, redirectUrl);
  }

  public signOut() {
    this.auth.signOut();
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
