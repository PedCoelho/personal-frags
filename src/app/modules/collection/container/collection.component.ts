import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from 'app/modules/shared/services/auth.service';
@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionComponent {
  constructor(private authService: AuthService) {}

  public submit() {
    this.authService.signIn();
  }
}
