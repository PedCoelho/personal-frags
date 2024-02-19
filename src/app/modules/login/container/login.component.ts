import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  public imageSrc =
    'https://neurosciencenews.com/files/2023/11/covid-smell-loss-treatment-neurosince.jpg';

  constructor(private authService: AuthService) {}

  public submit() {
    this.authService.signIn();
  }
}
