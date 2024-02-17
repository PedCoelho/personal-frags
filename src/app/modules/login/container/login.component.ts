import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  type OnInit,
} from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  User,
  signInWithPopup,
  user,
} from '@angular/fire/auth';
import { Observable, Subscription } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, OnDestroy {
  public user$: Observable<User | null>;
  public userSubscription: Subscription;
  public imageSrc =
    'https://neurosciencenews.com/files/2023/11/covid-smell-loss-treatment-neurosince.jpg';

  constructor(private auth: Auth) {
    this.user$ = user(this.auth as any);
    this.userSubscription = this.user$.subscribe((aUser: User | null) => {
      console.log(aUser);
    });
  }

  ngOnDestroy() {
    // when manually subscribing to an observable remember to unsubscribe in ngOnDestroy
    this.userSubscription.unsubscribe();
  }

  public ngOnInit() {}

  public submit() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider);
  }
}
