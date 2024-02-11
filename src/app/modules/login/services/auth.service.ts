import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginArgs } from 'app/modules/login/models/login.models';
import { HttpService } from 'app/modules/shared/services/http.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public storageTokenPrefix: string = 'personal-frags';
  public storageTokenKey: string;

  constructor(private http: HttpService) {
    this.storageTokenKey = `${this.storageTokenPrefix}.token`;
  }

  //todo type  response
  public authenticate(params: LoginArgs): Observable<any> {
    return this.http.post('', {
      password: params.password,
      username: params.user,
    });
  }

  public isAuthenticated(): boolean {
    const token = this.getTokenOnStorage();
    const jwtHelper = new JwtHelperService();
    return Boolean(token) && !jwtHelper.isTokenExpired(token);
  }

  public setTokenOnStorage(token: string): void {
    localStorage.setItem(this.storageTokenKey, token);
  }

  public getTokenOnStorage() {
    return localStorage.getItem(this.storageTokenKey);
  }
}
