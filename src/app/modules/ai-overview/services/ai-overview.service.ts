import { Injectable } from '@angular/core';
import { HttpService } from 'app/modules/shared/services/http.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AIOverviewService {
  constructor(private http: HttpService) {}

  //todo type response
  public getAIOverview(id: string): Observable<any> {
    return this.http.get(
      `${environment.apiBaseUrl}/frag/perfume/${id}/ai-overview`
    );
  }
}
