import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  type OnInit,
} from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  User,
  signInWithPopup,
  user,
} from '@angular/fire/auth';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, OnDestroy {
  @Input() error: string | null = null;
  @Output() submitEM = new EventEmitter();

  public form: UntypedFormGroup = new UntypedFormGroup({
    username: new UntypedFormControl(''),
    password: new UntypedFormControl(''),
  });

  public user$: Observable<User | null>;
  public userSubscription: Subscription;

  constructor(private auth: Auth) {
    this.user$ = user(this.auth as any);
    this.userSubscription = this.user$.subscribe((aUser: User | null) => {
      //handle user state changes here. Note, that user will be null if there is no currently logged in user.
      console.log(aUser);
    });
  }

  ngOnDestroy() {
    // when manually subscribing to an observable remember to unsubscribe in ngOnDestroy
    this.userSubscription.unsubscribe();
  }

  public ngOnInit() {}

  public submit() {
    if (this.form.valid) {
      const provider = new GoogleAuthProvider();
      signInWithPopup(this.auth, provider);
    }
  }

  public successCallback(evt: any) {
    console.log(evt);
  }
  public errorCallback(evt: any) {
    console.log(evt);
  }
}
