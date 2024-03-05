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
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  public storageTokenPrefix: string = 'personal-frags-token';

  public user$: Observable<User | null>;
  public loggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public userSubscription: Subscription;

  constructor(public auth: Auth, private router: Router) {
    this.initializeLoggedInState();

    this.user$ = user(this.auth as any);
    this.userSubscription = this.user$.subscribe((aUser: User | null) => {
      console.log(aUser);

      //@ts-ignore
      if (aUser?.accessToken) {
        //@ts-ignore
        this.setTokenOnStorage(aUser?.accessToken);
        this.loggedIn$.next(true);
      } else {
        this.clearToken();
      }
    });
  }

  private initializeLoggedInState() {
    this.loggedIn$.next(this.getTokenOnStorage() ? true : false);
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  public signIn() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider).then((result) => {
      console.log(result);
      if (result.user) {
        //@ts-ignore
        this.setTokenOnStorage(result.user.accessToken);
        setTimeout(() => this.router.navigate(['/']), 500);
      }
    });
  }

  public signOut() {
    this.auth.signOut();
    this.clearToken();
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
    this.loggedIn$.next(false);
    return localStorage.removeItem(this.storageTokenPrefix);
  }
}
