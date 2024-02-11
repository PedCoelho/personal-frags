import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  type OnInit,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  @Input() error: string | null = null;
  @Output() submitEM = new EventEmitter();

  public form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  public ngOnInit() {}

  public submit() {
    if (this.form.valid) {
      this.submitEM.emit(this.form.value);
    }
  }
}
